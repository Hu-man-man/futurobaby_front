import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const GuessFormComponent = () => {
	const [gender, setGender] = useState<string>("");
	const [weight, setWeight] = useState<string>("0");
	const [size, setSize] = useState<string>("0");
	const [names, setNames] = useState<{ girlName: string; boyName: string }[]>(
		Array(5).fill({ girlName: "", boyName: "" })
	);
	const [date, setDate] = useState<string>("2024-10-26");
	const [time, setTime] = useState<string>("12:00");
	const { token } = useAuth();

	useEffect(() => {
		// Fonction pour récupérer les données existantes
		const fetchExistingGuess = async () => {
			try {
				const response = await fetch("http://localhost:3001/guesses/current", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					if (data.guess) {
						// Remplir les champs avec les données existantes
						setGender(data.guess.guessed_gender);
						setWeight(data.guess.guessed_weight.toString());
						setSize(data.guess.guessed_size.toString());
						setNames(data.guess.guessed_names);

						const utcDate = new Date(data.guess.guessed_birthdate);
                        const localDate = utcDate.toISOString().split('T')[0];
                        const localTime = utcDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
                        setDate(localDate);
                        setTime(localTime);

						console.log(data.guess);
					}
				}
			} catch (error) {
				console.error("Erreur lors de la récupération du guess:", error);
			}
		};

		fetchExistingGuess();
	}, [token]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Combiner la date et l'heure en une seule chaîne
        const dateTime = `${date} ${time}:00`;

		const guessData = {
			guessed_gender: gender,
			guessed_weight: parseFloat(weight),
			guessed_size: parseFloat(size),
			guessed_names: names,
			// guessed_birthdate: date,
			guessed_birthdate: dateTime,
		};

		try {
			const response = await fetch("http://localhost:3001/guesses", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(guessData),
			});

			if (!response.ok) {
				throw new Error(`Erreur HTTP: ${response.status}`);
			}

			const data = await response.json();
			alert(
				`Un essai a été envoyé avec succès. ID du guess: ${data.guessed_id}`
			);
		} catch (error) {
			console.error("Erreur lors de l'envoi du guess :", error);
			alert("Erreur lors de l'envoi du guess");
		}
	};

	const handleInputChange = (
		index: number,
		type: "girlName" | "boyName",
		value: string
	) => {
		const newNames = [...names];
		newNames[index] = { ...newNames[index], [type]: value };
		setNames(newNames);
	};

	return (
		<div>
			<h2>Faites vos pronostics</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Genre :
					<input
						type="radio"
						value="boy"
						name="gender"
						checked={gender === "boy"}
						onChange={() => setGender("boy")}
					/>{" "}
					Garçon
					<input
						type="radio"
						value="girl"
						name="gender"
						checked={gender === "girl"}
						onChange={() => setGender("girl")}
					/>{" "}
					Fille
				</label>
				<br />
				<label>
					Poids (en Kg):
					<input
						type="text"
						value={weight}
						onChange={(e) => {
							const value = e.target.value;
							if (/^\d*\.?\d*$/.test(value)) {
								setWeight(value);
							}
						}}
					/>
				</label>
				<br />
				<label>
					Taille (en cm):
					<input
						type="number"
						value={size}
						onChange={(e) => {
							const value = e.target.value;
							if (/^\d*\.?\d*$/.test(value)) {
								setSize(value);
							}
						}}
					/>
				</label>
				<br />
				<label>
					Noms :
					<table>
						<thead>
							<tr>
								<th>Noms de fille</th>
								<th>Noms de garçon</th>
							</tr>
						</thead>
						<tbody>
							{names.map((guess, index) => (
								<tr key={index}>
									<td>
										<input
											type="text"
											value={guess.girlName}
											onChange={(e) =>
												handleInputChange(index, "girlName", e.target.value)
											}
											placeholder="Nom de fille"
										/>
									</td>
									<td>
										<input
											type="text"
											value={guess.boyName}
											onChange={(e) =>
												handleInputChange(index, "boyName", e.target.value)
											}
											placeholder="Nom de garçon"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</label>
				<br />
				<label>
					Date de l'accouchement :
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</label>
				<br />
                <label>
                    Heure de l'accouchement :
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </label>
				<br />
				<input type="submit" value="Enregistrer" className="custom-button" />
			</form>
		</div>
	);
};

export default GuessFormComponent;
