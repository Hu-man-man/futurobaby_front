
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import backendUrl from "@/backendUrl";

// Définir un type pour les classements
type Ranking = {
  user_name: string;
  total_score: number;
  rank: string;
};

const StatsPage = () => {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [userName, setUserName] = useState("");
  const [currentGuess, setCurrentGuess] = useState(null); // Pour stocker la réponse de l'API
  const [rankings, setRankings] = useState<Ranking[]>([]); // Ajouter le type ici

  useEffect(() => {
    if (!token) {
      router.push("/"); // Redirige vers la page d'accueil si non connecté
    } else {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserName(userData.userName || "");
      }

      // Fetch current guess data
      const fetchCurrentGuess = async () => {
        try {
          const response = await fetch(`${backendUrl}/guesses/current`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentGuess(data.guess);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de guess :",
            error
          );
        }
      };

      // Fetch rankings data
      const fetchRankings = async () => {
        try {
          const response = await fetch(`${backendUrl}/babyIsBorn/rankings`, {
            method: "GET",
          });

          if (response.ok) {
            const data = await response.json();
            setRankings(data.rankings); // Type 'Ranking[]' est maintenant appliqué ici
			console.log(rankings);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des classements :",
            error
          );
        }
      };

      fetchCurrentGuess();
      fetchRankings();
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userData");
    router.push("/"); // Redirige vers la page de connexion
  };

  const handleSessionPage = () => {
    if (token) {
      router.push("/pages/session");
    } else {
      handleLogout();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div>
        Règles d'Attribution des Points Genre :<br />
        2 points si le genre est correct.
        <br />
        <br />
        Poids :<br />
        3 points si le poids est exactement correct.
        <br />
        1 point si la différence est inférieure ou égale à 0,1 kg.
        <br />
        <br />
        Taille :<br />
        2 points si la taille est exactement correcte.
        <br />
        1 point si la différence est inférieure ou égale à 1 cm.
        <br />
        <br />
        Prénoms :<br />
        5 points si le prénom est exactement correct.
        <br />
        2 points si le prénom partage au moins 4 lettres en commun.
        <br />
        1 point si le prénom partage au moins 3 lettres en commun.
        <br />
        <br />
        Date de naissance :<br />
        2 points si la date est exactement correcte.
        <br />
        1 point si la différence est de 1 jour.
        <br />
        <br />
        Heure de naissance :<br />
        5 points si l'heure et les minutes sont exacts.
        <br />
        3 points si seule l'heure est exacte.
        <br />1 point si la différence est d'une heure.
      </div>

      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-center mb-4">Classements</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Rang</th>
              <th className="py-2 px-4 border-b">Nom</th>
              <th className="py-2 px-4 border-b">Score Total</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-center">{ranking.rank}</td>
                <td className="py-2 px-4 border-b text-center">{ranking.user_name}</td>
                <td className="py-2 px-4 border-b text-center">{ranking.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="text-slate-500 hover:text-black hover:cursor-pointer mt-2"
        onClick={handleSessionPage}
      >
        Retour
      </div>
      <div
        className="text-slate-500 hover:text-black hover:cursor-pointer mt-2"
        onClick={handleLogout}
      >
        Se déconnecter
      </div>
    </main>
  );
};

export default StatsPage;
