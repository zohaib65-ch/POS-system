import mongoose, { Document, Schema } from "mongoose";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export interface ITransaction extends Document {
  date: Date;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  transferType?: string;
}

const TransactionSchema = new Schema<ITransaction>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(TransactionType), required: true },
  category: { type: String },
  description: { type: String },
  paymentMethod: { type: String },
  receiptNumber: { type: String },
  transferType: { type: String },
});

const TransactionModel =
  mongoose.models?.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
