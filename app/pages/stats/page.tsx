
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
        Merci à tous pour votre participation ! <br />
        Un grand bravo aux gagnant de ce petit jeu Elsa qui a cumulé le plus de points et trouvé le prénom ! <br />
        Félicitation aussi aux deuxième Truc et Bidule qui n'étaient pas très loin de gagner.<br />
        Bien joué Tructruc pour aussi avoir trouvé le prénom mais par contre tu t'es bien planté sur le reste.<br />
        Mension honorable à Tructruc pour avoir réussi à ne pas avoir cumulé le moindre point !<br />
      </div>
      <div className="flex flex-col justify-center my-8">
        <h2 className="text-4xl text-center mb-4 font-arista">Classement</h2>
        <table className="max-w-lg bg-white  rounded-lg overflow-hidden border-2 border-black">
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
