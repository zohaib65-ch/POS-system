import { z } from "zod";

export const transferSchema = z.object({
  date: z.date({ message: "Date is required" }),
  amount: z.string().nonempty("Amount is required"),
  transferType: z.string().nonempty("Transfer type is required"),
  description: z.string().nonempty("Description is required"),
});

export const expenseSchema = z.object({
  date: z.date({ message: "Date is required" }),
  amount: z.string().nonempty("Amount is required"),
  category: z.string().nonempty("Category is required"),
  description: z.string().nonempty("Description is required"),
  paymentMethod: z.string().nonempty("Payment method is required"),
  receiptNumber: z.string().optional(),
});

export const incomeSchema = z.object({
  date: z.date({ message: "Date is required" }),
  amount: z.string().nonempty("Amount is required"),
  category: z.string().nonempty("Category is required"),
  description: z.string().nonempty("Description is required"),
  paymentMethod: z.string().nonempty("Payment method is required"),
  receiptNumber: z.string().optional(),
});
