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
	const { token, setToken } = useAuth();
	const router = useRouter();
	const { handleOnSignin, handleOnSignup } = useAuthHandlers();

	const targetDate = "2024-10-26T12:00:00";

	// useEffect(() => {
	// 	if (token) {
	// 		router.push("pages/cession"); // Redirection si déjà connecté
	// 	}
	// }, [token, router]);

	const handleChangePage = () => {
		// if (token) {
			router.push("pages/cession"); // Redirection si déjà connecté
		// }
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div>
				<h1>
					Décompte du temps avant la date théorique de la naissance du bubulle
				</h1>
				<CountdownComponent targetDate={targetDate} />
			</div>
			{ token ? (
				
					<button
						className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
						onClick={() => handleChangePage()}
					>
                        Faire des suppositions !
                    </button>
				
            ) : (
				<div className="w-96 h-auto bg-slate-400 p-11 *:m-2">
					{/* <p>Nom: A2 mdp: la+belle</p> */}
					<p>Etre prévenu de la naissance et faire une supposition !</p>
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
					<div className="w-48 flex justify-center rounded bg-slate-500">
						<input
							type="button"
							value="Se connecter"
							onClick={() => handleOnSignin(name, password)}
						/>
					</div>
					<div className="w-48 flex justify-center rounded bg-slate-500 mt-2">
						<input
							type="button"
							value="Créer un compte"
							onClick={() => handleOnSignup(name, password)}
						/>
					</div>
				</div>
			) }
			<Test />
		</main>
	);
}
