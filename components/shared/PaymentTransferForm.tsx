'use client'

import { createTransfer } from "@/lib/actions/dwolla.actions"
import { createTransaction } from "@/lib/actions/tranaction.action"
import { getBank, getBankByAccountId } from "@/lib/actions/user.action"
import { decryptId } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { BankDropDown } from "./BankDropDown"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"

const transferFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string(),
	//.min(4, 'Transfer note is too short'),
	amount: z.string().min(2, 'Transfer note is too short'),
	senderBank: z.string().min(4, 'Please select a valid bank account'),
	shareableId: z.string().min(8, 'Please select a valid sharable Id'),
})

export const PaymentTransferForm = ({accounts}: PaymentTransferFormProps) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof transferFormSchema>>({
		resolver: zodResolver(transferFormSchema),
		defaultValues: {
			name: '',
			email: '',
			amount: '',
			senderBank: '',
			shareableId: ''
		}
	})

	const submit = async (data: z.infer<typeof transferFormSchema>) => {
		setIsLoading(true)

		try{
			// console.log(data)
			const receiverAccountId = decryptId(data.shareableId)

			const receiverBank = await getBankByAccountId({
				accountId: receiverAccountId
			})

			const senderBank = await getBank({
				documentId: data.senderBank
			})

			const transferParams = {
				sourceFundingSourceUrl: senderBank.fundingSourceUrl,
				destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
				amount: data.amount
			}

			const transfer = await createTransfer(transferParams)

			if(transfer) {
				const transaction = {
					name: data.name,
					amount: data.amount,
					senderId: senderBank.userId.$id,
					senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
				}

				const newTransAction = await createTransaction(transaction)

				if(newTransAction){
					form.reset()
					router.push('/')
				}
			}
		}catch(err){
			console.log('Failed with creating transaction: ', err)
		}

		setIsLoading(false)
	}

	return (
		<Form {...form}>
			<form 
				onSubmit={form.handleSubmit(submit)}
				className="flex flex-col"
			>
				<FormField
					control={form.control}
					name='senderBank'
					render={() => (
						<FormItem className=" border-gray-200 border-t">
							<div className="payment-transfer_form-item pb-6 pt-5">
								<div className="payment-transfer_form-content">
									<FormLabel className="text-14 font-medium text-gray-700">
										Select Source Bank
									</FormLabel>

									<FormDescription className="tetx-12 font-normal text-gray-500">
										Select the bank account you want to transfer funds from
									</FormDescription>
								</div>

								<div className="flex w-full flex-col">
									<FormControl>
										<BankDropDown
											accounts={accounts}
											setValue={form.setValue}
											otherStyles="w-full" 
										/>
									</FormControl>

									<FormMessage className="text-12 text-red-500" />
								</div>
							</div>		
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='name'
					render={(field) => (
						<FormItem className=" border-gray-200 border-t">
							<div className="payment-transfer_form-item pb-6 pt-5">
								<div className="payment-transfer_form-content">
									<FormLabel className="text-14 font-medium text-gray-700">
										Transfer Note (Optional)
									</FormLabel>

									<FormDescription className="text-12 font-normal text-gray-500">
										Please provide any additional information or instructions related to the transfer
									</FormDescription>
								</div>

								<div className="flex w-full flex-col">
									<FormControl>
										<Textarea
											placeholder="Write a short note here"
											className="input-class"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-12 text-red-500" />
								</div>
							</div>		
						</FormItem>
					)}
				/>

				<div className="payment-transfer_form-details">
					<h2 className="text-18 font-semibold text-gray-900">
						Bank account details
					</h2>
					<p className="text-16 font-normal text-gray-600">
						Enter the bank account details of the recipient
					</p>
				</div>

				<FormField
					control={form.control}
					name="email"
					render={({field}) => (
						<FormItem className="border-t border-gray-200">
							<div className="payment-transfer_form-item py-5">
								<FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
									Recipient&apos;s Email Address
								</FormLabel>	

								<div className="flex w-full flex-col">
									<FormControl>
										<Input
											placeholder="email" 
											className="input-class"
											{...field}
										/>
									</FormControl>

									<FormMessage className="text-12 text-red-500" />
								</div>
							</div>	
						</FormItem>
					)} 
				/>

				<FormField
					control={form.control}
					name="shareableId"
					render={({field}) => (
						<FormItem className="border-t border-gray-200">
							<div className="payment-transfer_form-item pb-5 pt-6">
								<FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
									Receiver&apos;s Plaid Sharable Id
								</FormLabel>	

								<div className="flex w-full flex-col">
									<FormControl>
										<Input
											placeholder="Enter the public account number" 
											className="input-class"
											{...field}
										/>
									</FormControl>

									<FormMessage className="text-12 text-red-500" />
								</div>
							</div>	
						</FormItem>
					)} 
				/>

				<FormField
					control={form.control}
					name="amount"
					render={({field}) => (
						<FormItem className="border-t border-gray-200">
							<div className="payment-transfer_form-item py-6">
								<FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
									Amount
								</FormLabel>	

								<div className="flex w-full flex-col">
									<FormControl>
										<Input
											placeholder="amount" 
											className="input-class"
											{...field}
										/>
									</FormControl>

									<FormMessage className="text-12 text-red-500" />
								</div>
							</div>	
						</FormItem>
					)} 
				/>

				<div className="payment-transfer_btn-box">
					<Button
						type='submit'
						className="payment-transfer_btn"
					>
						{isLoading ? (
							<>
								<Loader2
									size={20}
									className="animate-spin" 
								/> &nbsp; Sending...
							</>
						) : (
							'Transfer Funds'
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}