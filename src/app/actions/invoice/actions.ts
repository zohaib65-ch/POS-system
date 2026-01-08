"use server";

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByInvoiceId,
  getInvoicesByPhone,
  getInvoicesByDateRange,
  getInvoicesByStatus,
  updateInvoiceStatus,
  deleteInvoice,
  getTotalSales,
  getInvoicesByPaymentMethod,
} from "@/services/invoiceService";

// Create a new invoice action
export async function createInvoiceAction(invoiceData: {
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
}) {
  try {
    const invoice = await createInvoice(invoiceData);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get all invoices action
export async function getAllInvoicesAction() {
  try {
    const invoices = await getAllInvoices();
    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoice by ID action
export async function getInvoiceByIdAction(id: string) {
  try {
    const invoice = await getInvoiceById(id);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoice by invoice ID action
export async function getInvoiceByInvoiceIdAction(invoiceId: string) {
  try {
    const invoice = await getInvoiceByInvoiceId(invoiceId);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoices by customer phone action
export async function getInvoicesByPhoneAction(phone: string) {
  try {
    const invoices = await getInvoicesByPhone(phone);
    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoices by date range action
export async function getInvoicesByDateRangeAction(
  startDate: Date,
  endDate: Date
) {
  try {
    const invoices = await getInvoicesByDateRange(startDate, endDate);
    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoices by status action
export async function getInvoicesByStatusAction(status: string) {
  try {
    const invoices = await getInvoicesByStatus(status);
    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Update invoice status action
export async function updateInvoiceStatusAction(id: string, status: string) {
  try {
    const invoice = await updateInvoiceStatus(id, status);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Delete invoice action
export async function deleteInvoiceAction(id: string) {
  try {
    const invoice = await deleteInvoice(id);
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get total sales action
export async function getTotalSalesAction(startDate: Date, endDate: Date) {
  try {
    const sales = await getTotalSales(startDate, endDate);
    return { success: true, data: sales };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get invoices by payment method action
export async function getInvoicesByPaymentMethodAction(paymentMethod: string) {
  try {
    const invoices = await getInvoicesByPaymentMethod(paymentMethod);
    return { success: true, data: invoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
