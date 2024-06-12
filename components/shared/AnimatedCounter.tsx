import React from "react";
import CountUp from "react-countup";

type AnimatedCounterProps = {
	amount: number
};

export const AnimatedCounter = ({amount}: AnimatedCounterProps) => {
	return (
		<div className="w-full">
			<CountUp 
				decimal=","
				end={amount}
				prefix="$" 
				duration={2.75}
				decimals={2}
			 />
		</div>
	)
};
