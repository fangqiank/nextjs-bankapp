"use server";

import {Client} from "dwolla-v2";

const getEnviroment = (): "production" | "sandbox" => {
  const enviroment = process.env.DWOLLA_ENV as string;

  switch (enviroment) {
    case "sandbox":
      return "sandbox";

    case "production":
      return "production";

    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnviroment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.log("Failed with creating a dwolla customer");
  }
};

export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.log("Failed with creating a funding source: ", err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const auth = await dwollaClient.post("on-demand-authorizations");

    const authLink = auth.body._links;

    return authLink;
  } catch (err) {
    console.log("Failed with creating an on demand authorization: ", err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const req = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
        amount: {
          currency: "USD",
          value: amount,
        },
      },
    };

    return await dwollaClient
      .post("transfers", req)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.log("Failed with transfer: ", err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();
    console.log(dwollaAuthLinks);

    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.log("Failed with add funding source: ", err);
  }
};
