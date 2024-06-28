import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"
import { transactionCategoryStyles } from "@/constants"

const CategoryBadge = (({category}: CategoryBadgeProps) => {
	const {borderColor, backgroundColor, textColor, chipBackgroundColor} = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

	return (
		<div className={cn(
			'category-badge', borderColor, chipBackgroundColor
		)}>
			<div className={cn(
				'size-2 rounded-full', backgroundColor
			)} />

			<p className={cn(
				'text-[12px] font-medium', textColor
			)}>
				{category}
			</p>
		</div>
	)
})

export const TransactionsTable = ({transactions}: TransactionTableProps) => {
	return (
		<Table>
			<TableHeader className="bg-[#f9fafb]">
				<TableRow>
					<TableHead className="px-2">Transaction</TableHead>
					<TableHead className="px-2">Amount</TableHead>
					<TableHead className="px-2">Status</TableHead>
					<TableHead className="px-2">Date</TableHead>
					<TableHead className="px-2 max-md:hidden">Channel</TableHead>
					<TableHead className="px-2 max-md:hidden">Category</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{transactions.map((tran: Transaction) => {
					const status = getTransactionStatus(new Date(tran.date))
					const amount = formatAmount(tran.amount)

					const isDebit = tran.type === 'debit'
					const isCredit = tran.type === 'credit'

					return (
						<TableRow
							key={tran.id}
							className={`${isDebit || amount[0] === '-' ? 'bg-[#fffbfa]' : 'bg-[#f6fef9]'} !over:bg-none !border-b-DEFAULT`}
						>
							<div className="flex items-center gap-3">
								<h1 className="text-14 truncate font-semibold text-[#344054]">
									{removeSpecialCharacters(tran.name)}
								</h1>
              </div>

							<TableCell className={`pl-2 pr-10 font-semibold ${
                isDebit || amount[0] === '-' 
								? 'text-[#f04438]'
                : 'text-[#039855]'
              }`}>
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

							<TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} /> 
              </TableCell>

							<TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(tran.date)).dateTime}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
               {tran.paymentChannel}
              </TableCell>

              <TableCell className="pl-2 pr-10 max-md:hidden">
               <CategoryBadge category={tran.category} /> 
              </TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}