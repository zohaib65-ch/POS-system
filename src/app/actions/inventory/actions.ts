"use server";
import { AddItemFormData } from "@/lib/validations/addItemValidation";
import { InventoryFilterOptions } from "@/_components/types";
import {
  createItem as createInventoryItem,
  getItems as getInventoryItems,
  updateItem as updateInventoryItem,
  deleteItem as deleteInventoryItem,
  getInventoryStats as getInventoryStatsService,
} from "@/services/inventoryService";
import { revalidatePath } from "next/cache";

export async function createItem(payload: AddItemFormData) {
  try {
    const item = await createInventoryItem(payload);
    revalidatePath("/inventory");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating item:", error);
    return { success: false, error: "Failed to create item" };
  }
}

export async function getItems(options?: InventoryFilterOptions) {
  try {
    const result = await getInventoryItems(options);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { success: false, error: "Failed to fetch items" };
  }
}

export async function updateItem(
  id: string,
  payload: Partial<AddItemFormData>
) {
  try {
    const item = await updateInventoryItem(id, payload);
    revalidatePath("/inventory");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteItem(id: string) {
  try {
    const success = await deleteInventoryItem(id);
    if (success) {
      revalidatePath("/inventory");
      return { success: true };
    }
    return { success: false, error: "Item not found" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function getInventoryStats() {
  try {
    const stats = await getInventoryStatsService();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
