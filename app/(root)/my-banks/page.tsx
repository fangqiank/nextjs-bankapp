import { BankCard } from "@/components/shared/BankCard";
import { HeaderBox } from "@/components/shared/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";

const MyBanksPage = async () => {
	const loggedIn = await getLoggedInUser()

	const accounts = await getAccounts({
		userId: loggedIn.$id
	})

	return (
		<section className="flex">
			<div className="my-banks">
				<HeaderBox 
					title="My Bank Accounts"
          subtext="Manage your banking activites."
				/>

				<div className="space-y-4">
					<h2 className="header-2">Your Cards</h2>
					<div className="flex flex-wrap gap-6">
						{accounts && accounts?.data.map((acc: Account) => (
							<BankCard
								key={acc.id}
								account={acc}
								userName={loggedIn?.firstName} 
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	)
};

export default MyBanksPage;
