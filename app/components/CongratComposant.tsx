import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Assurez-vous que vous avez accès à l'authentification et au token utilisateur
import backendUrl from "@/backendUrl"; // Backend URL

export const CongratComponent = () => {
	const router = useRouter();
	const { token } = useAuth(); // Accéder au token utilisateur depuis le contexte AuthContext
	const [userRank, setUserRank] = useState<number | null>(null); // Stocker le rang de l'utilisateur
	const [userName, setUserName] = useState<string>("");

	// Fetch le classement de l'utilisateur
	useEffect(() => {
		const fetchUserRank = async () => {
			const userDataString = localStorage.getItem("userData");
			if (userDataString) {
				const userData = JSON.parse(userDataString);
				setUserName(userData.userName || "");

				try {
					const response = await fetch(`${backendUrl}/babyIsBorn/rankings`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						const userRanking = data.rankings.find(
							(ranking: { user_name: string }) =>
								ranking.user_name === userData.userName
						);

						if (userRanking) {
							setUserRank(parseInt(userRanking.rank)); // Assurez-vous que `rank` est bien un nombre
						} else {
							setUserRank(null); // Pas de classement trouvé
						}
					}
				} catch (error) {
					console.error(
						"Erreur lors de la récupération du classement :",
						error
					);
				}
			}
		};

		if (token) {
			fetchUserRank();
		}
	}, [token]);

	const handleStatsPage = () => {
		router.push("/pages/stats");
	};

	// Fonction pour formater le rang de l'utilisateur
	const formatRank = (rank: number | null) => {
		if (rank === 1) return "1er";
		if (rank === 2) return "2nd";
		if (rank) return `${rank}ème`;
		return "sans classement";
	};

	return (
		<div className="flex flex-col justify-center items-center">
			<div className="text-center m-3 mb-10">
				Merci pour ta participation, tu es arrivé.e{" "}
				<span className="font-bold">{formatRank(userRank)}</span> !
			</div>
			<div
				className="custom-button outline-offset-8 outline-dashed outline-4 outline-yellow-white font-bold m-10 w-fit"
				onClick={handleStatsPage}
			>
				Classement
			</div>
		</div>
	);
};
