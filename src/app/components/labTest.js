"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import PF from "pathfinding"; // ✅ Import pathfinding for AI movement
const generateMazeMatrix = (size) => {
    const matrix = Array(size).fill(null).map(() => Array(size).fill(1));

    const directions = [
        [0, 2], [0, -2], [2, 0], [-2, 0]
    ];

    const inBounds = (x, y) => x > 0 && y > 0 && x < size - 1 && y < size - 1;

    let startX = 1, startY = 1;
    matrix[startY][startX] = 0;
    let walls = [[startX, startY]];

    while (walls.length > 0) {
        let [x, y] = walls.pop();
        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            let mx = x + dx / 2, my = y + dy / 2;

            if (inBounds(nx, ny) && matrix[ny][nx] === 1) {
                matrix[ny][nx] = 0;
                matrix[my][mx] = 0;
                walls.push([nx, ny]);
            }
        }
    }

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

    let exitPlaced = false;
    for (let x = 1; x < size - 1; x++) {
        if (matrix[size - 2][x] === 0) {
            matrix[size - 1][x] = 2;
            exitPlaced = true;
            break;
        }
    }

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

export default function FPVGame() {
    const gameContainerRef = useRef(null);
    const [mazeMatrix, setMazeMatrix] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            try {
                const newMaze = generateMazeMatrix(16);
                setMazeMatrix(newMaze);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    }, []);

    useEffect(() => {
        if (!mazeMatrix || !gameContainerRef.current) return;

        console.log("✅ Initializing Three.js Scene...");

        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(2, 1.5, 2);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        gameContainerRef.current.appendChild(renderer.domElement);

        const controls = new PointerLockControls(camera, document.body);
        gameContainerRef.current.addEventListener("click", () => controls.lock());

        const walls = new THREE.Group();
        const tileSize = 2;
        const wallHeight = 3;
        const wallsRef = [];

        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Light gray walls
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd }); // Light gray floor
        

        mazeMatrix.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    const wallGeometry = new THREE.BoxGeometry(tileSize, wallHeight, tileSize);
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x * tileSize, wallHeight / 2, z * tileSize);
                    walls.add(wall);

                       // 📌 Store bounding box for collision detection
                       const wallBox = new THREE.Box3().setFromObject(wall);
                       wallsRef.push(wallBox);
                }
            });
        });

        scene.add(walls);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(mazeMatrix.length * tileSize, mazeMatrix.length * tileSize),
            floorMaterial
        );
        floor.rotation.x = -Math.PI / 2;
        scene.add(floor);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const keys = { w: false, a: false, s: false, d: false, j: false };
        let velocityY = 0;
        const gravity = -0.01;
        const speed = 0.1;
        const jumpPower = 0.15;

        document.addEventListener("keydown", (event) => {
            if (keys.hasOwnProperty(event.key.toLowerCase())) keys[event.key.toLowerCase()] = true;
        });

        document.addEventListener("keyup", (event) => {
            if (keys.hasOwnProperty(event.key.toLowerCase())) keys[event.key.toLowerCase()] = false;
        });

        function checkCollision(newX, newZ) {
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(newX, 1.5, newZ),
                new THREE.Vector3(1, 3, 1) // Player hitbox size
            );

            return wallsRef.some(wallBox => playerBox.intersectsBox(wallBox));
        }

        // 👾 Enemy Setup
        function findOpenPosition() {
            while (true) {
                let x = Math.floor(Math.random() * mazeMatrix.length);
                let z = Math.floor(Math.random() * mazeMatrix.length);
                if (mazeMatrix[z][x] === 0) return { x: x * tileSize, z: z * tileSize };
            }
        }

        const playerSpawn = { x: 2 * tileSize, z: 2 * tileSize };
        let enemySpawn = findOpenPosition();

        // Make sure enemy spawns far from the player
        while (
            Math.abs(enemySpawn.x - playerSpawn.x) < 8 * tileSize &&
            Math.abs(enemySpawn.z - playerSpawn.z) < 8 * tileSize
        ) {
            enemySpawn = findOpenPosition();
        }

        const enemy = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.5),
            new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        );
        enemy.position.set(enemySpawn.x, 1.5, enemySpawn.z);
        scene.add(enemy);

        let enemyVelocity = { x: 0, z: 0 };
        let enemyPath = [];
        let enemyStepIndex = 0;
        let playerDetected = false;

        const gridSize = mazeMatrix.length;
        const pathfinder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });

        function hasLineOfSight() {
            const direction = new THREE.Vector3(
                camera.position.x - enemy.position.x,
                0,
                camera.position.z - enemy.position.z
            ).normalize();

            const raycaster = new THREE.Raycaster(enemy.position, direction);
            const intersects = raycaster.intersectObjects(walls.children);

            return intersects.length === 0;
        }

        function updateEnemyPath() {
            const startX = Math.floor(enemy.position.x / tileSize);
            const startZ = Math.floor(enemy.position.z / tileSize);
            const playerX = Math.floor(camera.position.x / tileSize);
            const playerZ = Math.floor(camera.position.z / tileSize);

            if (startX === playerX && startZ === playerZ) return;

            const grid = new PF.Grid(gridSize, gridSize);
            mazeMatrix.forEach((row, z) => {
                row.forEach((cell, x) => {
                    if (cell === 1) {
                        grid.setWalkableAt(x, z, false);
                    }
                });
            });

            const newPath = pathfinder.findPath(startX, startZ, playerX, playerZ, grid);
            if (newPath.length > 1) {
                enemyPath = newPath;
                enemyStepIndex = 0;
            }
        }

        function moveEnemy() {
            if (enemyPath.length > 1 && enemyStepIndex < enemyPath.length - 1) {
                const [nextX, nextZ] = enemyPath[enemyStepIndex + 1];

                const targetX = nextX * tileSize;
                const targetZ = nextZ * tileSize;

                const dx = targetX - enemy.position.x;
                const dz = targetZ - enemy.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);

                if (distance > 0.1) {
                    enemyVelocity.x = (dx / distance) * 0.08;
                    enemyVelocity.z = (dz / distance) * 0.08;

                    enemy.position.x += enemyVelocity.x;
                    enemy.position.z += enemyVelocity.z;
                } else {
                    enemyStepIndex++;
                }
            }
        }

        function patrolEnemy() {
            if (!playerDetected) {
                if (enemyPath.length === 0 || enemyStepIndex >= enemyPath.length - 1) {
                    enemyPath = findRandomPatrolPath();
                    enemyStepIndex = 0;
                }
                moveEnemy();
            }
        }

        function findRandomPatrolPath() {
            let randomTarget = findOpenPosition();
            let grid = new PF.Grid(gridSize, gridSize);
            mazeMatrix.forEach((row, z) => {
                row.forEach((cell, x) => {
                    if (cell === 1) {
                        grid.setWalkableAt(x, z, false);
                    }
                });
            });
            return pathfinder.findPath(
                Math.floor(enemy.position.x / tileSize),
                Math.floor(enemy.position.z / tileSize),
                Math.floor(randomTarget.x / tileSize),
                Math.floor(randomTarget.z / tileSize),
                grid
            );
        }

        setInterval(() => {
            if (hasLineOfSight()) playerDetected = true;
            if (playerDetected) updateEnemyPath();
            else patrolEnemy();
        }, 500);

        function animate() {
            requestAnimationFrame(animate);

            let direction = new THREE.Vector3();
            camera.getWorldDirection(direction);

            let moveX = 0, moveZ = 0;
            if (keys.w) { moveX += direction.x * speed; moveZ += direction.z * speed; }
            if (keys.s) { moveX -= direction.x * speed; moveZ -= direction.z * speed; }
            if (keys.d) { moveX -= direction.z * speed; moveZ += direction.x * speed; }
            if (keys.a) { moveX += direction.z * speed; moveZ -= direction.x * speed; }

            let newX = camera.position.x + moveX;
            let newZ = camera.position.z + moveZ;

            // 🚧 Collision Detection: Block movement if colliding with walls
            if (!checkCollision(newX, camera.position.z)) {
                camera.position.x = newX;
            }
            if (!checkCollision(camera.position.x, newZ)) {
                camera.position.z = newZ;
            }

            // 🏃 Jumping & Gravity
            if (keys.j && camera.position.y <= 1.6) {
                velocityY = jumpPower;
            }

            velocityY += gravity;
            camera.position.y = Math.max(1.5, camera.position.y + velocityY);

            
    // 🔄 Enemy Behavior
    if (playerDetected) {
        moveEnemy(); // 🔥 Chase the player
    } else {
        patrolEnemy(); // 🔍 Patrol if player not seen
    }

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            if (renderer.domElement && gameContainerRef.current) {
                gameContainerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [mazeMatrix]);

    return (
        <div ref={gameContainerRef} style={{ width: "100vw", height: "100vh" }}>
            {loading && <p style={{ color: "white", textAlign: "center" }}>🕐 Generating Maze...</p>}
        </div>
    );
}
