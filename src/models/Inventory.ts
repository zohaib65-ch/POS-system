import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  category: string;
  brand: string;
  modelName: string;
  quantity: number;
  price: number;
  threshold: number;
  supplier: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [200, "Item name cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["panels", "boards", "remotes", "tools"],
      lowercase: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [100, "Brand cannot exceed 100 characters"],
    },
    modelName: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      maxlength: [100, "Model cannot exceed 100 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
    },
    threshold: {
      type: Number,
      required: [true, "Low stock threshold is required"],
      min: [1, "Threshold must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Threshold must be a whole number",
      },
    },
    supplier: {
      type: String,
      required: [true, "Supplier is required"],
      trim: true,
      maxlength: [200, "Supplier name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      minlength: [5, "Description must be at least 5 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toObject: { virtuals: true },
  }
);

// Index for better query performance
InventoryItemSchema.index({ name: 1 });
InventoryItemSchema.index({ category: 1 });
InventoryItemSchema.index({ brand: 1, modelName: 1 });
InventoryItemSchema.index({ quantity: 1, threshold: 1 });

// Virtual for low stock status
InventoryItemSchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.threshold;
});

const InventoryItem =
  mongoose.models?.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
