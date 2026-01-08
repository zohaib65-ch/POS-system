import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  itemId: mongoose.Types.ObjectId;
  itemType: "inventory" | "job";
  name: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  invoiceId: string;
  customer: string;
  phone: string;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "items.itemType",
    },
    itemType: {
      type: String,
      required: true,
      enum: ["inventory", "job"],
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [InvoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice =
  mongoose.models?.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
