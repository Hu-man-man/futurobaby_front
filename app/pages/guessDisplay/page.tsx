"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GuessDisplayComponent } from "../../components/GuessDisplayComponent";

const GuessDisplayPage = () => {
  const router = useRouter();
  const [user_Id, setUserId] = useState<string | null>(null);
  const [user_name, setUserName] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  // Lire les paramètres de l'URL côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUserId(params.get("user_id"));
      setUserName(params.get("user_name"));
      const rankParam = params.get("rank");
      setRank(rankParam ? parseInt(rankParam, 10) : null);
    }
  }, []);

  // Vérification des paramètres
  if (!user_Id || !user_name || rank === null || isNaN(rank)) {
    console.error("Paramètres invalides :", { user_Id, user_name, rank });
    return (
      <div>
        Veuillez fournir des paramètres valides dans l'URL 
        (ex: ?user_Id=26&user_name=John&rank=1).
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 my-3">
      <div
        className="custom-button outline-offset-8 font-bold w-fit"
        onClick={() => router.push("/pages/stats")}
      >
        Retour
      </div>
      <div className="md:m-0 m-2">
        <GuessDisplayComponent user_Id={user_Id} user_name={user_name} rank={rank} />
      </div>
      <div
        className="custom-button outline-offset-8 font-bold w-fit"
        onClick={() => router.push("/pages/stats")}
      >
        Retour
      </div>
    </div>
  );
};

export default GuessDisplayPage;

