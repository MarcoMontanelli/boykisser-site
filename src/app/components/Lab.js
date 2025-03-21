'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';



import '98.css';
import { motion, AnimatePresence } from "framer-motion";
import { Press_Start_2P } from 'next/font/google';
import PF from 'pathfinding';
import Minimap from './Minimap';




const generateMazeMatrix = (size) => {
    // Create a grid filled with walls (1)
    const matrix = Array(size).fill(null).map(() => Array(size).fill(1));

    const directions = [
        [0, 2], [0, -2], [2, 0], [-2, 0]
    ];

    // Function to check if a cell is within bounds
    const inBounds = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1;

    // Start Prim's Algorithm from a random position
    let startX = 1, startY = 1;
    matrix[startY][startX] = 0; // Open the first cell
    let walls = [[startX, startY]];

    while (walls.length > 0) {
        let [x, y] = walls.pop();

        // Shuffle directions to randomize paths
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            let mx = x + dx / 2, my = y + dy / 2;

            if (inBounds(nx, ny) && matrix[ny][nx] === 1) {
                matrix[ny][nx] = 0;  // Open a new path
                matrix[my][mx] = 0;  // Remove the wall between
                walls.push([nx, ny]);
            }
        }
    }

    // 🏠 Carve out random rooms
    for (let i = 0; i < Math.floor(size / 3); i++) {
        let rx = Math.floor(Math.random() * (size - 4)) + 2;
        let ry = Math.floor(Math.random() * (size - 4)) + 2;
        let rw = Math.floor(Math.random() * 3) + 2;
        let rh = Math.floor(Math.random() * 3) + 2;

        for (let x = rx; x < Math.min(rx + rw, size - 1); x++) {
            for (let y = ry; y < Math.min(ry + rh, size - 1); y++) {
                matrix[y][x] = 0;
            }
        }
    }

    // 🚪 Place exit at bottom row in an open space
    let exitPlaced = false;
    for (let x = 1; x < size - 1; x++) {
        if (matrix[size - 2][x] === 0) {
            matrix[size - 1][x] = 2; // Mark exit
            exitPlaced = true;
            break;
        }
    }

    // If no exit was placed, forcefully open one
    if (!exitPlaced) {
        for (let x = 1; x < size - 1; x++) {
            if (matrix[size - 2][x] === 0) {
                matrix[size - 1][x] = 2;
                exitPlaced = true;
                break;
            }
        }
    }

    if (!exitPlaced) throw new Error("🚨 No valid exit placement found!");

    return matrix;
};







const pixelFont = Press_Start_2P({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-pixel',
});

export default function LabyrinthGame() {
    const gameContainerRef = useRef(null);
    const [gameWon, setGameWon] = useState(false);
    const winSoundRef = useRef(null);
    const staminaRef = useRef(100); // Create a ref for stamina
    const [showCredits, setShowCredits] = useState(false);  // Controls the credits modal visibility
    const [showControls, setShowControls] = useState(false);  // Controls the controls overlay visibility
    const [items, setItems] = useState([]); // Items on the floor
    const [inventory, setInventory] = useState([]); // React state
    const inventoryRef = useRef([]); // Ref to track latest inventory
    const [lightsOn, setLightsOn] = useState(false); // Default: Flashlight mode
    const backgroundMusic = useRef(null);
    const ambientNoise = useRef(null);
    const pickupSound = useRef(null);
    const victorySound = useRef(null);
    const walkingSound = useRef(null);
    const runningSound = useRef(null);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 }); // Track player position in state
    const [mazeMatrix, setMazeMatrix] = useState(null);
    const [loadingMaze, setLoadingMaze] = useState(true);

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    const [showPickupPrompt, setShowPickupPrompt] = useState(false);
    const [showCollectedMessage, setShowCollectedMessage] = useState(false);
    const itemsRef = useRef([]); // Store items without triggering re-renders
    const gameWonRef = useRef(false); // ✅ Track if victory was triggered
    useEffect(() => {
        setLoadingMaze(true);

        setTimeout(() => {
            try {
                const newMaze = generateMazeMatrix(16);
                setMazeMatrix(newMaze);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingMaze(false);
            }
        }, 1000); // Simulated delay
    }, []);


    useEffect(() => {
        if (itemsRef.current.length > 0) {
            console.log("🔄 Syncing Items to State:", itemsRef.current);
            setItems([...itemsRef.current]); // Force state update
        }
    }, [itemsRef.current]); // Trigger when `itemsRef.current` changes

    useEffect(() => {
        inventoryRef.current = inventory;
        console.log("👜 Inventory Updated in Ref:", inventoryRef.current);
    }, [inventory]); // Runs whenever inventory changes

    useEffect(() => {
        function initializeAudio() {
            // ✅ Initialize and configure background music
            backgroundMusic.current = new Audio('/game/audio/music.mp3');
            backgroundMusic.current.loop = true;
            backgroundMusic.current.volume = 0.4; // Adjust volume

            // ✅ Initialize ambient noise
            ambientNoise.current = new Audio('/game/sounds/hum.mp3');
            ambientNoise.current.loop = true;
            ambientNoise.current.volume = 0.1; // Adjust volume

            // ✅ Initialize pickup sound (doesn't loop)
            pickupSound.current = new Audio('/game/sounds/pickup.mp3');
            pickupSound.current.volume = 1.0; // Loud for effect

            // ✅ Start playing background sounds
            backgroundMusic.current.play().catch(err => console.log("🔇 Audio blocked until user interaction", err));
            ambientNoise.current.play().catch(err => console.log("🔇 Audio blocked until user interaction", err));

            // ✅ Initialize victory sound
            victorySound.current = new Audio('/game/sounds/victory.mp3');
            victorySound.current.volume = 1.0;

            walkingSound.current = new Audio('/game/sounds/walk.wav');
            walkingSound.current.loop = true;
            walkingSound.current.volume = 0.6; // Adjust volume

            runningSound.current = new Audio('/game/sounds/run.mp3');
            runningSound.current.loop = true;
            runningSound.current.volume = 0.8; // Slightly louder for emphasis

            document.addEventListener("click", startAudioOnce);
        }
        function startAudioOnce() {
            backgroundMusic.current.play().catch(err => console.log("🔇 Audio blocked:", err));
            ambientNoise.current.play().catch(err => console.log("🔇 Audio blocked:", err));
            walkingSound.current.play().catch(err => console.log("🔇 Audio blocked:", err));
            runningSound.current.play().catch(err => console.log("🔇 Audio blocked:", err));
            // Remove event listener after first interaction
            document.removeEventListener("click", startAudioOnce);
        }

        initializeAudio();

        return () => {
            if (backgroundMusic.current) backgroundMusic.current.pause();
            if (ambientNoise.current) ambientNoise.current.pause();
            if (walkingSound.current) walkingSound.current.pause();
            if (runningSound.current) runningSound.current.pause();
        };
    }, []);


    const activeEffectRef = useRef(false);




    // ✅ Stamina & Sprinting Hooks (Placed Correctly)
    const [stamina, setStamina] = useState(100); // Stamina starts full
    const [isSprinting, setIsSprinting] = useState(false);

    // ✅ Jumping & Gravity
    let velocityY = 0; // ✅ Use `let` since it's constantly changing

    const gravity = -0.005; // Gravity strength


    useEffect(() => {
        if (!mazeMatrix || loadingMaze) {
            console.log("⏳ Waiting for maze to generate...");
            return;
        }
        if (!gameContainerRef.current) {
            console.error("Game container reference is null.");
            return;
        }

        console.log("Initializing Three.js scene...");

        // Get container size
        const width = gameContainerRef.current.clientWidth || window.innerWidth;
        const height = gameContainerRef.current.clientHeight || window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(2, 1.5, 2);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        if (!gameContainerRef.current.contains(renderer.domElement)) {
            gameContainerRef.current.appendChild(renderer.domElement);
        }

        // Create an EffectComposer to handle post-processing effects
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera)); // Normal scene render

        // Create a Bloom pass to simulate glowing effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.6, // Strength of glow
            0.1, // Radius of blur
            0.9 // Threshold for brightness
        );
        bloomPass.threshold = 0;  // Controls how much brightness triggers the bloom effect
        bloomPass.strength = lightsOn ? 1.5 : 0.1; // Adjust bloom intensity dynamically
        bloomPass.radius = 0.2; // Spread of the glow

        composer.addPass(bloomPass);


        // Lights
        // Remove or dim the ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
        scene.add(ambientLight);

        // Flashlight (Spotlight) follows the player
        const flashlight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 6, 0.3, 1);
        flashlight.position.set(camera.position.x, camera.position.y, camera.position.z);
        flashlight.target.position.set(camera.position.x + 1, camera.position.y, camera.position.z);
        scene.add(flashlight);
        scene.add(flashlight.target);


        // Load Textures
        const textureLoader = new THREE.TextureLoader();
        const wallTexture = textureLoader.load('/game/wall.png');
        const floorTexture = textureLoader.load('/game/floor.png');
        const roofTexture = textureLoader.load('/game/roof.jpg');
        const enemyTexture = textureLoader.load('/game/enemy.png');

        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        console.log(mazeMatrix);
        // Maze Data
        // Maze Data
        /*
        const mazeMatrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        */


        const tileSize = 2;
        const wallHeight = 3;
        const walls = new THREE.Group();
        const wallsRef = [];

        let exitPosition = { x: 0, z: 0 };

        // Apply textures to materials
        const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });


        // Build maze
        mazeMatrix.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    const wallGeometry = new THREE.BoxGeometry(tileSize, wallHeight, tileSize);
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x * tileSize, wallHeight / 2, z * tileSize);
                    walls.add(wall);
                    wallsRef.push(new THREE.Box3().setFromObject(wall));
                } else if (cell === 2) {
                    // 🚪 Load and place the door at the exit
                    const loader = new GLTFLoader();
                    loader.load('/game/door/scene.gltf', (gltf) => {
                        const door = gltf.scene;
                        door.scale.set(1, 1, 1); // Maintain correct proportions
                        door.position.set(x * tileSize, 0, (z + 0.3) * tileSize); // 🔄 Move door deeper into inset
                        door.rotation.y = Math.PI / 2;
                        scene.add(door);
                        console.log("🚪 Door placed at exit:", { x, z });
                    }, undefined, (error) => {
                        console.error("❌ Error loading door model:", error);
                    });

                    exitPosition = { x: x * tileSize, z: z * tileSize };

                    // 🏗️ Side walls (Make them thinner & correctly placed)
                    const sideWallWidth = tileSize * 0.18;  // 🔄 Adjusted width for no gaps
                    const sideWallHeight = wallHeight;
                    const sideWallDepth = tileSize * 0.8; // 🔄 Extend slightly to match door inset

                    const sideWallGeometry = new THREE.BoxGeometry(sideWallWidth, sideWallHeight, sideWallDepth);
                    const sideWallMaterial = new THREE.MeshStandardMaterial({
                        map: wallTexture,
                        side: THREE.DoubleSide
                    });

                    // ⬅️ Left wall (Perfectly aligned with main walls)
                    const leftWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
                    leftWall.position.set((x - 0.41) * tileSize, sideWallHeight / 2, (z + 0.15) * tileSize);
                    scene.add(leftWall);

                    // ➡️ Right wall (Perfectly aligned with main walls)
                    const rightWall = new THREE.Mesh(sideWallGeometry, sideWallMaterial);
                    rightWall.position.set((x + 0.41) * tileSize, sideWallHeight / 2, (z + 0.15) * tileSize);
                    scene.add(rightWall);

                    // 🔼 Top wall (Shorter, better texture scaling, NO stretching)
                    const topWallHeight = tileSize * 0.2;  // 🔄 Reduce height
                    const topWallGeometry = new THREE.BoxGeometry(tileSize - (sideWallWidth * 2), topWallHeight, tileSize * 0.8);
                    const topWall = new THREE.Mesh(topWallGeometry, sideWallMaterial);

                    // Set position **closer to the top of the door**
                    topWall.position.set(x * tileSize, wallHeight - (topWallHeight / 2), (z + 0.15) * tileSize);
                    scene.add(topWall);
                }



            });
        });

        scene.add(walls);

        //load items randomly
        const itemLoader = new GLTFLoader();
        itemLoader.load('/game/monster_energy_drink/scene.gltf', (gltf) => {
            const itemModel = gltf.scene;

            itemModel.scale.set(0.1, 0.1, 0.1);
            itemModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            let placed = false;
            let itemData = null;

            while (!placed) {
                let x = Math.floor(Math.random() * mazeMatrix[0].length);
                let z = Math.floor(Math.random() * mazeMatrix.length);

                if (mazeMatrix[z][x] === 0) { // Only place on open floor
                    itemModel.position.set(x * tileSize, 0, z * tileSize);
                    scene.add(itemModel);

                    itemData = { model: itemModel, position: { x, z }, type: "Monster Energy" };
                    placed = true;
                }
            }

            if (itemData) {
                console.log("✅ Item Spawned:", itemData);

                itemsRef.current = [...itemsRef.current, itemData]; // Store in ref
                setItems([...itemsRef.current]); // Ensure state update
            }
        });

        const lightRemoteLoader = new GLTFLoader();
        lightRemoteLoader.load('/game/light_remote/scene.gltf', (gltf) => {
            const remoteModel = gltf.scene;
            remoteModel.scale.set(2, 2, 2);

            let placed = false;
            let itemData = null;

            while (!placed) {
                let x = Math.floor(Math.random() * mazeMatrix[0].length);
                let z = Math.floor(Math.random() * mazeMatrix.length);

                if (mazeMatrix[z][x] === 0) { // Only place on open tiles
                    remoteModel.position.set(x * tileSize, 0.3, z * tileSize); // 🔼 Raised Y position
                    remoteModel.rotation.y = Math.random() * Math.PI * 2; // 🔄 Random rotation for realism
                    scene.add(remoteModel);

                    itemData = { model: remoteModel, position: { x, z }, type: "Light Remote" };
                    placed = true;
                }
            }

            if (itemData) {
                console.log("✅ Light Remote Spawned:", itemData);

                // 🔵 Ensure other items aren't overwritten
                itemsRef.current = [...itemsRef.current, itemData];
                setItems([...itemsRef.current]);
            }
        });



        /* ------------------------------------------- enemy AI setup ---------------------------------------------------------- */
        const pathfinder = new PF.AStarFinder({
            allowDiagonal: true,  // 🟢 Enables diagonal movement
            heuristic: PF.Heuristic.euclidean, // 🟢 Uses real distances instead of tiles
            dontCrossCorners: false
        });

        const baseGrid = new PF.Grid(mazeMatrix[0].length, mazeMatrix.length);

        mazeMatrix.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    baseGrid.setWalkableAt(x, z, false);
                }
            });
        });


        const enemy = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 2),
            new THREE.MeshStandardMaterial({
                map: enemyTexture,
                side: THREE.DoubleSide
            }));
        enemy.position.set(4, 1, 4); // Initial position
        scene.add(enemy);

        // Enemy movement variables
        let enemyPath = [];
        let enemyStepIndex = 0;
        let enemyVelocity = { x: 0, z: 0 };

        // Player movement prediction
        let direction = new THREE.Vector3();


        function updateEnemyPath() {
            const startX = Math.floor(enemy.position.x / tileSize);
            const startZ = Math.floor(enemy.position.z / tileSize);

            // 🔥 Predict where the player will go
            const velocityFactor = 5; // How far ahead to predict
            const predictedPlayerX = camera.position.x + (direction.x * velocityFactor);
            const predictedPlayerZ = camera.position.z + (direction.z * velocityFactor);

            const endX = Math.floor(predictedPlayerX / tileSize);
            const endZ = Math.floor(predictedPlayerZ / tileSize);

            if (startX === endX && startZ === endZ) return; // No need to update path

            const newGrid = baseGrid.clone();
            const newPath = pathfinder.findPath(startX, startZ, endX, endZ, newGrid);

            if (newPath.length > 1) {
                enemyPath = newPath;
                enemyStepIndex = 0;
            }
        }


        // Faster updates to prevent teleporting
        setInterval(updateEnemyPath, 100);

        const stopDistance = 1.0; // 🛑 Enemy stops moving if this close
        const enemyAcceleration = 0.9; // 🚀 Acceleration
        const enemyDeceleration = 0.3; // 🛑 Deceleration

        function shouldStopMoving() {
            const dx = camera.position.x - enemy.position.x;
            const dz = camera.position.z - enemy.position.z;
            return Math.sqrt(dx * dx + dz * dz) < stopDistance;
        }

        function moveEnemy() {
            if (enemyPath.length > 1 && enemyStepIndex < enemyPath.length - 1 && !shouldStopMoving()) {
                const [nextX, nextZ] = enemyPath[enemyStepIndex + 1];

                const targetX = nextX * tileSize;
                const targetZ = nextZ * tileSize;

                const dx = targetX - enemy.position.x;
                const dz = targetZ - enemy.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance > 0.1) {
                    enemyVelocity.x += (dx / distance) * enemyAcceleration;
                    enemyVelocity.z += (dz / distance) * enemyAcceleration;

                    // Apply deceleration if close to target
                    enemyVelocity.x *= Math.min(1.0, distance * enemyDeceleration);
                    enemyVelocity.z *= Math.min(1.0, distance * enemyDeceleration);

                    enemy.position.x += enemyVelocity.x;
                    enemy.position.z += enemyVelocity.z;
                } else {
                    enemyStepIndex++; // Move to next step in path
                }
            } else {
                // Slow down enemy smoothly if it reaches the player
                enemyVelocity.x *= 0.8;
                enemyVelocity.z *= 0.8;
            }
        }


        function rotateEnemyTowardsPlayer() {
            const dx = camera.position.x - enemy.position.x;
            const dz = camera.position.z - enemy.position.z;
            const angle = Math.atan2(dx, dz);

            enemy.rotation.y = THREE.MathUtils.lerp(enemy.rotation.y, angle, 0.1); // Smooth turning
        }









        /* ------------------------------------------- enemy AI setup ---------------------------------------------------------- */

        // Floor

        const floorGroup = new THREE.Group();

        mazeMatrix.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell !== 1) { // Place floor tiles where there are open paths
                    const floorGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

                    // Ensure texture properly tiles on each tile
                    const floorMaterial = new THREE.MeshStandardMaterial({
                        map: floorTexture,
                        side: THREE.DoubleSide
                    });

                    const floorTile = new THREE.Mesh(floorGeometry, floorMaterial);
                    floorTile.rotation.x = -Math.PI / 2;
                    floorTile.position.set(x * tileSize, 0, z * tileSize);

                    floorGroup.add(floorTile);
                }
            });
        });

        scene.add(floorGroup);


        // Ceiling - Same approach as the floor (One tile per grid cell)
        const ceilingGroup = new THREE.Group();
        const ceilingsRef = []; // Store ceiling hitboxes

        mazeMatrix.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell !== 1) { // Place ceiling tiles only where there are open paths
                    const ceilingGeometry = new THREE.PlaneGeometry(tileSize, tileSize);

                    // 🔥 Use emissive material for checkerboard effect
                    const isLightTile = (x + z) % 2 === 0;
                    const ceilingMaterial = new THREE.MeshStandardMaterial({
                        map: isLightTile ? null : roofTexture, // Normal texture on some tiles
                        emissive: isLightTile ? new THREE.Color(0.3, 0.3, 0.3) : new THREE.Color(0, 0, 0), // Glow on white tiles
                        emissiveIntensity: lightsOn ? 0.8 : 0, // Bright when lights are on, dim when off
                        color: isLightTile ? new THREE.Color(1, 1, 1) : new THREE.Color(1, 1, 1) // White or normal
                    });

                    const ceilingTile = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
                    ceilingTile.rotation.x = Math.PI / 2;
                    ceilingTile.position.set(x * tileSize, wallHeight, z * tileSize);

                    ceilingGroup.add(ceilingTile);
                    ceilingsRef.push(ceilingTile); // Store reference for toggling brightness
                }
            });
        });

        scene.add(ceilingGroup);


        function toggleLights(state) {
            setLightsOn(state);

            // 🔆 Adjust scene brightness
            ambientLight.intensity = state ? 0.6 : 0.1;

            // 🔥 Increase emissive intensity on ceiling panels
            ceilingsRef.forEach(tile => {
                if (tile.material.emissive) {
                    tile.material.emissiveIntensity = state ? 0.8 : 0.1;
                }
            });

            // ✨ Adjust bloom glow dynamically
            bloomPass.strength = state ? 0.6 : 0.3;
            flashlight.intensity = state ? 0 : 3;  // 🔴 0 = OFF, 3 = Default brightness

            // 🌟 Also disable flashlight target if needed
            flashlight.target.position.set(
                state ? 0 : camera.position.x + 1,
                state ? 0 : camera.position.y,
                state ? 0 : camera.position.z
            );
        }





        // Player Controls
        const controls = new PointerLockControls(camera, document.body);
        gameContainerRef.current.addEventListener('click', () => {
            if (!gameWon) controls.lock();
        });

        // Movement State
        const keys = { w: false, a: false, s: false, d: false, j: false, e: false, u: false, shift: false }; // ⬅ Change "ctrl" to "shift"

        document.addEventListener('keydown', (event) => {
            // ✅ Log all key presses
            if (keys.hasOwnProperty(event.key.toLowerCase())) {
                keys[event.key.toLowerCase()] = true;
            }
            if (event.key === 'ArrowRight' && inventoryRef.current.length > 0) {
                setSelectedItemIndex((prevIndex) => (prevIndex + 1) % inventoryRef.current.length);
                console.log("➡ Selected Item Index:", selectedItemIndex);
            } else if (event.key === 'ArrowLeft' && inventoryRef.current.length > 0) {
                setSelectedItemIndex((prevIndex) => (prevIndex - 1 + inventoryRef.current.length) % inventoryRef.current.length);
                console.log("⬅ Selected Item Index:", selectedItemIndex);
            }
            if (event.key === "v") {  // Press 'V' to test
                console.log("🎵 Playing victory sound...");
                victorySound.current.pause();
                victorySound.current.currentTime = 0;
                victorySound.current.play();
            }
            if (event.key.toLowerCase() === 'u' && inventoryRef.current.length > 0) {
                console.log("🔹 U Key Pressed - Inventory Before Use:", inventoryRef.current);

                const selectedIndex = selectedItemIndex;
                const selectedItem = inventoryRef.current[selectedIndex];

                console.log("📌 Selected Item Index:", selectedIndex);
                console.log("📌 Selected Item:", selectedItem);

                if (selectedItem === "Monster Energy") {
                    console.log("✅ Using Monster Energy!");

                    activeEffectRef.current = true;

                    console.log("⚡ Stamina Boost Activated!");

                    setTimeout(() => {
                        activeEffectRef.current = false;
                        console.log("🕒 Stamina Boost Expired!");
                    }, 30000);


                    // Remove from inventory
                    setInventory((prevInventory) => {
                        const updatedInventory = prevInventory.filter((_, idx) => idx !== selectedIndex);
                        console.log("📌 Updated Inventory After Use:", updatedInventory);

                        // Adjust selected index
                        setSelectedItemIndex(Math.max(0, Math.min(selectedIndex, updatedInventory.length - 1)));

                        return updatedInventory;
                    });
                }
                if (selectedItem === "Light Remote") {
                    console.log("💡 Activating Lights!");

                    toggleLights(true); // Turn on all ceiling lights

                    // Remove from inventory
                    setInventory((prevInventory) => {
                        const updatedInventory = prevInventory.filter((_, idx) => idx !== selectedIndex);
                        console.log("📌 Updated Inventory After Use:", updatedInventory);

                        // Adjust selected index
                        setSelectedItemIndex(Math.max(0, Math.min(selectedIndex, updatedInventory.length - 1)));

                        return updatedInventory;
                    });
                }
            }





            if (event.key.toLowerCase() === 'e') {
                console.log("🔹 E Key Pressed");
                console.log("📌 Items in State Before Pickup:", itemsRef.current);

                if (itemsRef.current.length > 0) {
                    for (let i = 0; i < itemsRef.current.length; i++) { // 🔵 Check all items
                        const item = itemsRef.current[i];

                        const distance = Math.sqrt(
                            (camera.position.x - item.position.x * tileSize) ** 2 +
                            (camera.position.z - item.position.z * tileSize) ** 2
                        );

                        console.log(`🔹 Checking item ${item.type}, Distance: ${distance}`);

                        if (distance < 2) { // ✅ If close enough
                            console.log(`✅ Picked up: ${item.type}`);

                            pickupSound.current.currentTime = 0; // Reset to start
                            pickupSound.current.play();
                            // ✅ Add to inventory
                            setInventory((prevInventory) => {
                                const updatedInventory = [...prevInventory, item.type];
                                console.log("✅ Updated Inventory:", updatedInventory);
                                return updatedInventory;
                            });

                            scene.remove(item.model); // Remove from scene
                            itemsRef.current = itemsRef.current.filter((_, idx) => idx !== i); // ✅ Remove only the picked item
                            setItems([...itemsRef.current]); // ✅ Update state

                            setShowCollectedMessage(true);
                            setTimeout(() => setShowCollectedMessage(false), 2000);
                            break; // Stop checking once an item is picked up
                        }
                    }
                } else {
                    console.log("❌ No items detected in the world.");
                }
            }



        });

        document.addEventListener('keyup', (event) => {
            if (keys.hasOwnProperty(event.key.toLowerCase())) {
                keys[event.key.toLowerCase()] = false;
            }
        });


        // Collision Detection
        // Improved Collision Detection
        function checkCollision(newX, newZ) {
            const buffer = 0.3; // Allow slight movement before stopping
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(newX, 1.5, newZ), // Center at player's height
                new THREE.Vector3(tileSize - buffer, wallHeight, tileSize - buffer) // Make hitbox slightly smaller
            );

            return wallsRef.some(wallBox => playerBox.intersectsBox(wallBox));
        }

        function checkCeilingCollision(y) {
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(camera.position.x, y, camera.position.z),
                new THREE.Vector3(1, 1, 1) // Small hitbox for the player's head
            );

            return ceilingsRef.some(tile => {
                const tileBox = new THREE.Box3().setFromObject(tile);
                return playerBox.intersectsBox(tileBox);
            });
        }






        function checkWin(newX, newZ) {
            const distance = Math.sqrt(
                (newX - exitPosition.x) ** 2 + (newZ - exitPosition.z) ** 2
            );

            if (distance < tileSize / 2 && !gameWonRef.current) { // ✅ Trigger ONLY ONCE
                console.log("🎉 You Win!");
                gameWonRef.current = true; // ✅ Instantly prevent further triggers
                setGameWon(true);
                controls.unlock();

                // ✅ Stop background sounds *only if they're playing*
                if (backgroundMusic.current && !backgroundMusic.current.paused) {
                    backgroundMusic.current.pause();
                }
                if (ambientNoise.current && !ambientNoise.current.paused) {
                    ambientNoise.current.pause();
                }

                // ✅ Ensure victory sound plays only once
                if (victorySound.current) {
                    console.log("🎵 Playing victory sound...");
                    victorySound.current.pause(); // 🛑 Stop if already playing
                    victorySound.current.currentTime = 0; // ⏪ Reset to beginning
                    victorySound.current.play()
                        .then(() => console.log("🎵 Victory sound is playing!"))
                        .catch(err => console.error("❌ Error playing victory sound:", err));
                }
            }
        }




        // Game Loop
        // Improved Movement System
        const walkSpeed = 0.1;
        const sprintSpeed = 0.2;
        const jumpStrength = 0.15; // ⬅ More balanced jump height


        const gravity = -0.01; // ⬅ Increase gravity to make falling faster
        let prevX = camera.position.x;
        let prevZ = camera.position.z;





        function animate() {
            requestAnimationFrame(animate);

            if (!gameWon) {
                let direction = new THREE.Vector3();
                camera.getWorldDirection(direction);

                let moveX = 0, moveZ = 0;
                let speed = walkSpeed;
                let isMoving = false;
                let isSprintingNow = false;

                if (activeEffectRef.current || (keys.shift && staminaRef.current > 10)) {

                    speed = sprintSpeed;
                    setIsSprinting(true);
                    isSprintingNow = true;
                    if (activeEffectRef.current && staminaRef.current < 100) {
                        staminaRef.current = 100;  // ✅ Prevent unnecessary updates
                    }
                    else {
                        staminaRef.current = Math.max(staminaRef.current - 0.5, 0);
                    }
                } else {
                    setIsSprinting(false);
                }

                // ✅ Only regenerate stamina if NOT sprinting
                if (!keys.shift && !activeEffectRef.current) {
                    staminaRef.current = Math.min(staminaRef.current + 0.3, 100);
                }


                // Sync the staminaRef with React state to update UI
                setStamina(staminaRef.current);
                //console.log("🔥 Stamina:", staminaRef.current, "Effect Active:", activeEffectRef.current);

                if (keys.w || keys.s || keys.a || keys.d) {
                    isMoving = true;
                }
                // Movement logic
                if (keys.w) { moveX += direction.x * speed; moveZ += direction.z * speed; }
                if (keys.s) { moveX -= direction.x * speed; moveZ -= direction.z * speed; }
                if (keys.d) { moveX -= direction.z * speed; moveZ += direction.x * speed; }
                if (keys.a) { moveX += direction.z * speed; moveZ -= direction.x * speed; }

                let newX = camera.position.x + moveX;
                let newZ = camera.position.z + moveZ;

                // Collision detection with rollback to prevent sticking
                if (!checkCollision(newX, camera.position.z)) {
                    camera.position.x = newX;
                } else {
                    camera.position.x = prevX;
                }

                if (!checkCollision(camera.position.x, newZ)) {
                    camera.position.z = newZ;
                } else {
                    camera.position.z = prevZ;
                }

                if (keys.j && camera.position.y <= 1.6 && Math.abs(velocityY) < 0.01) {
                    velocityY = jumpStrength;
                    console.log("Jump triggered!"); // Debug log to verify jump works
                }



                velocityY += gravity;

                // Prevent jumping through ceiling
                if (checkCeilingCollision(camera.position.y + velocityY)) {
                    velocityY = 0; // Stop movement
                } else {
                    camera.position.y = Math.max(1.5, camera.position.y + velocityY);
                }

                //picking up an item
                /* ✅ New Pickup Prompt Logic */
                let closestItem = null;
                let closestDistance = Infinity;

                itemsRef.current.forEach((item) => {
                    const distance = Math.sqrt(
                        (camera.position.x - item.position.x * tileSize) ** 2 +
                        (camera.position.z - item.position.z * tileSize) ** 2
                    );

                    if (distance < 2 && distance < closestDistance) { // ✅ Find the closest item within 2 units
                        closestItem = item;
                        closestDistance = distance;
                    }
                });
                setShowPickupPrompt(!!closestItem);

                if (isMoving) {
                    if (isSprintingNow) {
                        if (runningSound.current.paused) {
                            walkingSound.current.pause(); // Stop walking sound
                            runningSound.current.currentTime = 0;
                            runningSound.current.play().catch(err => console.log("🔇 Running sound blocked:", err));
                        }
                    } else {
                        if (walkingSound.current.paused) {
                            runningSound.current.pause(); // Stop running sound
                            walkingSound.current.currentTime = 0;
                            walkingSound.current.play().catch(err => console.log("🔇 Walking sound blocked:", err));
                        }
                    }
                } else {
                    walkingSound.current.pause();
                    runningSound.current.pause();
                }

                // Update player position in the matrix
                const playerGridX = Math.floor(camera.position.x / tileSize);
                const playerGridZ = Math.floor(camera.position.z / tileSize);

                // Only update state if position changes (to avoid unnecessary re-renders)
                setPlayerPosition((prev) =>
                    prev.x !== playerGridX || prev.y !== playerGridZ
                        ? { x: playerGridX, y: playerGridZ }
                        : prev
                );


                /* 🟥 AI MOVEMENT - NOW MOVES SMOOTHLY AND TURNS CORNERS 🟥 */
                camera.getWorldDirection(direction); // 🔄 Continuously update player's direction
                moveEnemy(); // 🚶 Move enemy smoothly
                rotateEnemyTowardsPlayer(); // 🔄 Enemy turns to face player
                // Prevent falling through the floor
                if (camera.position.y <= 1.5) {
                    velocityY = 0;
                    camera.position.y = 1.5;
                }

                // Save previous position
                prevX = camera.position.x;
                prevZ = camera.position.z;
                flashlight.position.set(camera.position.x, camera.position.y, camera.position.z);
                flashlight.target.position.set(
                    camera.position.x + direction.x * 5,
                    camera.position.y + direction.y * 5,
                    camera.position.z + direction.z * 5
                );

                checkWin(camera.position.x, camera.position.z);
            }





            composer.render(); // Render with bloom effect

        }


        animate();

        return () => {
            gameContainerRef.current.removeChild(renderer.domElement);
        };
    }, [mazeMatrix, gameWon]);


    return (
        <div className="relative w-screen h-screen bg-black">
            {/* Game Container */}

            <div className="relative w-full h-full">
    {/* Conditionally Render Game Container */}
    {!loadingMaze && <div ref={gameContainerRef} className="w-full h-full" />}

    {/* Loading Overlay */}
    <AnimatePresence mode="wait">
        {loadingMaze && (
            <motion.div
                key="loading"
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.p
                    className="text-white text-xl font-bold"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                    🔄 Generating Maze...
                </motion.p>
            </motion.div>
        )}
    </AnimatePresence>
</div>

            {/* Game Over / Victory Screen */}
            {gameWon && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="window p-6 w-80 text-center">
                        <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                            <div className="title-bar-text">Game Over</div>
                        </div>
                        <div className="window-body">
                            <p className="text-xl font-bold text-center my-4">🎉 You Win! 🎉</p>
                            <button
                                className="button w-full py-2 bg-blue-500 text-white font-bold hover:bg-blue-700 transition"
                                onClick={() => window.location.reload()}
                            >
                                🔄 Restart Game
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stamina Bar UI */}
            <div className="fixed bottom-12 left-8 flex flex-col items-center bg-gray-900 p-3 border-4 border-white rounded-lg shadow-lg">
                <p className="text-xs text-white font-pixel tracking-widest">STAMINA</p>
                <div className="w-40 h-6 border-2 border-white bg-black relative mt-1">
                    <div
                        className={`h-full transition-all`}
                        style={{
                            width: `${staminaRef.current}%`,
                            backgroundColor: activeEffectRef.current ? 'blue' :
                                stamina > 60 ? 'limegreen' :
                                    stamina > 30 ? 'yellow' : 'red'
                        }}
                    />
                </div>
                {activeEffectRef.current && <p className="text-xs text-blue-400 font-pixel">⚡ Unlimited Stamina</p>}
            </div>
            {/* <Minimap mazeMatrix={mazeMatrix} playerPosition={playerPosition} />*/}

            {/* Inventory UI Container */}
            <div className="fixed bottom-12 right-8 flex flex-col items-center bg-gray-900 p-3 border-4 border-white rounded-lg shadow-lg min-w-[180px]">

                {/* Inventory Title */}
                <span className="text-white font-bold text-sm mb-2">INVENTORY</span>

                {/* Empty Inventory Message */}
                {inventory.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-400 text-xs italic"
                    >
                        Empty...
                    </motion.div>
                ) : (
                    <div className="flex flex-row items-center">
                        <AnimatePresence>
                            {inventory.map((item, index) => (
                                <motion.div
                                    key={item + index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center mx-2"
                                >
                                    {/* Item Name */}
                                    <span className={`text-xs text-white mb-1 ${index === selectedItemIndex ? 'text-yellow-300 font-bold' : ''}`}>
                                        {item}
                                    </span>

                                    {/* Item Icon (Image) */}
                                    <div
                                        className={`w-12 h-12 flex items-center justify-center border-2 border-white rounded-lg
                                ${index === selectedItemIndex ? 'border-yellow-500 scale-110' : 'hover:scale-105'}
                                transition-all duration-150 bg-gray-800`}
                                    >
                                        <img
                                            src={item === "Monster Energy" ? "/game/icons/monster.gif" :
                                                item === "Light Remote" ? "/game/icons/light_remote.png" :
                                                    "/game/icons/unknown.png"}
                                            alt={item}
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>




            {/*Item pickup prompt */}
            <AnimatePresence>
                {showPickupPrompt && (
                    <motion.div
                        className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 border-4 border-yellow-500 font-pixel shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        Press <span className="text-yellow-300">E</span> to pick up the item
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Item Collected Animation */}
            <AnimatePresence>
                {showCollectedMessage && (
                    <motion.div
                        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white font-bold px-4 py-2 border-4 border-white font-pixel shadow-md"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        ✅ Item Collected!
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Credits Button */}
            <button
                className="fixed top-28 right-4 button bg-gray-700 text-white px-3 py-2 text-sm"
                onClick={() => setShowCredits(true)}
            >
                📜 Credits
            </button>

            {/* Controls Button */}
            <button
                className="fixed top-28 right-24 button bg-gray-700 text-white px-3 py-2 text-sm"
                onClick={() => setShowControls(true)}
            >
                🎮 Controls
            </button>

            {/* Credits Modal */}
            <AnimatePresence>
                {showCredits && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="window w-80 p-4">
                            <div className="title-bar" style={{ background: 'linear-gradient(90deg, #ff69b4, #ff1493)' }}>
                                <div className="title-bar-text">📜 Credits</div>
                                <div className="title-bar-controls">
                                    <button aria-label="Close" onClick={() => setShowCredits(false)}></button>
                                </div>
                            </div>
                            <div className="window-body text-sm">
                                <p>🎨 Sprites: OpenGameArt</p>
                                <p>🎵 Music: FreeSound</p>
                                <p>🔊 Sound Effects: Zapsplat</p>
                                <p>🕹️ Game Engine: Three.js</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Overlay */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Title */}
                        <motion.h1
                            className="text-3xl font-bold font-pixel mb-6 text-center border-b-4 border-gray-700 pb-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            🎮 Game Controls
                        </motion.h1>

                        {/* Controls List */}
                        <div className="grid grid-cols-[40px_auto] gap-x-3 gap-y-2 text-lg font-pixel">
                            {[
                                ["⬆️", "W - Move Up"],
                                ["⬇️", "S - Move Down"],
                                ["⬅️", "A - Move Left"],
                                ["➡️", "D - Move Right"],
                                ["⚡", "Shift - Sprint (Uses Stamina)"],
                                ["🦘", "J - Jump"],
                                ["🤚", "E - Pick up an item"],
                                ["🤚", "U - Use an item"],
                            ].map(([icon, text], index) => (
                                <React.Fragment key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="text-xl"
                                    >
                                        {icon}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-gray-800 p-2 border border-white shadow-md"
                                    >
                                        {text}
                                    </motion.div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Close Button */}
                        <motion.button
                            className="button bg-gray-700 text-white font-bold text-lg px-6 py-3 mt-6 transition-all hover:bg-gray-500 border-2 border-white shadow-lg"
                            onClick={() => setShowControls(false)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            ✖ Close
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>




        </div>
    );


}
