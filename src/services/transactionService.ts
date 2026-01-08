import TransactionModel, {
  ITransaction,
  TransactionType,
} from "@/models/Transaction";

import { FilterQuery } from "mongoose";

// Plain transaction object without Mongoose document properties
export type TransactionObject = {
  _id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  transferType?: string;
};

// Input type for creating/updating transactions
export type TransactionInput = {
  date: Date;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  transferType?: string;
};

export async function createTransaction(
  data: TransactionInput
): Promise<TransactionObject> {
  const doc = await TransactionModel.create(data);
  // Convert to plain object and remove __v
  const { __v, ...rest } = doc.toObject({ versionKey: false });
  return { ...rest, _id: doc._id.toString() };
}

/**
 * Get all transactions with filters and pagination
 * @param filters - filter object for all fields in the model
 * @param options - pagination options { page, limit }
 */
export async function getAllTransactions(
  filters: Partial<Omit<ITransaction, "_id">> = {},
  options: { page?: number; limit?: number } = {}
): Promise<{ data: TransactionObject[]; total: number }> {
  const query: FilterQuery<ITransaction> = {};
  // Add filters for all fields if present
  if (filters.date) query.date = filters.date;
  if (filters.amount) query.amount = filters.amount;
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.description)
    query.description = { $regex: filters.description, $options: "i" };
  if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
  if (filters.receiptNumber) query.receiptNumber = filters.receiptNumber;
  if (filters.transferType) query.transferType = filters.transferType;

  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 20;
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    TransactionModel.find(query).skip(skip).limit(limit).lean(),
    TransactionModel.countDocuments(query),
  ]);

  const data = docs.map((doc: any) => {
    const { __v, _id, ...rest } = doc;
    return { ...rest, _id: _id.toString() };
  });

  return { data, total };
}

// Get transaction by id
export async function getTransactionById(
  id: string
): Promise<TransactionObject | null> {
  if (!id) return null;
  const doc = await TransactionModel.findById(id).lean();
  if (!doc) return null;
  const { __v, _id, ...rest } = doc as any;
  return { ...rest, _id: _id.toString() };
}

// Update transaction by id
export async function updateTransaction(
  id: string,
  data: Partial<TransactionInput>
): Promise<TransactionObject | null> {
  if (!id) return null;
  const doc = await TransactionModel.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();
  if (!doc) return null;
  const { __v, ...rest } = doc as any;
  return { ...rest, _id: rest._id.toString() };
}

// Delete transaction by id
export async function deleteTransaction(
  id: string
): Promise<TransactionObject | null> {
  if (!id) return null;
  // Try to find by _id (MongoDB ObjectId format)
  let doc = await TransactionModel.findByIdAndDelete(id).lean();
  // If not found and id doesn't look like ObjectId, try as string
  if (!doc && id) {
    doc = await TransactionModel.findOneAndDelete({ _id: id }).lean();
  }
  if (!doc) return null;
  const { __v, _id, ...rest } = doc as any;
  return { ...rest, _id: _id.toString() };
}

export { TransactionType };
