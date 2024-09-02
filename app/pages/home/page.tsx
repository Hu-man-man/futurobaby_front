"use client";

import { useState, useEffect } from "react";
import { Test } from "../../components/test";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useAuthHandlers } from "../../functions/authHandlers";
import CountdownComponent from "../../components/CountdownComponent";

export default function HomePage() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState(""); // Nouvel état pour l'email
	const [isLoginMode, setIsLoginMode] = useState(false); // État pour gérer le mode actuel
	const [loading, setLoading] = useState(false);
	const { token, setToken } = useAuth();
	const router = useRouter();
	const { handleOnSignin, handleOnSignup } = useAuthHandlers();

	const targetDate = "2024-10-26T12:00:00";

	const handleChangePage = () => {
		setLoading(true);
		router.push("pages/session");
		setLoading(false);
	};

	const toggleMode = () => {
		setIsLoginMode((prev) => !prev); // Basculer entre le mode connexion et inscription
	};

	const handleSubmit = () => {
		if (isLoginMode) {
			handleOnSignin(name, password);
		} else {
			handleOnSignup(name, password, email);
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div>
				<h1>
					Décompte du temps avant la date théorique de la naissance du bubulle
				</h1>
				<CountdownComponent targetDate={targetDate} />
			</div>
			{token ? (
				<button
					className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
					onClick={() => handleChangePage()}
				>
					{loading ? "Veuillez patienter..." : "Faire des suppositions !"}
				</button>
			) : (
				// <div className="w-96 h-auto bg-slate-400 p-11 *:m-2">
				<div className="w-96 h-auto bg-slate-200 p-11 *:m-2">
					<h2>{isLoginMode ? "Se connecter" : "Créer un compte"}</h2>
					<input
						type="text"
						placeholder="Ton nom"
						title="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Ton mot de passe"
						title="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{!isLoginMode && (
						<input
							type="email"
							placeholder="Ton email"
							title="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					)}
					<div className="custom-button">
						<input
							type="button"
							value="Valider"
							onClick={handleSubmit}
						/>
					</div>
					<div className="w-48 flex justify-center rounded bg-slate-500 mt-2">
						<input
							type="button"
							value={isLoginMode ? "Créer un compte" : "Se connecter"}
							onClick={toggleMode}
						/>
					</div>
				</div>
			)}
			<Test />
		</main>
	);

}

