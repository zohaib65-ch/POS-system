import { Invoice } from "@/types/Invoice";

export const sampleInvoices: Invoice[] = [
  {
    invoiceId: "INV-20241023-001",
    customer: "John Smith",
    phone: "01711-123456",
    items: [{ id: "1", name: "LED Panel Replacement", quantity: 1, price: 2500 }],
    subtotal: 2500,
    tax: 250,
    total: 2750,
    paymentMethod: "Cash",
    status: "Paid",
    date: "2024-10-23",
  },
  {
    invoiceId: "INV-20241022-002",
    customer: "David Johnson",
    phone: "01717-741852",
    items: [{ id: "2", name: "LED Backlight Strip", quantity: 1, price: 2100 }],
    subtotal: 2100,
    tax: 210,
    total: 2310,
    paymentMethod: "Card",
    status: "Paid",
    date: "2024-10-22",
  },
];
