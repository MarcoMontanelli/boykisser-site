import React from "react";

const Minimap = ({ mazeMatrix, playerPosition }) => {
    const MAP_SIZE = 16;
    const mazeWidth = mazeMatrix[0].length;
    const mazeHeight = mazeMatrix.length;

    // Calculate minimap view boundaries based on player position
    const startX = Math.max(0, Math.min(playerPosition.x - Math.floor(MAP_SIZE / 2), mazeWidth - MAP_SIZE));
    const startY = Math.max(0, Math.min(playerPosition.y - Math.floor(MAP_SIZE / 2), mazeHeight - MAP_SIZE));

    return (
        <div className="fixed bottom-48 right-8 p-2 bg-gray-900 border-2 border-white shadow-lg">
            <div className="title-bar flex justify-between items-center px-2 py-1">
                <span className="title-bar-text text-white font-[var(--font-pixel)]">📍 Minimap</span>
            </div>

            {/* Minimap Grid (16x16) */}
            <div className="relative w-40 h-40 bg-black border-2 border-white overflow-hidden">
                <div className="grid grid-cols-16 grid-rows-16 gap-0.5 p-1">
                    {Array.from({ length: MAP_SIZE }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {Array.from({ length: MAP_SIZE }).map((_, colIndex) => {
                                const x = startX + colIndex;
                                const y = startY + rowIndex;
                                const cell = mazeMatrix[y] && mazeMatrix[y][x]; // Handle out-of-bounds
                                const isPlayer = playerPosition.x === x && playerPosition.y === y;

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-2.5 h-2.5 border border-gray-700 ${
                                            isPlayer
                                                ? "bg-blue-500"
                                                : cell === 1
                                                ? "bg-gray-500"
                                                : cell === 0
                                                ? "bg-green-700"
                                                : "bg-transparent"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Minimap;
