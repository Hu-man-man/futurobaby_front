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
			<h1 className="text-3xl sm:text-4xl mb-6 font-arista">
				pronostics sur <br/><span className="text-8xl sm:text-9xl">Bubulle</span>
			</h1>
            <h3 className="text-sm sm:text-base md:text-lg">naissance théorique</h3>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 md:space-x-8 pt-1">
				{Object.entries(timeLeft).map(([key, value]) => (
					<div key={key} className="flex flex-col items-center mx-2 sm:mx-4">
						<span className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold rounded-full aspect-square w-10 sm:w-12 md:w-14 lg:w-16 flex items-center justify-center bg-yellow-400">
							{value}
						</span>
						<span className="text-xs sm:text-sm md:text-base text-gray-500">{key}</span>
					</div>
				))}
				{Object.values(timeLeft).every((val) => val === 0) && (
					<span className="text-xs sm:text-sm md:text-base">ça va pas tarder</span>
				)}
			</div>
		</div>
	);
};

export default CountdownComponent;

