import React from "react";
import { useRouter } from "next/navigation";

interface CongratComponentProps {
  user_name: string;
  rank: number;
}

export const CongratComponent = ({ user_name, rank }: CongratComponentProps) => {
  const router = useRouter();

  // Fonction pour formater le rang de l'utilisateur
  const formatRank = (rank: number) => {
    if (rank === 1) return "1er";
    if (rank === 2) return "2nd";
    if (rank) return `${rank}ème`;
    return "sans classement";
  };

  const handleStatsPage = () => {
    router.push("/pages/stats");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-2xl font-semibold text-white text-center mt-3 pl-6">
        {user_name} est arrivé.e{" "}
        <span className="font-bold">{formatRank(rank)}</span> ! 🎉
      </div>
    </div>
  );
};
