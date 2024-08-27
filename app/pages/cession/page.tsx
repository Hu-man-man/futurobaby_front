"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import GuessFormComponent from "../../components/GuessFormComponent"

const CessionPage = () => {
	const router = useRouter();
	const { token, logout } = useAuth();
	const [userName, setUserName] = useState("");

	useEffect(() => {
		console.log("token  " + token);
		if (!token) {
			router.push("/"); // Redirige vers la page d'accueil si non connecté
		} else {
			const userDataString = localStorage.getItem("userData");
			if (userDataString) {
				const userData = JSON.parse(userDataString);
				setUserName(userData.userName || "");
			}
		}
	}, [token, router]);

	const handleLogout = () => {
		logout();
		localStorage.removeItem("userData");
		router.push("/"); // Redirige vers la page de connection
	};

	const handleChangePage = () => {
		router.push("/"); // Redirection si déjà connecté
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			<div>
				<button
					className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
					onClick={handleLogout}
				>
					Se déconnecter
				</button>
				<button
					className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
					onClick={handleChangePage}
				>
					Retour à l'acceuil
				</button>
			</div>
			<h1 className="text-2xl">Bienvenue dans ta cession {userName} !</h1>
            <GuessFormComponent />
		</main>
	);
};

export default CessionPage;
