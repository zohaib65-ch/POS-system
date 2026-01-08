import InventoryItem, { IInventoryItem } from "@/models/Inventory";
import dbConnect from "@/_components/db";
import { AddItemFormData } from "@/lib/validations/addItemValidation";
import { InventoryFilterOptions, InventoryStats } from "@/_components/types";

/**
 * Create a new inventory item
 */
export async function createItem(itemData: AddItemFormData): Promise<any> {
  await dbConnect();

  const newItem = new InventoryItem({
    ...itemData,
    modelName: itemData.model, // Map model to modelName
  });

  const savedItem = await newItem.save();
  return savedItem.toJSON();
}

/**
 * Get all inventory items with optional filtering and pagination
 */
export async function getItems(options: InventoryFilterOptions = {}): Promise<{
  items: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  await dbConnect();

  const {
    category,
    brand,
    lowStock,
    search,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    limit = 50,
    page = 1,
  } = options;

  // Build query
  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = { $regex: brand, $options: "i" };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { modelName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  // Get total count for pagination
  const totalCount = await InventoryItem.countDocuments(query);

  // Build sort object
  const sort: any = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute query with pagination
  let itemsQuery = InventoryItem.find(query)
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);

  // Apply low stock filter after initial query if needed
  let items = await itemsQuery.exec();

  if (lowStock) {
    items = items.filter((item) => item.quantity <= item.threshold);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return {
    items: items.map((item) => item.toJSON()),
    totalCount,
    currentPage: page,
    totalPages,
  };
}

/**
 * Get a single inventory item by ID
 */
export async function getItemById(id: string): Promise<any | null> {
  await dbConnect();
  const item = await InventoryItem.findById(id);
  return item ? item.toJSON() : null;
}

/**
 * Update an inventory item
 */
export async function updateItem(
  id: string,
  updateData: Partial<AddItemFormData>
): Promise<any | null> {
  await dbConnect();

  const updatePayload = { ...updateData };
  if (updateData.model) {
    (updatePayload as any).modelName = updateData.model;
    delete updatePayload.model;
  }

  const item = await InventoryItem.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  return item ? item.toJSON() : null;
}

/**
 * Delete an inventory item
 */
export async function deleteItem(id: string): Promise<boolean> {
  await dbConnect();
  const result = await InventoryItem.findByIdAndDelete(id);
  return result !== null;
}

/**
 * Update item quantity (for stock management)
 */
export async function updateQuantity(
  id: string,
  newQuantity: number
): Promise<any | null> {
  await dbConnect();
  const item = await InventoryItem.findByIdAndUpdate(
    id,
    { quantity: newQuantity },
    { new: true, runValidators: true }
  );
  return item ? item.toJSON() : null;
}

/**
 * Increase item quantity (for restocking)
 */
export async function increaseQuantity(
  id: string,
  amount: number
): Promise<any | null> {
  await dbConnect();
  const item = await InventoryItem.findByIdAndUpdate(
    id,
    { $inc: { quantity: amount } },
    { new: true, runValidators: true }
  );
  return item ? item.toJSON() : null;
}

/**
 * Decrease item quantity (for sales/usage)
 */
export async function decreaseQuantity(
  id: string,
  amount: number
): Promise<any | null> {
  await dbConnect();

  const item = await InventoryItem.findById(id);
  if (!item) return null;

  const newQuantity = Math.max(0, item.quantity - amount);

  const updatedItem = await InventoryItem.findByIdAndUpdate(
    id,
    { quantity: newQuantity },
    { new: true, runValidators: true }
  );

  return updatedItem ? updatedItem.toJSON() : null;
}

/**
 * Get low stock items
 */
export async function getLowStockItems(): Promise<any[]> {
  await dbConnect();
  const items = await InventoryItem.find({});
  const lowStockItems = items.filter((item) => item.quantity <= item.threshold);
  return lowStockItems.map((item) => item.toJSON());
}

/**
 * Get out of stock items
 */
export async function getOutOfStockItems(): Promise<any[]> {
  await dbConnect();
  const items = await InventoryItem.find({ quantity: 0 });
  return items.map((item) => item.toJSON());
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats(): Promise<InventoryStats> {
  await dbConnect();

  const items = await InventoryItem.find({});

  const stats: InventoryStats = {
    totalItems: items.length,
    totalValue: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    lowStockItems: items.filter((item) => item.quantity <= item.threshold)
      .length,
    outOfStockItems: items.filter((item) => item.quantity === 0).length,
    categoryCounts: {},
    brandCounts: {},
  };

  // Calculate category counts
  items.forEach((item) => {
    stats.categoryCounts[item.category] =
      (stats.categoryCounts[item.category] || 0) + 1;
  });

  // Calculate brand counts
  items.forEach((item) => {
    stats.brandCounts[item.brand] = (stats.brandCounts[item.brand] || 0) + 1;
  });

  return stats;
}

/**
 * Search items by text
 */
export async function searchItems(
  searchTerm: string,
  limit: number = 20
): Promise<any[]> {
  await dbConnect();

  const items = await InventoryItem.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { brand: { $regex: searchTerm, $options: "i" } },
      { modelName: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  }).limit(limit);

  return items.map((item) => item.toJSON());
}

/**
 * Get items by category
 */
export async function getItemsByCategory(category: string): Promise<any[]> {
  await dbConnect();
  const items = await InventoryItem.find({ category: category.toLowerCase() });
  return items.map((item) => item.toJSON());
}

/**
 * Get items by brand
 */
export async function getItemsByBrand(brand: string): Promise<any[]> {
  await dbConnect();
  const items = await InventoryItem.find({
    brand: { $regex: brand, $options: "i" },
  });
  return items.map((item) => item.toJSON());
}

/**
 * Get items in price range
 */
export async function getItemsByPriceRange(
  minPrice: number,
  maxPrice: number
): Promise<any[]> {
  await dbConnect();
  const items = await InventoryItem.find({
    price: { $gte: minPrice, $lte: maxPrice },
  });
  return items.map((item) => item.toJSON());
}

/**
 * Bulk update items
 */
export async function bulkUpdateItems(
  updates: Array<{ id: string; data: Partial<AddItemFormData> }>
): Promise<boolean> {
  await dbConnect();

  try {
    const bulkOps = updates.map(({ id, data }) => {
      const updateData = { ...data };
      if (data.model) {
        (updateData as any).modelName = data.model;
        delete updateData.model;
      }

      return {
        updateOne: {
          filter: { _id: id },
          update: updateData,
        },
      };
    });

    await InventoryItem.bulkWrite(bulkOps);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Bulk delete items
 */
export async function bulkDeleteItems(ids: string[]): Promise<boolean> {
  await dbConnect();

  try {
    await InventoryItem.deleteMany({ _id: { $in: ids } });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get distinct values for a field (useful for filters)
 */
export async function getDistinctValues(
  field: keyof IInventoryItem
): Promise<string[]> {
  await dbConnect();
  return await InventoryItem.distinct(field);
}

/**
 * Check if item exists by name and model
 */
export async function itemExists(
  name: string,
  modelName: string
): Promise<boolean> {
  await dbConnect();
  const item = await InventoryItem.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
    modelName: { $regex: `^${modelName}$`, $options: "i" },
  });
  return item !== null;
}

/**
 * Get total inventory value
 */
export async function getTotalInventoryValue(): Promise<number> {
  await dbConnect();

  const result = await InventoryItem.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
      },
    },
  ]);

  return result[0]?.totalValue || 0;
}

// Export all functions as a single service object
export const InventoryService = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  getLowStockItems,
  getOutOfStockItems,
  getInventoryStats,
  searchItems,
  getItemsByCategory,
  getItemsByBrand,
  getItemsByPriceRange,
  bulkUpdateItems,
  bulkDeleteItems,
  getDistinctValues,
  itemExists,
  getTotalInventoryValue,
};
