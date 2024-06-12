'use server'

import {Client} from 'dwolla-v2'

const getEnviroment = (): 'production' | 'sandbox' => {
	const enviroment = process.env.DWOLLA_ENV as string

	switch (enviroment) {
		case 'sandbox':
			return 'sandbox'

		case 'production':
			return 'production'
			
		default:
			throw new Error('Dwolla environment should either be set to `sandbox` or `production`')
	}
}

const dwollaClient = new Client({
	environment: getEnviroment(),
	key: process.env.DWOLLA_KEY as string,
	secret: process.env.DWOLLA_SECRET as string,
})

export const createDwollaCustomer = async (newCustomer: NewDwollaCustomerParams) => {
	try {
		return await dwollaClient
			.post('customers', newCustomer)
			.then(res => res.headers.get('location'))
	} catch (err) {
		console.log('Failed with creating a dwolla customer');
	}
}