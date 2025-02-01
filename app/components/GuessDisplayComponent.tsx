"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import backendUrl from "@/backendUrl";
import { useIsBorn } from "../context/IsBornContext";
import { CongratComponent } from "./CongratComposant";

interface Guess {
	guessed_gender: string;
	guessed_weight: number;
	guessed_size: number;
	guessed_names: { girlName: string; boyName: string }[];
	guessed_birthdate: string;
}

export const GuessDisplayComponent = ({
	user_Id,
	user_name,
	rank,
}: {
	user_Id: string;
	user_name: string;
	rank: number;
}) => {
	const [gender, setGender] = useState<string>("");
	const [weight, setWeight] = useState<string>("");
	const [size, setSize] = useState<string>("");
	const [names, setNames] = useState<{ girlName: string; boyName: string }[]>(
		Array(5).fill({ girlName: "", boyName: "" })
	);
	const [date, setDate] = useState<string>("2024-10-26");
	const [time, setTime] = useState<string>("12:00");
	const [scores, setScores] = useState<any>(null);
	const { isBorn } = useIsBorn();

	useEffect(() => {
		const fetchGuessData = async () => {
			try {
				const response = await fetch(
					`${backendUrl}/guesses/current/public?user_id=${user_Id}`
				);
				if (!response.ok) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}

				const guessData = await response.json();
				setGender(guessData.guess.guessed_gender);
				setWeight(guessData.guess.guessed_weight.toString());
				setSize(guessData.guess.guessed_size.toString());
				setNames(guessData.guess.guessed_names);

				const utcDate = new Date(guessData.guess.guessed_birthdate);
				const localDate = utcDate.toISOString().split("T")[0];
				const localTime = utcDate.toTimeString().split(" ")[0].substring(0, 5);
				setDate(localDate);
				setTime(localTime);
			} catch (error) {
				console.error("Erreur lors de la récupération des données :", error);
			}
		};

		const fetchScores = async () => {
			try {
				const response = await fetch(
					`${backendUrl}/babyIsBorn/scores?user_id=${user_Id}`
				);
				if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
				const data = await response.json();
				setScores(data.scores);
			} catch (error) {
				console.error("Erreur lors de la récupération des scores :", error);
			}
		};
		fetchScores();
		fetchGuessData();
	}, [user_Id]);

	const handleScoreClick = (type: string) => {
		if (type !== "total") {
			const rules: Record<string, string> = {
				gender:
					"Genre :\n• 3 points si tu as deviné que ça allait être un Garçon.",
				weight:
					"Poids :\n• 4 points pour le poids exact de 3,5 kg.\n• 1 point si le poids est compris entre 3,4 kg et 3,6 kg.",
				size: "Taille :\n• 3 points pour la taille exacte de 52,5 cm.\n• 1 point si la taille est comprise entre 50 cm et 55 cm.",
				names:
					"Prénoms :\n• 7 points si tu as trouvé le prénom Marin.\n• 2 points si un des prénoms proposés partage au moins 4 lettres avec 'Marin'.\n• 1 point si un des prénoms proposés partage au moins 3 lettres avec 'Marin'.",
				date: "Date de naissance :\n• 3 points si tu as trouvé la date exacte du 26 octobre 2024.\n• 1 point pour les 25 et 27 octobre 2024.",
				time: "Heure de naissance :\n• 5 points si tu as trouvé l'heure exacte (à 15 minutes près) de 18h58.\n• 3 points si la différence est d'une heure : entre 17h58 et 19h58.\n• 1 point si la différence est comprise entre 60 et 120 minutes.",
			};

			alert(rules[type]);
		}
	};
	
	const ScoreDisplay = ({
		score,
		maxScore,
		type,
	}: {
		score: number;
		maxScore?: number; // maxScore est maintenant optionnel
		type: string;
	}) => {
		return (
			<div className="relative group">
				{/* Cercle du score */}
				<div
					onClick={() => handleScoreClick(type)}
					className={`font-bold border-white border-2 text-white rounded-full aspect-square w-12 flex items-center justify-center ${
						!maxScore ? "cursor-default" : "cursor-pointer hover:bg-gray-300"
					}`}
					title="Clique pour voir la règle"
				>
					{score ?? "N/A"}
					{maxScore !== undefined && `/${maxScore}`}
					{maxScore !== undefined && (
						<div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold cursor-pointer shadow-md hover:bg-gray-200">
							i
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="w-full max-w-lg sm:mx-auto mt-8 bg-neutral-400 duration-200 ease-in-out p-6 rounded-3xl shadow-lg">
			<CongratComponent user_name={user_name} rank={rank} />
			<form
				onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
				className="space-y-12 py-5"
			>
				{/* Genre */}
				<div className="relative flex items-center justify-center">
					<div className="flex items-center justify-center space-x-4 pt-5">
						<div
							className={`relative ${
								gender === "boy"
									? "scale-100 bg-yellow-400 rounded-xl"
									: "scale-50"
							} transform transition-transform duration-200 ease-in-out`}
						>
							<img
								src="/mec.png"
								alt="Garçon"
								className={`w-24 h-24 opacity-50`}
							/>
						</div>
						<span className="text-gray-700">ou</span>
						<div
							className={`relative ${
								gender === "girl"
									? "scale-100 bg-yellow-400 rounded-xl"
									: "scale-50"
							} transform transition-transform duration-200 ease-in-out`}
						>
							<img
								src="/meuf.png"
								alt="Fille"
								className={`w-24 h-24 opacity-50`}
							/>
						</div>
					</div>
					<div className="absolute right-0 sm:right-6">
						{scores && (
							<ScoreDisplay
								score={scores.score_gender}
								maxScore={3}
								type={"gender"}
							/>
						)}
					</div>
				</div>

				{/* Poids */}
				<div className="relative flex items-center justify-center">
					<div className="flex items-center justify-center">
						<img src="/weight.png" alt="Poids" className="w-12 h-12 mr-6" />
						<input
							type="text"
							value={weight}
							disabled
							className="mt-2 w-20 px-3 py-2 rounded-md bg-yellow-200 opacity-50"
						/>
						<span className="mt-2 px-3 py-2">kg</span>
					</div>
					<div className="absolute right-0 sm:right-6">
						{scores && (
							<ScoreDisplay
								score={scores.score_weight}
								maxScore={4}
								type={"weight"}
							/>
						)}
					</div>
				</div>

				{/* Taille */}
				<div className="relative flex items-center justify-center">
					<div className="flex items-center justify-center">
						<img src="/height.png" alt="Taille" className="w-12 h-12 mr-6" />
						<input
							type="text"
							value={size}
							disabled
							className="mt-2 w-20 px-3 py-2 rounded-md bg-yellow-200 opacity-50"
						/>
						<span className="mt-2 px-3 py-2">cm</span>
					</div>
					<div className="absolute right-0 sm:right-6">
						{scores && (
							<ScoreDisplay
								score={scores.score_size}
								maxScore={3}
								type={"size"}
							/>
						)}
					</div>
				</div>
				<div className="relative flex items-center justify-center">
					<div></div>
					<div className="block text-gray-700">
						<div className="overflow-hidden rounded-lg border border-black mt-2">
							<table className="w-full">
								<thead>
									<tr>
										<th className="text-left border-b border-black p-2 py-1 text-xs sm:text-base">
											Prénoms de fille
										</th>
										<th className="text-left border-b border-black p-2 py-1 text-xs sm:text-base">
											Prénoms de garçon
										</th>
									</tr>
								</thead>
								<tbody>
									{names.map((guess, index) => (
										<tr
											key={index}
											className="font-crayon text-3xl bg-stone-800 text-slate-200 tracking-widest"
										>
											<td className=" border-r border-gray-600">
												<input
													type="text"
													value={guess.girlName}
													placeholder="••••••••"
													disabled
													className="w-full px-3 py-1 bg-stone-800"
												/>
											</td>
											<td>
												<input
													type="text"
													value={guess.boyName}
													placeholder="••••••••"
													disabled
													className="w-full px-3 bg-stone-800"
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="absolute right-0 sm:right-6 bottom-1">
							{scores && (
								<ScoreDisplay
									score={scores.score_names}
									maxScore={7}
									type={"names"}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="relative flex items-center justify-center">
					<div
						className={`flex items-center sm:justify-center ${
							scores ? "justify-between" : "justify-center"
						} w-full text-gray-700`}
					>
						<div className="flex items-center justify-center">
							<img src="/calendar.png" alt="Date" className="w-12 h-12 mr-6" />
							<input
								type="date"
								value={date}
								disabled
								className="mt-2 px-3 py-2 w-40 bg-yellow-200 rounded-md"
							/>
						</div>
						<div className="sm:absolute sm:right-6">
							{scores && (
								<ScoreDisplay
									score={scores.score_date}
									maxScore={3}
									type={"date"}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="relative flex items-center justify-center">
					<div
						className={`flex items-center sm:justify-center ${
							scores ? "justify-between" : "justify-center"
						} w-full text-gray-700`}
					>
						<div className="flex items-center justify-center">
							<img src="/clock.png" alt="heure" className="w-12 h-12 mr-6" />
							<input
								type="time"
								value={time}
								disabled
								className="mt-2 w-40 px-3 py-2 bg-yellow-200 rounded-md"
							/>
						</div>
						<div className="sm:absolute sm:right-6">
							{scores && (
								<ScoreDisplay
									score={scores.score_time}
									maxScore={5}
									type={"time"}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="w-full border-b-2 border-black h-1 border-dotted"></div>
				<div
					className="relative flex items-center justify-center"
					style={{ marginBottom: "0", marginTop: "1rem" }}
				>
					{/* <div className="flex items-center sm:justify-center justify-between w-full text-gray-700 sm:my-10"> */}
					<div
						className={`flex items-center sm:justify-center ${
							scores ? "justify-between" : "justify-center"
						} w-full text-gray-700 sm:my-10`}
					>
						<div></div>
						<div className="sm:absolute sm:right-6 flex items-center justify-center">
							<div className="absolute right-20 font-arista text-2xl whitespace-nowrap">
								Ton total :
							</div>
							<div className="">
								{scores && (
									<>
										<ScoreDisplay score={scores.total_score} type={"total"} />
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};
