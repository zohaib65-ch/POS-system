import { z } from "zod";

export const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),

  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),

  price: z.coerce.number().min(0.01, "Price must be greater than 0"),

  threshold: z.coerce.number().min(1, "Low stock threshold must be at least 1"),

  supplier: z.string().min(1, "Supplier name is required"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
});

export type AddItemFormData = z.infer<typeof addItemSchema>;
