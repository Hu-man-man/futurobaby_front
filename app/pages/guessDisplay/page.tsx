
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { GuessDisplayComponent } from "../../components/GuessDisplayComponent";

// const GuessDisplayPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Récupération des paramètres de l'URL
//   const user_Id = searchParams.get("user_id");
//   const user_name = searchParams.get("user_name");
//   const rankParam = searchParams.get("rank");

//   const rank = rankParam ? parseInt(rankParam, 10) : null;

//   // Vérification des paramètres
//   if (!user_Id || !user_name || rank === null || isNaN(rank)) {
//     console.error("Paramètres invalides :", { user_Id, user_name, rank });
//     return (
//       <div>
//         Veuillez fournir des paramètres valides dans l'URL 
//         (ex: ?user_Id=26&user_name=John&rank=1).
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col justify-center items-center gap-2 my-3">
//       <div
//         className="custom-button outline-offset-8 font-bold w-fit"
//         onClick={() => router.push("/pages/stats")}
//       >
//         Retour
//       </div>
//       <div className="md:m-0 m-2">
//         <GuessDisplayComponent user_Id={user_Id} user_name={user_name} rank={rank} />
//       </div>
//       <div
//         className="custom-button outline-offset-8 font-bold w-fit"
//         onClick={() => router.push("/pages/stats")}
//       >
//         Retour
//       </div>
//     </div>
//   );
// };

// export default GuessDisplayPage;

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GuessDisplayComponent } from "../../components/GuessDisplayComponent";
import { useEffect, useState, Suspense } from "react";

const GuessDisplayPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mettre à jour l'état pour accepter null | string
  const [params, setParams] = useState<{
    user_Id: string | null;
    user_name: string | null;
    rank: number | null;
  }>({
    user_Id: null,
    user_name: null,
    rank: null,
  });

  // Ne s'exécute que côté client
  useEffect(() => {
    const user_Id = searchParams.get("user_id");
    const user_name = searchParams.get("user_name");
    const rankParam = searchParams.get("rank");
    const rank = rankParam ? parseInt(rankParam, 10) : null;

    // Vérification des paramètres
    if (user_Id && user_name && rank !== null && !isNaN(rank)) {
      setParams({ user_Id, user_name, rank });
    } else {
      console.error("Paramètres invalides :", { user_Id, user_name, rank });
    }
  }, [searchParams]);

  // Si les paramètres ne sont pas encore définis, afficher un message de chargement
  if (!params.user_Id || !params.user_name || params.rank === null) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col justify-center items-center gap-2 my-3">
        <div
          className="custom-button outline-offset-8 font-bold w-fit"
          onClick={() => router.push("/pages/stats")}
        >
          Retour
        </div>
        <div className="md:m-0 m-2">
          <GuessDisplayComponent
            user_Id={params.user_Id}
            user_name={params.user_name}
            rank={params.rank}
          />
        </div>
        <div
          className="custom-button outline-offset-8 font-bold w-fit"
          onClick={() => router.push("/pages/stats")}
        >
          Retour
        </div>
      </div>
    </Suspense>
  );
};

export default GuessDisplayPage;

