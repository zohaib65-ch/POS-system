export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  invoiceId: string;
  customer: string;
  phone: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
}
