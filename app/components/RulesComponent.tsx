
import React from "react";

export const RulesComponent = () => {
	return (
		<div className={"w-full max-w-lg mx-auto mt-8 bg-white p-6 rounded-3xl"}>
			<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
				Règles d'Attribution des Points
			</h2>
			<div className="space-y-6 text-gray-700">
				<div>
					<h3 className="font-semibold text-gray-800">Genre :</h3>
					<p className="mt-2 text-sm">2 points si le genre est correct.</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Poids :</h3>
					<p className="mt-2 text-sm">
						3 points si le poids est exactement correct.
						<br />
						1 point si la différence est inférieure ou égale à 0,1 kg.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Taille :</h3>
					<p className="mt-2 text-sm">
						2 points si la taille est exactement correcte.
						<br />
						1 point si la différence est inférieure ou égale à 1 cm.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">Prénoms :</h3>
					<p className="mt-2 text-sm">
						5 points si le prénom est exactement correct.
						<br />
						2 points si le prénom partage au moins 4 lettres en commun.
						<br />
						1 point si le prénom partage au moins 3 lettres en commun.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						Date de naissance :
					</h3>
					<p className="mt-2 text-sm">
						2 points si la date est exactement correcte.
						<br />
						1 point si la différence est de 1 jour.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-gray-800">
						Heure de naissance :
					</h3>
					<p className="mt-2 text-sm">
						5 points si l'heure et les minutes sont exacts.
						<br />
						3 points si seule l'heure est exacte.
						<br />
						1 point si la différence est d'une heure.
					</p>
				</div>
			</div>
		</div>
	);
};
