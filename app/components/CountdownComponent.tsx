"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
	jours: number;
	heures: number;
	minutes: number;
	secondes: number;
}

type CountdownProps = {
	targetDate: string | Date;
};

const CountdownComponent = ({ targetDate }: CountdownProps) => {
	const calculateTimeLeft = (): TimeLeft => {
		const différence = +new Date(targetDate) - +new Date();
		let timeLeft: TimeLeft = {
			jours: Math.floor(différence / (1000 * 60 * 60 * 24)),
			heures: Math.floor((différence / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((différence / 1000 / 60) % 60),
			secondes: Math.floor((différence / 1000) % 60),
		};
		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearTimeout(timer);
	});

	return (
		<div className="text-center p-6 border-b-8 border-black border-dotted pb-10 mb-11">
			<h1 className="text-2xl mb-6 font-arista">
				pronistics sur <br/><span className="text-8xl">Bubulle</span>
			</h1>
            <h3>naissance théorique</h3>
            <div className="flex justify-center space-x-8 pt-1">
				{Object.entries(timeLeft).map(([key, value]) => (
					<div key={key} className="flex flex-col items-center mx-4">
						<span className="text-2xl text-white font-bold rounded-full aspect-square w-12 flex items-center justify-center bg-yellow-400">
							{value}
						</span>
						<span className="text-gray-500">{key}</span>
					</div>
				))}
				{Object.values(timeLeft).every((val) => val === 0) && (
					<span>ça va pas tarder</span>
				)}
			</div>
		</div>
	);
};

export default CountdownComponent;