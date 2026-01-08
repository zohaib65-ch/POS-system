export interface UserCredentails {
  email: string;
  password: string;
}
export interface InventoryFilterOptions {
  category?: string;
  brand?: string;
  lowStock?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "quantity" | "createdAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
}
