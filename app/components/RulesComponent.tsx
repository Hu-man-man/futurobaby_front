import React from "react";

export const RulesComponent = () => {
	return (
		<div className={"w-full max-w-lg mx-auto mt-8 bg-white p-6 rounded-3xl"}>
			<h2 className="text-3xl font-arista text-center mb-7 text-gray-800">
				Règles d'Attribution des Points
			</h2>
			<div className="space-y-6 text-gray-700">
				<div>
					<h3 className="text-xl font-semibold text-gray-800">Genre :</h3>
					<p className="mt-2 text-sm">
						• 2 points si tu as deviné que ça allait être un{" "}
						<span className="font-bold">Garçon</span>.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Poids :</h3>
					<p className="mt-2 text-sm">
						• 3 points pour le poid exact de{" "}
						<span className="font-bold">3,5 kg</span>.
						<br />
						• 1 point si le poids est compris entre 3,4 kg et 3,6 kg.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Taille :</h3>
					<p className="mt-2 text-sm">
						• 3 points pour la taille exacte de{" "}
						<span className="font-bold">52,5 cm</span>.
						<br />
						• 1 point si la taille est comprise entre 50 cm et 55 cm.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Prénoms :</h3>
					<p className="mt-2 text-sm">
						• 7 points si tu as trouvé le prénom{" "}
						<span className="font-bold">Marin</span>.
						<br />
						• 2 points si un de tes prénom proposé partage au moins 4 lettres
						avec "Marin".
						<br />
						• 1 point un des prénom proposé partage au moins 3 lettres
						avec "Marin".
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						Date de naissance :
					</h3>
					<p className="mt-2 text-sm">
						• 3 points si tu as trouvé la date exacte du{" "}
						<span className="font-bold">26 octobre 2024</span>.
						<br />
						• 1 point si pour les 25 et 27 octobre 2024.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						Heure de naissance :
					</h3>
					<p className="mt-2 text-sm">
						• 5 points si tu as trouvé l'heure (à 2 minutes près) de:{" "}
						<span className="font-bold">18h58</span>.
						<br />
						• 3 points si la différence est d'une heure : entre 17h58 et 19h58.
						<br />
						• 1 point si la différence est comprise entre 60 et 120
						minutes.
					</p>
				</div>
			</div>
		</div>
	);
};
