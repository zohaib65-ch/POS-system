import connectDB from "@/_components/db";
import Invoice, { IInvoice } from "@/models/Invoice";
import { Types } from "mongoose";

// Helper to convert mongoose document to plain object with string IDs
const toPlainObject = (doc: any) => {
  const obj = doc.toObject();
  return {
    ...obj,
    _id: obj._id.toString(),
    items: obj.items.map((item: any) => ({
      ...item,
      itemId: item.itemId.toString(),
    })),
  };
};

// Create a new invoice
export const createInvoice = async (invoiceData: {
  invoiceId: string;
  customer: string;
  phone: string;
  items: Array<{
    itemId: string;
    itemType: "inventory" | "job";
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  date: Date;
}) => {
  await connectDB();

  const invoice = await Invoice.create({
    ...invoiceData,
    items: invoiceData.items.map((item) => ({
      ...item,
      itemId: new Types.ObjectId(item.itemId),
    })),
  });

  return toPlainObject(invoice);
};

// Get all invoices
export const getAllInvoices = async () => {
  await connectDB();

  const invoices = await Invoice.find().sort({ date: -1 });
  return invoices.map(toPlainObject);
};

// Get invoice by ID
export const getInvoiceById = async (id: string) => {
  await connectDB();

  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return toPlainObject(invoice);
};

// Get invoice by invoice ID
export const getInvoiceByInvoiceId = async (invoiceId: string) => {
  await connectDB();

  const invoice = await Invoice.findOne({ invoiceId });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return toPlainObject(invoice);
};

// Get invoices by customer phone
export const getInvoicesByPhone = async (phone: string) => {
  await connectDB();

  const invoices = await Invoice.find({ phone }).sort({ date: -1 });
  return invoices.map(toPlainObject);
};

// Get invoices by date range
export const getInvoicesByDateRange = async (startDate: Date, endDate: Date) => {
  await connectDB();

  const invoices = await Invoice.find({
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  return invoices.map(toPlainObject);
};

// Get invoices by status
export const getInvoicesByStatus = async (status: string) => {
  await connectDB();

  const invoices = await Invoice.find({ status }).sort({ date: -1 });
  return invoices.map(toPlainObject);
};

// Update invoice status
export const updateInvoiceStatus = async (id: string, status: string) => {
  await connectDB();

  const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return toPlainObject(invoice);
};

// Delete invoice
export const deleteInvoice = async (invoiceId: string) => {
  await connectDB();

  const invoice = await Invoice.findOneAndDelete({ invoiceId });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return toPlainObject(invoice);
};

// Get total sales for a date range
export const getTotalSales = async (startDate: Date, endDate: Date) => {
  await connectDB();

  const result = await Invoice.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        totalInvoices: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { totalSales: 0, totalInvoices: 0 };
};

// Get invoices by payment method
export const getInvoicesByPaymentMethod = async (paymentMethod: string) => {
  await connectDB();

  const invoices = await Invoice.find({ paymentMethod }).sort({ date: -1 });
  return invoices.map(toPlainObject);
};
