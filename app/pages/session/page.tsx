
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import GuessFormComponent from "../../components/GuessFormComponent";
import CountdownComponent from "@/app/components/CountdownComponent";
import BabyStatsComponent from "@/app/components/BabyStatsComponent";
import { useIsBorn } from "@/app/context/IsBornContext";
import backendUrl from "@/backendUrl";

const sessionPage = () => {
	const router = useRouter();
	const { token, logout } = useAuth();
	const [userName, setUserName] = useState("");
	const { isBorn } = useIsBorn();
	const [currentGuess, setCurrentGuess] = useState(null); // Pour stocker la réponse de l'API

	useEffect(() => {
		if (!token) {
			router.push("/"); // Redirige vers la page d'accueil si non connecté
		} else {
			const userDataString = localStorage.getItem("userData");
			if (userDataString) {
				const userData = JSON.parse(userDataString);
				setUserName(userData.userName || "");
			}

			// Fetch current guess data
			const fetchCurrentGuess = async () => {
				try {
					const response = await fetch(`${backendUrl}/guesses/current`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setCurrentGuess(data.guess);
					}
				} catch (error) {
					console.error("Erreur lors de la récupération des données de guess :", error);
				}
			};

			fetchCurrentGuess();
		}
		console.log(token)
	}, [token, router]);

	const targetDate = "2024-10-26T12:00:00";

	const handleLogout = () => {
		logout();
		localStorage.removeItem("userData");
		router.push("/"); // Redirige vers la page de connexion
	};

	const phrases = {
		'true': `Ca y est l'enfant est né !!`,
		'false': `Quels sont tes pronostics sur Bubule ${userName} ?`,
		'endOfPredictions': (
			<>
				Les pronostics sont terminés.<br />
				Tu seras prévenu.e de la naissance et du résultat au plus tôt !
			</>
		),
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
			<CountdownComponent targetDate={targetDate} />
			<div className="mt-6"></div>
			<h1 className="text-2xl mt-4 font-semibold text-gray-700 text-center">
				{phrases[isBorn] || `Bonjour ${userName}`}
			</h1>
			{(isBorn === 'true') && (
				<BabyStatsComponent />
			)}
			{(!currentGuess && isBorn !== 'false') ? "" : (
				<GuessFormComponent currentGuess={currentGuess} />
			)}
			<div
				className=" text-slate-500 hover:text-black hover:cursor-pointer mt-2"
				onClick={handleLogout}
			>
				Se déconnecter
			</div>
		</main>
	);
};

export default sessionPage;
