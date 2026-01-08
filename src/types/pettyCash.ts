export interface Transaction {
  id: string;
  _id: string;
  date: string;
  type: "income" | "expense" | "transfer";
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  receiptNumber?: string;
  transferType?: string;
}
