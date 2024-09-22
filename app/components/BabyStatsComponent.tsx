import { useState, useEffect } from "react";
import backendUrl from "@/backendUrl";

interface babyIsBorn {
	gender: string;
	weight: number;
	size: number;
	name: string;
	birthdate: Date;
}

const BabyStatsComponent = () => {
	const [babyIsBorn, setbabyIsBorn] = useState<babyIsBorn | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Fonction pour récupérer les données du bébé depuis l'API Express
	const fetchbabyIsBorn = async () => {
		try {
			const response = await fetch(`${backendUrl}/babyIsBorn`);
			const data = await response.json();
			setbabyIsBorn(data);
			setLoading(false);
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des informations du bébé :",
				error
			);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchbabyIsBorn();
	}, []);

	if (loading) {
		return <div>Chargement des informations du bébé...</div>;
	}

	if (!babyIsBorn) {
		return <div>Erreur lors du chargement des données.</div>;
	}

    // Formatage de la date et de l'heure
  const birthDate = new Date(babyIsBorn.birthdate);
  const formattedDate = birthDate.toLocaleDateString(); // Formatage de la date
  const formattedTime = birthDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formatage de l'heure


	return (
		<div className="w-full max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
			<div className="sm:flex sm:items-center px-6 py-4">
				<div className="text-center sm:text-left">
                    <div className="flex justify-center">
                        <img
							src="/bébé.jpg"
							alt="bébé"
							className={`max-w-72 mx-10 border-2`}
						/>
                    </div>
					
                    <p className="text-xl leading-tight">Après beaucoup d'efforts, veillez acceuillir une nouvelle âme, celle de la petite {babyIsBorn.name}.</p>
                    <p className="text-xl leading-tight">La maman et le bébé se portent très bien ⭐.</p>
                    <p className="text-xl leading-tight">Cela dit pour ceux qui ont pronostiqués ces dernières infos sont très importantes pour vous alors les voilà :</p>
                    <p className="text-xl leading-tight">{babyIsBorn.name} pèse {babyIsBorn.weight} kg pour {babyIsBorn.size} cm. Et est née le {formattedDate} à {formattedTime}.</p>
				</div>
			</div>
		</div>
	);
};

export default BabyStatsComponent;
