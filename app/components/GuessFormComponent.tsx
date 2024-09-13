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

const GuessFormComponent = ({
	currentGuess,
}: {
	currentGuess: Guess | null;
}) => {
	const [gender, setGender] = useState<string>("");
	const [weight, setWeight] = useState<string>("0.0");
	const [size, setSize] = useState<string>("0");
	const [names, setNames] = useState<{ girlName: string; boyName: string }[]>(
		Array(5).fill({ girlName: "", boyName: "" })
	);
	const [date, setDate] = useState<string>("2024-10-26");
	const [time, setTime] = useState<string>("12:00");
	const { token } = useAuth();
	const [hasGuess, setHasGuess] = useState<boolean>(false); // Pour savoir si une suggestion existe
	const [isEditing, setIsEditing] = useState<boolean>(true); // Pour gérer le mode d'édition
	const [loading, setLoading] = useState(false);
	const [scores, setScores] = useState<any>(null); // État pour les scores
	const { isBorn } = useIsBorn();

	useEffect(() => {
		// Si un guess existe déjà dans les props, remplis les champs du formulaire
		if (currentGuess) {
			setGender(currentGuess.guessed_gender);
			setWeight(currentGuess.guessed_weight.toString());
			setSize(currentGuess.guessed_size.toString());
			setNames(currentGuess.guessed_names);

			const utcDate = new Date(currentGuess.guessed_birthdate);
			const localDate = utcDate.toISOString().split("T")[0];
			const localTime = utcDate.toTimeString().split(" ")[0].substring(0, 5);
			setDate(localDate);
			setTime(localTime);

			setHasGuess(true); // Une suggestion existe déjà
			setIsEditing(false); // Désactive le mode d'édition si le guess existe
		}
		// Appel API pour récupérer les scores si le bébé est né
		if (isBorn === "true") {
			const fetchScores = async () => {
				try {
					const response = await fetch(`${backendUrl}/babyIsBorn/scores`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!response.ok) {
						throw new Error(`Erreur HTTP: ${response.status}`);
					}

					const data = await response.json();
					setScores(data.scores); // Stocker les scores dans l'état
				} catch (error) {
					console.error("Erreur lors de la récupération des scores :", error);
				}
			};

			fetchScores();
		}
	}, [currentGuess, isBorn, token]);

	const handleSubmit = async (event: React.FormEvent) => {
		setLoading(true);
		event.preventDefault();

		const dateTime = `${date} ${time}:00`;

		const guessData = {
			guessed_gender: gender,
			guessed_weight: parseFloat(weight),
			guessed_size: parseFloat(size),
			guessed_names: names,
			guessed_birthdate: dateTime,
		};

		try {
			const response = await fetch(`${backendUrl}/guesses`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(guessData),
			});

			if (!response.ok) {
				setLoading(false);
				throw new Error(`Erreur HTTP: ${response.status}`);
			}

			const data = await response.json();

			setHasGuess(true); // Après enregistrement, une suggestion existe maintenant
			setIsEditing(false); // Désactiver le mode édition après l'enregistrement
			setLoading(false);
		} catch (error) {
			// console.error("Erreur lors de l'envoi du guess :", error);
			alert("Erreur lors de l'enregistrement de votre supposition.");
			setLoading(false);
		}
	};

	const handleInputChange = (
		index: number,
		type: "girlName" | "boyName",
		value: string
	) => {
		const newNames = [...names];
		newNames[index] = { ...newNames[index], [type]: value };
		setNames(newNames);
	};

	const handleGenderClick = (selectedGender: string) => {
		if (isEditing) setGender(selectedGender);
	};

	const ScoreDisplay = ({
		score,
		maxScore,
	}: {
		score: number;
		maxScore: number;
	}) => {
		if (isBorn === "true") {
			return (
				<div className="font-bold border-white border-2 text-white rounded-full aspect-square w-12 flex items-center justify-center">
					{score ?? "N/A"}/{maxScore} {/* Affiche "N/A" si score est null */}
				</div>
			);
		}
		return null;
	};

	return (
		<div
			className={`w-full max-w-lg mx-auto mt-8 ${
				isEditing ? "bg-white" : "bg-neutral-400"
			} duration-200 ease-in-out p-6 rounded-lg shadow-lg`}
		>
			{hasGuess && !isEditing && isBorn === "false" && (
				<div className="text-center mb-4">
					<button
						onClick={() => setIsEditing(true)}
						className="custom-button font-bold"
					>
						Modifier la suggestion
					</button>
				</div>
			)}
			{ (isBorn === 'true') && (< CongratComponent />)}
			<form onSubmit={handleSubmit} className="space-y-12 py-5">
				<div>
					<div className="flex items-center justify-center space-x-4 pt-5">
						<div
							className={`relative ${
								gender === "boy"
									? "scale-100 bg-yellow-400 rounded-xl"
									: "scale-50"
							} transform transition-transform duration-200 ease-in-out`}
							onClick={() => handleGenderClick("boy")}
						>
							<img
								src="/mec.png"
								alt="Garçon"
								className={`w-24 h-24 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out ${
									!isEditing && "pointer-events-none opacity-50"
								}`}
							/>
						</div>
						<span className="text-gray-700">ou</span>
						<div
							className={`relative ${
								gender === "girl"
									? "scale-100  bg-yellow-400 rounded-xl"
									: "scale-50"
							} transform transition-transform duration-200 ease-in-out`}
							onClick={() => handleGenderClick("girl")}
						>
							<img
								src="/meuf.png"
								alt="Fille"
								className={`w-24 h-24 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out ${
									!isEditing && "pointer-events-none opacity-50"
								}`}
							/>
						</div>
						<div className="float-end">
							{scores && (
								<ScoreDisplay score={scores.score_gender} maxScore={2} />
							)}
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center text-gray-700">
						<img src="/weight.png" alt="Poid" className="w-12 h-12 mr-6" />
						<input
							type="text"
							value={weight}
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d*\.?\d*$/.test(value)) {
									setWeight(value);
								}
							}}
							disabled={!isEditing}
							className="mt-2 w-20 px-3 py-2 rounded-md bg-yellow-200"
						/>
						<span className="mt-2 px-3 py-2">kg</span>
						<div className="text-center mb-4">
							{scores && (
								<ScoreDisplay score={scores.score_weight} maxScore={2} />
							)}
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center text-gray-700">
						<img src="/height.png" alt="Taille" className="w-12 h-12 mr-6" />
						<input
							type="text"
							value={size}
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d*$/.test(value) && parseInt(value) <= 100) {
									setSize(value);
								}
							}}
							disabled={!isEditing}
							className="mt-2 w-20 px-3 py-2 rounded-md bg-yellow-200"
						/>
						<span className="mt-2 px-3 py-2">cm</span>
						<div className="float-end">
							{scores && (
								<ScoreDisplay score={scores.score_size} maxScore={2} />
							)}
						</div>
					</div>
				</div>
				<div>
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
													onChange={(e) =>
														handleInputChange(index, "girlName", e.target.value)
													}
													placeholder="••••••••"
													disabled={!isEditing}
													className="w-full px-3 py-1 bg-stone-800"
												/>
											</td>
											<td>
												<input
													type="text"
													value={guess.boyName}
													onChange={(e) =>
														handleInputChange(index, "boyName", e.target.value)
													}
													placeholder="••••••••"
													disabled={!isEditing}
													className="w-full px-3 bg-stone-800"
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="float-end">
							{scores && (
								<ScoreDisplay score={scores.score_names} maxScore={2} />
							)}
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center text-gray-700">
						<img src="/calendar.png" alt="Date" className="w-12 h-12 mr-6" />
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							disabled={!isEditing}
							className="mt-2 px-3 py-2 w-40 bg-yellow-200 rounded-md"
						/>
						<div className="float-end">
							{scores && (
								<ScoreDisplay score={scores.score_date} maxScore={2} />
							)}
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center text-gray-700">
						<img src="/clock.png" alt="heure" className="w-12 h-12 mr-6" />
						<input
							type="time"
							value={time}
							onChange={(e) => setTime(e.target.value)}
							disabled={!isEditing}
							className="mt-2 w-40 px-3 py-2 bg-yellow-200 rounded-md"
						/>
						<div className="float-end">
							{scores && (
								<ScoreDisplay score={scores.score_time} maxScore={2} />
							)}
						</div>
					</div>
					<div className="float-end">
							{scores && (
								<><span>Ton total : </span><ScoreDisplay score={scores.total_score} maxScore={2} /></>
							)}
						</div>
				</div>
				{loading ? (
					<div className="text-center">Veillez patienter...</div>
				) : (
					(!hasGuess || isEditing) && (
						<div className="text-center">
							<input
								type="submit"
								value="Enregistrer"
								className="custom-button font-bold"
							/>
						</div>
					)
				)}
			</form>
		</div>
	);
};

export default GuessFormComponent;
