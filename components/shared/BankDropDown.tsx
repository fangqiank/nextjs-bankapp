'use client'

import { formatAmount, formUrlQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "../ui/select"
import Image from "next/image"

export const BankDropDown = ({accounts = [], setValue, otherStyles}: BankDropdownProps) => {
	const searchParams = useSearchParams()
	const rounter = useRouter()
	const [selected, setSelected] = useState(accounts[0])

	const handleChange = (id: string) => {
		const account = accounts.find(x => x.appwriteItemId === id) ?? accounts[0]
		setSelected(account)

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: 'id',
			value: id
		})

		rounter.push(newUrl, {
			scroll: false
		})

		if(setValue){
			setValue('senderBank', id)
		}
	}


	return (
		<Select
			defaultValue={selected.id}
			onValueChange={v =>handleChange(v)}
		>
			<SelectTrigger 
				className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
			>
				<Image
					src='icons/credit-card.svg'
					alt="credit card"
					width={20}
					height={20} 
				/>
				<p className="line-clamp-1 w-full text-left">{selected.name}</p>
			</SelectTrigger>

			<SelectContent
				className={`w-full bg-white md:w-[300px] ${otherStyles}`}
				align="end"
			>
				<SelectGroup>
					<SelectLabel className="py-2 font-normal text-gray-500">
						Select a bank to display
					</SelectLabel>
					{accounts.map((acc: Account) => (
						<SelectItem
							key={acc.id}
							value={acc.appwriteItemId}
							className="cursor-pointer border-t"
						>
							<div className="flex flex-col">
								<p className="text-16 font-medium">{acc.name}</p>
								<p className="text-14 font-medium text-blue-600">
									{formatAmount(acc.currentBalance)}
								</p>
							</div>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}