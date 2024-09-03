
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import GuessFormComponent from "../../components/GuessFormComponent";
import CountdownComponent from "@/app/components/CountdownComponent";

const sessionPage = () => {
	const router = useRouter();
	const { token, logout } = useAuth();
	const [userName, setUserName] = useState("");

	useEffect(() => {
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

	const targetDate = "2024-10-26T12:00:00";

	const handleLogout = () => {
		logout();
		localStorage.removeItem("userData");
		router.push("/"); // Redirige vers la page de connexion
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
			<CountdownComponent targetDate={targetDate} />
			<div className="mt-6">
			</div>
			<h1 className="text-2xl mt-4 font-semibold text-gray-700">
				Quels sont tes pronostics sur Bubule {userName} ?
			</h1>
			<GuessFormComponent />
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
