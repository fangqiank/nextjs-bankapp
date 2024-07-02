"use server";

import {ID, Query} from "node-appwrite";
import {createAdminClient} from "../appwrite";
import {parseStringify} from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    const {database} = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: "online",
        category: "Transfer",
        ...transaction,
      }
    );

    return parseStringify(newTransaction);
  } catch (err) {
    console.log(err);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const {database} = await createAdminClient();

    const sendTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("senderBankId", bankId)]
    );

    const receiveTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("receiverBankId", bankId)]
    );

    const transactions = {
      total: sendTransactions.total + receiveTransactions.total,
      documents: [
        ...sendTransactions.documents,
        ...receiveTransactions.documents,
      ],
    };

    return parseStringify(transactions);
  } catch (err) {
    console.log(err);
  }
};
