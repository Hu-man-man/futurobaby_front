// utils/authHandlers.js
import backendUrl from "../../backendUrl";
import { useAuth } from "../context/AuthContext";
import { useRouter } from 'next/navigation';

export function useAuthHandlers() {
    const { token, setToken } = useAuth();
    const router = useRouter();

    const handleOnSignin = (name, password) => {
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
                    // router.push("/cession");
                } else {
                    alert(data.message);
                    setPassword("");
                }
            })
            .catch((error) => {
                console.error("Fetch Error:", error);
                alert(`Erreur lors de la connexion: ${error.message}`);
            });
    };

    const handleOnSignup = (name, password) => {
        const userEmail = window.prompt("Veuillez entrer votre adresse email :");
    
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
                    console.log("Storing token and userName in localStorage:", { token: data.token, userName: data.userName }); // Vérifiez les données avant le stockage
                    
                    setToken(data.token);
                    localStorage.setItem("userData", JSON.stringify({ token: data.token, userName: data.userName }));
                    alert("Compte créé avec succès !");
                    // router.push("/cession");
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
    };

    return { handleOnSignin, handleOnSignup };
}
