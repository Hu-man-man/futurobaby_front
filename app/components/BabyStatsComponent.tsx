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

	const fetchbabyIsBorn = async () => {
		try {
			const response = await fetch(`${backendUrl}/babyIsBorn`);
			const data = await response.json();
			setbabyIsBorn(data);

			// Stocker les données dans le localStorage
			localStorage.setItem("babyIsBorn", JSON.stringify(data));
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
		// Vérifier si les données sont déjà dans le localStorage
		const savedData = localStorage.getItem("babyIsBorn");
		if (savedData) {
			setbabyIsBorn(JSON.parse(savedData));
			setLoading(false);
		} else {
			fetchbabyIsBorn();
		}
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
	const formattedTime = birthDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	}); // Formatage de l'heure

	return (
		<div className="w-full max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-3xl overflow-hidden">
			<div className="sm:flex sm:items-center px-6 py-4">
				<div className="text-center sm:text-left">
					<div className="flex justify-center">
						<img
							src="/marin.jpg"
							alt="buble marin"
							className={`max-w-96 mx-10`}
						/>
					</div>
					<div className="flex justify-center">
						<img
							src="/maringif.gif"
							alt="bébé"
							className={`max-w-72 mx-10 border-2`}
						/>
					</div>

					<p className=" leading-tight text-center my-3">
						Veuillez accueillir une nouvelle âme, celle du petit Marin ! 💛
						<br />
						<br />
						Après ces trois premiers mois de vie ensemble, toute la famille se
						porte très bien.
						<br />
						Ceci dit, pour ceux qui ont pronostiqués voici des informations très
						importantes :<br />
						Marin est un garçon, il pesait 3,500 kg pour 52,5cm et est né le
						26/10/2024 à 18h58.
						<br />
						<br />
						Merci à tous pour votre participation !<br />
						<br />
						Un grands bravo aux deux gagnants :<br />
						Leo & Elsa (qui a trouvé le prénom !)
						<br />
						Vous gagnez un panier garnis qui vous sera remis lors de notre
						prochaine rencontre.
						<br />
						<span className="text-4xl">⛵</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default BabyStatsComponent;
