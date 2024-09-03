"use client";

import { useState, useEffect } from "react";
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

	useEffect(() => {
		if (token) {
			router.push("pages/session");
		}
	}, [token, router]);

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
		<main className="flex min-h-screen flex-col items-center text-center justify-between p-24">
			<CountdownComponent targetDate={targetDate} />
			{token ? (
				<div>{loading && "Veuillez patienter..."}</div>
			) : (
				// <div className="w-96 h-auto bg-slate-400 p-11 *:m-2">
				<div className="w-96 h-auto p-11 *:m-2">
					<h2 className="text-3xl font-bold">
						{isLoginMode ? "Se connecter" : "Créer un compte"}
					</h2>
					<p>{!isLoginMode && "Pour être tenu au courant de la naissance et faire des pronistics"}</p>
					<input
						className="bg-yellow-200 p-1"
						type="text"
						placeholder="Nom"
						title="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<input
						className="bg-yellow-200 p-1"
						type="password"
						placeholder="Mot de passe"
						title="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{!isLoginMode && (
						<input
							className="bg-yellow-200 p-1"
							type="email"
							placeholder="Email"
							title="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					)}
					<div className="custom-button">
						<input type="button" value="Valider" onClick={handleSubmit} />
					</div>
					<div
						className=" text-slate-500 hover:text-black hover:cursor-pointer pt-10"
						onClick={toggleMode}
					>
						{isLoginMode ? "Créer un compte" : "Se connecter"}
					</div>
				</div>
			)}
		</main>
	);
}
