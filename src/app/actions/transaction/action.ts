"use server";

import { revalidatePath } from "next/cache";
import {
  createTransaction as createTransactionService,
  getAllTransactions as getAllTransactionsService,
  getTransactionById as getTransactionByIdService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
  TransactionType,
  TransactionInput,
} from "@/services/transactionService";
import { ITransaction } from "@/models/Transaction";

type TransactionFilters = Partial<Omit<ITransaction, "_id">>;

export async function createTransaction(payload: TransactionInput) {
  try {
    const transaction = await createTransactionService(payload);
    revalidatePath("/petty-cash");
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function getAllTransactions(filters?: TransactionFilters, options?: { page?: number; limit?: number }) {
  try {
    const result = await getAllTransactionsService(filters, options);
    return { success: true, data: result.data, total: result.total };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

export async function getTransactionById(id: string) {
  try {
    const transaction = await getTransactionByIdService(id);
    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return { success: false, error: "Failed to fetch transaction" };
  }
}

export async function updateTransaction(id: string, payload: Partial<TransactionInput>) {
  try {
    const transaction = await updateTransactionService(id, payload);
    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }
    revalidatePath("/petty-cash");
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const transaction = await deleteTransactionService(id);
    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }
    revalidatePath("/petty-cash");
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}
