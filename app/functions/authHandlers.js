
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
					localStorage.setItem(
						"userData",
						JSON.stringify({ token: data.token, userName: data.userName })
					);
					alert(data.message);
					router.push("pages/session");
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

	const handleOnSignup = (name, password, email) => {
		const signup = {
			user_name: name,
			user_password: password,
			user_email: email,
		};

		fetch(`${backendUrl}/users/logup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(signup),
		})
			.then((response) => response.json())
			.then((data) => {
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
			})
			.catch((error) => {
				console.error("Fetch Error:", error);
				alert(`Erreur lors de la création du compte: ${error.message}`);
			});
	};

	return { handleOnSignin, handleOnSignup };
}
