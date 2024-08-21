
"use client";

import React, { useEffect, useState, useRef } from "react";
import "tailwindcss/tailwind.css";

// Types pour l'état de la course
type Runner = {
    id: number;
    position: number;
    hasWon: boolean;
    isJumping: boolean;
    speed: number;
    score: number;
    yOffset: number; // Ajout d'un offset vertical pour le saut
};

const RacePage: React.FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [runners, setRunners] = useState<Runner[]>([
        { id: 1, position: 0, hasWon: false, isJumping: false, speed: Math.random() * 4 + 1, score: 0, yOffset: 0 },
        { id: 2, position: 0, hasWon: false, isJumping: false, speed: Math.random() * 4 + 1, score: 0, yOffset: 0 },
        { id: 3, position: 0, hasWon: false, isJumping: false, speed: Math.random() * 4 + 1, score: 0, yOffset: 0 },
        { id: 4, position: 0, hasWon: false, isJumping: false, speed: Math.random() * 4 + 1, score: 0, yOffset: 0 },
    ]);
    const [selectedRunner, setSelectedRunner] = useState<number | null>(null);
    const [isRaceStarted, setIsRaceStarted] = useState(false);
    const [difficulty, setDifficulty] = useState<number>(1); // 1 pour facile, 2 pour moyen, 3 pour difficile

    const screenWidth = window.innerWidth;
    const trackLength = 1000; // Piste de course de trois écrans
    const [obstacles, setObstacles] = useState<number[]>([]);

    useEffect(() => {
        // Générer des positions d'obstacles aléatoires pour chaque course
        const generateObstacles = Array.from({ length: 5 + difficulty * 2 }, () =>
            Math.floor(Math.random() * trackLength)
        );
        setObstacles(generateObstacles);
    }, [difficulty]);

    const handleBet = (runnerId: number) => {
        setSelectedRunner(runnerId);
        setIsRaceStarted(true);
    };

    useEffect(() => {
        if (isRaceStarted) {
            const interval = setInterval(() => {
                setRunners((prevRunners) =>
                    prevRunners.map((runner) => {
                        if (runner.hasWon) return runner;

                        let newPosition = runner.position + runner.speed;
                        let isJumping = runner.isJumping;
                        let yOffset = runner.yOffset;

                        // Vérifie si la nouvelle position est sur un obstacle
                        if (obstacles.includes(Math.floor(newPosition))) {
                            isJumping = true;
                            yOffset = -20; // Position verticale pour simuler le saut

                            // Remet isJumping et yOffset à l'état initial après 200ms
                            setTimeout(() => {
                                setRunners((prevRunners) =>
                                    prevRunners.map((r) =>
                                        r.id === runner.id
                                            ? { ...r, isJumping: false, yOffset: 0 }
                                            : r
                                    )
                                );
                            }, 200);
                        }

                        // Si le coureur atteint la ligne d'arrivée
                        if (newPosition >= trackLength) {
                            return {
                                ...runner,
                                position: trackLength,
                                hasWon: true,
                                score: runner.score + 10,
                            };
                        }

                        // Retourne le coureur avec la nouvelle position et état isJumping
                        return { ...runner, position: newPosition, isJumping: isJumping, yOffset: yOffset };
                    })
                );

                // Trouve le coureur en tête de la course
                const leadingRunner = runners.reduce(
                    (max, runner) => (runner.position > max.position ? runner : max),
                    runners[0]
                );

                // Centre le coureur en tête de la course dans l'affichage
                if (trackRef.current) {
                    // trackRef.current.scrollLeft = leadingRunner.position - screenWidth / 2;
					trackRef.current.scrollLeft = leadingRunner.position - 220 / 2;
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [isRaceStarted, runners, obstacles, screenWidth]);

    useEffect(() => {
        const winner = runners.find((runner) => runner.hasWon);
        if (winner) {
            if (winner.id === selectedRunner) {
                alert(`Félicitations! Le coureur ${winner.id} a gagné! 🎉`);
            } else {
                alert(`Dommage! Le coureur ${winner.id} a gagné.`);
            }
            setIsRaceStarted(false);
        }
    }, [runners, selectedRunner]);

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-blue-800">
                Course de coureurs 🏁
            </h1>
            <div className="flex gap-4 mb-6">
                {runners.map((runner) => (
                    <button
                        key={runner.id}
                        className={`px-4 py-2 rounded transition transform ${
                            selectedRunner === runner.id ? "bg-green-500" : "bg-blue-500 hover:bg-blue-700"
                        }`}
                        onClick={() => handleBet(runner.id)}
                    >
                        🏃 Pari sur Coureur {runner.id}
                    </button>
                ))}
            </div>
            <div className="mb-4">
                <label className="mr-2 font-bold">Difficulté:</label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="px-2 py-1 rounded border"
                >
                    <option value={1}>Facile</option>
                    <option value={2}>Moyen</option>
                    <option value={3}>Difficile</option>
                </select>
            </div>
            <div
                ref={trackRef}
                className="overflow-x-scroll max-w-96 border-2 border-gray-500 relative"
                style={{ height: "200px" }}
            >
                {/* Ligne de départ */}
                <div
                    className="absolute left-0 top-0 h-full bg-blue-300"
                    style={{ width: "10px" }}
                ></div>
                <pre
                    className="whitespace-nowrap text-left pl-10 bg-white"
                    style={{ width: `${trackLength}px` }}
                >
                    {" ".repeat(trackLength / 2 - 50)}| Start |
                </pre>
                {runners.map((runner) => (
                    <pre
                        key={runner.id}
                        className={`whitespace-nowrap absolute text-lg font-bold ${
                            runner.isJumping ? "text-green-600" : "text-red-600"
                        }`}
                        style={{
                            top: `${runner.id * 30 + 30 + runner.yOffset}px`, // Utilisation de yOffset pour simuler le saut
                            left: `${runner.position}px`,
                            transition: "left 0.05s, top 0.2s ease-in-out",
                        }}
                    >
                        {runner.isJumping ? `🏃‍♂️` : `🏃‍♀️`}
                    </pre>
                ))}
                {obstacles.map((pos, index) => (
                    <>
                        <div
                            key={index}
                            className="absolute"
                            style={{
                                top: "20px",
                                left: `${pos}px`,
                                width: "20px",
                                height: "20px",
                            }}
                        >
                            🚧
                        </div>
                        <div
                            className="absolute top-14 h-full bg-amber-300"
                            style={{ width: "10px", left: `${pos}px`, height: "120px" }}
                        ></div>
                    </>
                ))}
                {/* Ligne d'arrivée */}
                <div
                    className="absolute top-0 h-full bg-red-300"
                    style={{ width: "10px", left: `${trackLength - 10}px` }}
                ></div>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">Scores 🏅:</h2>
                <ul>
                    {runners.map((runner) => (
                        <li key={runner.id} className="text-lg">
                            🏆 Coureur {runner.id}: {runner.score} points
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RacePage;
