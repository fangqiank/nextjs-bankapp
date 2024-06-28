import { Header } from "@/components/shared/Header";
import { RecentTransactions } from "@/components/shared/RecentTransactions";
import { RightSidebar } from "@/components/shared/RightSidebar";
import { TotalBalanceBox } from "@/components/shared/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";
import React from "react";

type Props = {};

const Home = async ({searchParams: {
	id, page
}}: SearchParamProps ) => {
	const loggedIn = await getLoggedInUser()
	// console.log(loggedIn);

	const currentPage = Number(page as string) || 1

	const accounts = await getAccounts({
		userId: loggedIn.$id
	})
	
	if(!accounts)
		return ;

	const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId

	const account = await getAccount({appwriteItemId})

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
						accounts={accounts?.data}
						totalBanks={accounts?.totalBanks}
						totalCurrentBalance={accounts?.totalCurrentBalance} 
					/>
				</header>

				<RecentTransactions
					accounts={accounts?.data} 
					transactions={account?.transactions}
					appwriteItemId={appwriteItemId}
					page={currentPage}
				/>
			</div>

			<RightSidebar 
				user={loggedIn}
				transactions={accounts?.transactions}
				banks={accounts?.data?.slice(0, 2)}
			/>
		</section>
	)
};

export default Home;
