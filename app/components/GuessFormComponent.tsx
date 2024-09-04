
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import backendUrl from "@/backendUrl";

const GuessFormComponent = () => {
	const [gender, setGender] = useState<string>("");
	const [weight, setWeight] = useState<string>("0.0");
	const [size, setSize] = useState<string>("0");
	const [names, setNames] = useState<{ girlName: string; boyName: string }[]>(
		Array(5).fill({ girlName: "", boyName: "" })
	);
	const [date, setDate] = useState<string>("2024-10-26");
	const [time, setTime] = useState<string>("12:00");
	const { token } = useAuth();
	const [hasGuess, setHasGuess] = useState<boolean>(false);  // Pour savoir si une suggestion existe
	const [isEditing, setIsEditing] = useState<boolean>(false);  // Pour gérer le mode d'édition

	useEffect(() => {
		const fetchExistingGuess = async () => {
			try {
				const response = await fetch(`${backendUrl}/guesses/current`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					if (data.guess) {
						setGender(data.guess.guessed_gender);
						setWeight(data.guess.guessed_weight.toString());
						setSize(data.guess.guessed_size.toString());
						setNames(data.guess.guessed_names);

						const utcDate = new Date(data.guess.guessed_birthdate);
						const localDate = utcDate.toISOString().split("T")[0];
						const localTime = utcDate
							.toTimeString()
							.split(" ")[0]
							.substring(0, 5);
						setDate(localDate);
						setTime(localTime);
						
						setHasGuess(true);  // Une suggestion existe déjà
					}
				}
			} catch (error) {
				// console.error("Erreur lors de la récupération du guess:", error);
			}
		};

		fetchExistingGuess();
	}, [token]);

	const handleSubmit = async (event: React.FormEvent) => {
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
				throw new Error(`Erreur HTTP: ${response.status}`);
			}

			const data = await response.json();
			
			setHasGuess(true);  // Après enregistrement, une suggestion existe maintenant
			setIsEditing(false);  // Désactiver le mode édition après l'enregistrement
		} catch (error) {
			// console.error("Erreur lors de l'envoi du guess :", error);
			alert("Erreur lors de l'enregistrement de votre supposition.");
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

	return (
		<div className={`w-full max-w-lg mx-auto mt-8 ${isEditing ?  "bg-white" : "bg-neutral-400" } duration-200 ease-in-out p-6 rounded-lg shadow-lg`}>
			{hasGuess && !isEditing && (
				<div className="text-center mb-4">
					<button
						onClick={() => setIsEditing(true)}
						className="custom-button font-bold"
					>
						Modifier la suggestion
					</button>
				</div>
			)}
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
					</div>
				</div>
				{(!hasGuess || isEditing) && (
					<div className="text-center">
						<input
							type="submit"
							value="Enregistrer"
							className="custom-button font-bold"
						/>
					</div>
				)}
			</form>
		</div>
	);
};

export default GuessFormComponent;

