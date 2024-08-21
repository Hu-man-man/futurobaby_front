"use client";

import { useState, useEffect } from "react";
import backendUrl from "../../../backendUrl";
import { Test } from "../../components/test";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { token, setToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push("pages/cession"); // Redirection si déjà connecté
        }
    }, [token, router]);

    function handleOnSignin() {
        const login = {
            user_name: name,
            user_password: password,
        };
        fetch(`${backendUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(login),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    setToken(data.token);
                    localStorage.setItem("userData", JSON.stringify({ token: data.token, userName: data.userName }));
                    alert(data.message);
                    router.push("/cession");
                } else {
                    alert(data.message);
                    setPassword("");
                }
            })
            .catch((error) => {
                console.error("Fetch Error:", error); 
                alert(`Erreur lors de la connexion: ${error.message}`);
            });
    }


	// function handleOnSignup() {
	// 	const userEmail = window.prompt("Veuillez entrer votre adresse email :");
	// 	if (userEmail) {
	// 		const signup = {
	// 			user_name: name,
	// 			user_password: password,
	// 			user_email: userEmail,
	// 		};
	// 		fetch(`${backendUrl}/users/logup`, {
	// 			method: "POST",
	// 			headers: { "Content-Type": "application/json" },
	// 			body: JSON.stringify(signup),
	// 		})
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			if (data.token) {
	// 				setToken(data.token);  // On connecte directement l'utilisateur après la création
	// 				localStorage.setItem("userData", JSON.stringify({ token: data.token, userName: data.userName }));
	// 				alert("Compte créé avec succès !");
	// 				router.push("/cession");
	// 			} else {
	// 				alert(data.message || "Erreur lors de la création du compte.");
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error("Fetch Error:", error); 
	// 			alert(`Erreur lors de la création du compte: ${error.message}`);
	// 		});
	// 	} else {
	// 		alert("L'adresse email est requise pour créer un compte.");
	// 	}
	// }
    function handleOnSignup() {
        const userEmail = window.prompt("Veuillez entrer votre adresse email :");
    
        // Validation du format de l'email avec une regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (userEmail && emailPattern.test(userEmail)) {
            const signup = {
                user_name: name,
                user_password: password,
                user_email: userEmail,
            };
            fetch(`${backendUrl}/users/logup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signup),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    setToken(data.token);  // On connecte directement l'utilisateur après la création
                    localStorage.setItem("userData", JSON.stringify({ token: data.token, userName: data.userName }));
                    alert("Compte créé avec succès !");
                    router.push("/cession");
                } else {
                    alert(data.message || "Erreur lors de la création du compte.");
                }
            })
            .catch((error) => {
                console.error("Fetch Error:", error); 
                alert(`Erreur lors de la création du compte: ${error.message}`);
            });
        } else {
            alert("Veuillez entrer une adresse email valide.");
        }
    }
    
	
	

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-96 h-auto bg-slate-400 p-11 *:m-2">
                <p>Nom: A2 mdp: la+belle</p>
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
                        onClick={handleOnSignin}
                    />
                </div>
                <div className="w-48 flex justify-center rounded bg-slate-500 mt-2">
                    <input
                        type="button"
                        value="Créer un compte"
                        onClick={handleOnSignup}
                    />
                </div>
            </div>
            <Test />
        </main>
    );
}
