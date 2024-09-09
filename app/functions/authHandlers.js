
import backendUrl from "../../backendUrl";
import { useAuth } from "../context/AuthContext";
import { useRouter } from 'next/navigation';

export function useAuthHandlers() {
	const { token, setToken } = useAuth();
	const router = useRouter();

	const handleOnSignin = async (name, password) => {
		const login = {
			user_name: name,
			user_password: password,
		};
		try {
			const response = await fetch(`${backendUrl}/users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(login),
			});
			const data = await response.json();
			if (data.token) {
				setToken(data.token);
				localStorage.setItem(
					"userData",
					JSON.stringify({ token: data.token, userName: data.userName })
				);
				router.push("pages/session");
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert(`Erreur lors de la connexion: ${error.message}`);
			throw error;  // Propagation de l'erreur pour la gestion dans `handleSubmit`
		}
	};

	const handleOnSignup = async (name, password, email) => {
		const signup = {
			user_name: name,
			user_password: password,
			user_email: email,
		};
		try {
			const response = await fetch(`${backendUrl}/users/logup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(signup),
			});
			const data = await response.json();
			if (data.token) {
				setToken(data.token);
				localStorage.setItem(
					"userData",
					JSON.stringify({ token: data.token, userName: data.userName })
				);
				alert("Compte créé avec succès !");
				router.push("pages/session");
			} else {
				alert(data.message || "Erreur lors de la création du compte.");
			}
		} catch (error) {
			alert(`Erreur lors de la création du compte: ${error.message}`);
			throw error;  // Propagation de l'erreur pour la gestion dans `handleSubmit`
		}
	};

	return { handleOnSignin, handleOnSignup };
}

