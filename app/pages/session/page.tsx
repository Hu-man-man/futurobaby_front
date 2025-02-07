"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import GuessFormComponent from "../../components/GuessFormComponent";
import CountdownComponent from "@/app/components/CountdownComponent";
import BabyStatsComponent from "@/app/components/BabyStatsComponent";
import { RulesComponent } from "@/app/components/RulesComponent";
import { useIsBorn } from "@/app/context/IsBornContext";
import backendUrl from "@/backendUrl";

const sessionPage = () => {
	const router = useRouter();
	const { token, logout } = useAuth();
	const [userName, setUserName] = useState("");
	const { isBorn } = useIsBorn();
	const [currentGuess, setCurrentGuess] = useState(null); // Pour stocker la réponse de l'API
	const [isLoadingGuess, setIsLoadingGuess] = useState(true); // État de chargement

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

				// Sauvegarde des données du pronostic dans le localStorage
				localStorage.setItem("currentGuess", JSON.stringify(data.guess));
			}
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des données de guess :",
				error
			);
		} finally {
			setIsLoadingGuess(false);
		}
	};

	useEffect(() => {
		if (isBorn === "true") {
			router.push("stats");
		}
		const verifyData = async () => {
			if (!token) {
				router.push("/"); // Redirige vers la page d'accueil si non connecté
				return;
			}

			const userDataString = localStorage.getItem("userData");
			const savedGuess = localStorage.getItem("currentGuess");

			// Si userData existe mais pas currentGuess, ne déconnecte pas automatiquement si c'est la première connexion
			if (userDataString && !savedGuess) {
				try {
					await fetchCurrentGuess(); // Récupérer les données avant de prendre une décision
				} catch (error) {
					console.error(
						"Erreur lors de la récupération des données de guess :",
						error
					);
					logout();
					localStorage.removeItem("userData"); // Supprime userData en cas d'erreur de récupération
					router.push("/"); // Redirige vers la page de connexion
				}
			} else if (userDataString) {
				const userData = JSON.parse(userDataString);
				setUserName(userData.userName || "");
			}

			if (!savedGuess) {
				await fetchCurrentGuess();
			} else {
				setCurrentGuess(JSON.parse(savedGuess));
				setIsLoadingGuess(false); // Arrête le chargement si un pronostic est trouvé
			}
		};

		verifyData(); // Appelle la fonction asynchrone pour gérer la logique
	}, [isBorn, token, router]);

	const targetDate = "2024-10-26T12:00:00";

	const handleLogout = () => {
		logout();
		localStorage.removeItem("userData");
		localStorage.removeItem("currentGuess");
		router.push("/"); // Redirige vers la page de connexion
	};

	const phrases = {
		true: `Bienvenue à...`,
		false: `Quels sont tes pronostics sur Bubulle ${userName} ?`,
		endOfPredictions: (
			<>
				Les pronostics sont terminés.
				<br />
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

			{isBorn === "true" && <BabyStatsComponent />}

			{/* Affichage du message de chargement pendant la vérification */}
			{isLoadingGuess ? (
				<p className="text-gray-500">
					Vérification si vous avez déjà fait un pronostic...
				</p>
			) : !currentGuess && isBorn !== "false" ? (
				""
			) : (
				<GuessFormComponent currentGuess={currentGuess} />
			)}

			{isBorn === "true" && <RulesComponent />}

			<div
				className="text-slate-500 hover:text-black hover:cursor-pointer mt-2"
				onClick={handleLogout}
			>
				Se déconnecter
			</div>
		</main>
	);
};

export default sessionPage;
