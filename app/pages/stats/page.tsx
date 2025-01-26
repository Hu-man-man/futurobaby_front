"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsBorn } from "@/app/context/IsBornContext";
import backendUrl from "@/backendUrl";
import CountdownComponent from "../../components/CountdownComponent";
import BabyStatsComponent from "@/app/components/BabyStatsComponent";

// Définir un type pour les classements
type Ranking = {
	user_name: string;
	total_score: number;
	rank: number;
	user_id: string;
};

const LOCAL_STORAGE_KEY = "rankings";

const StatsPage = () => {
	const router = useRouter();
	const [rankings, setRankings] = useState<Ranking[]>([]);
	const { isBorn } = useIsBorn();

	useEffect(() => {
		// Fonction pour récupérer les données depuis l'API
		const fetchRankings = async () => {
			try {
				const response = await fetch(`${backendUrl}/babyIsBorn/rankings`, {
					method: "GET",
				});
				if (response.ok) {
					const data = await response.json();
					// Sauvegarder les données dans le localStorage
					localStorage.setItem(
						LOCAL_STORAGE_KEY,
						JSON.stringify(data.rankings)
					);
					setRankings(data.rankings);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des classements depuis l'API :",
					error
				);
			}
		};

		// Vérifier les données existantes dans le localStorage
		const savedRankings = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (savedRankings) {
			setRankings(JSON.parse(savedRankings));
		} else {
			fetchRankings();
		}
	}, []);

	const targetDate = "2024-10-26T12:00:00";

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 m-4">
			<CountdownComponent targetDate={targetDate} />
			<h1 className="text-2xl mt-4 font-semibold text-gray-700 text-center">
				Bienvenue à...
			</h1>

			{/* Afficher les statistiques du bébé uniquement si isBorn est "true" */}
			{isBorn === "true" && <BabyStatsComponent />}
			<h2 className="text-4xl font-arista text-center mb-7 text-gray-800 mt-7">
				Podium
			</h2>
			<div className="flex justify-center">
				<img
					src="/podium.jpg"
					alt="podium"
					className={`max-w-96 w-full rounded-lg shadow-lg`}
				/>
			</div>
			<h2 className="text-4xl font-arista text-center mb-7 text-gray-800 mt-7">
				Fréquence prénoms
			</h2>
			<div className="flex justify-center">
				<img
					src="/prenomsproposes.jpg"
					alt="stats des prénoms les plus proposés"
					className={`max-w-96 w-full  rounded-lg shadow-lg`}
				/>
			</div>
			<h2 className="text-4xl font-arista text-center mb-7 text-gray-800 mt-7">
				Stats
			</h2>
			<div className="flex justify-center">
				<img
					src="/stats.jpg"
					alt="statistiques"
					className={`max-w-96 w-full rounded-lg shadow-lg`}
				/>
			</div>
			<div className="flex flex-col justify-center my-8 mx-24 md:m-4">
				<h2 className="text-4xl text-center mb-4 font-arista">Classement</h2>
				<table className="max-w-lg bg-white  rounded-lg overflow-hidden border-2 border-black shadow-lg">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b">Rang</th>
							<th className="py-2 px-4 border-b">Nom</th>
							<th className="py-2 px-4 border-b">Score Total</th>
						</tr>
					</thead>
					<tbody>
						{rankings.map((ranking, index) => (
							<tr
								key={index}
								onClick={() => {
									const url = `/pages/guessDisplay?user_id=${
										ranking.user_id
									}&user_name=${encodeURIComponent(ranking.user_name)}&rank=${
										ranking.rank
									}`;
									router.push(url); // Construisez l'URL comme une chaîne de caractères
								}}
								className="cursor-pointer hover:bg-gray-100"
							>
								<td className="py-2 px-4 border-b text-center">
									{ranking.rank}
								</td>
								<td className="py-2 px-4 border-b text-center">
									{ranking.user_name}
								</td>
								<td className="py-2 px-4 border-b text-center">
									{ranking.total_score}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
};

export default StatsPage;
