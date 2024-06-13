import { Header } from "@/components/shared/Header";
import { RightSidebar } from "@/components/shared/RightSidebar";
import { TotalBalanceBox } from "@/components/shared/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

type Props = {};

const Home = async (props: Props) => {
	const loggedIn = await getLoggedInUser()

	// console.log(loggedIn);

	return (
		<section className="home">
			<div className="home-content">
				<header className="home-header">
					<Header
						type='greeting'
						title='Welcome'
						user={loggedIn?.firstName || 'Guest'}
						subtext='Access and manage your account and transactions efficiently'
					/>

					<TotalBalanceBox
						accounts={[]}
						totalBanks={1}
						totalCurrentBalance={1250.35} 
					/>
				</header>

				Recent Transactions
			</div>

			<RightSidebar 
				user={loggedIn}
				transaction={[]}
				banks={[{}, {}]}
			/>
		</section>
	)
};

export default Home;
