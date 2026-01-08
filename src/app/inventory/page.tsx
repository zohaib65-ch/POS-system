"use client";

import { useState, useEffect } from "react";
import type { AddItemFormData } from "@/lib/validations/addItemValidation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Plus } from "lucide-react";
import { InventoryFilter } from "./_components/InventoryFilter";
import { InventoryCard } from "./_components/InventoryCard";
import { InventoryStats } from "./_components/InventoryStats";
import { AddItemDialog } from "./_components/AddItemDialog";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/modals/ConfirmDeleteModal";
import { createItem, getItems, updateItem, deleteItem, getInventoryStats } from "@/app/actions/inventory/actions";
import { IInventoryItem } from "@/models/Inventory";
import type { InventoryStats as StatsType } from "@/_components/types";
import { InventoryItem } from "@/types/inventory";

export default function InventoryPage() {
  const [items, setItems] = useState<IInventoryItem[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AddItemFormData>({
    name: "",
    category: "",
    brand: "",
    model: "",
    quantity: 0,
    price: 0,
    threshold: 5,
    supplier: "",
    description: "",
  });
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const convertToInventoryItem = (item: IInventoryItem): InventoryItem => ({
    id: item._id?.toString() || "",
    name: item.name,
    category: item.category,
    brand: item.brand,
    model: item.modelName,
    quantity: item.quantity,
    price: item.price,
    threshold: item.threshold,
    supplier: item.supplier,
    description: item.description || "",
  });

  const convertedItems = items.map(convertToInventoryItem);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsResult, statsResult] = await Promise.all([getItems(), getInventoryStats()]);

      if (itemsResult.success && itemsResult.data) {
        setItems(itemsResult.data.items);
      } else {
        toast.error("Failed to load inventory items");
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeEl = document.getElementById("current-time");
      if (timeEl) timeEl.textContent = now.toLocaleTimeString();
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories = Array.from(new Set(convertedItems.map((i) => i.category)));

  const filteredItems = convertedItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.brand.toLowerCase().includes(searchTerm.toLowerCase())) && (selectedCategory === "all" || item.category === selectedCategory)
  );

  const getStockStatus = (quantity: number, threshold: number): string => {
    if (quantity <= threshold) return "border border-red-500";
    if (quantity <= threshold * 2) return "border border-yellow-500";
    return "border border-green-500";
  };

  const updateDataSmoothly = async (operation: () => Promise<void>) => {
    await operation();
    const [itemsResult, statsResult] = await Promise.all([getItems(), getInventoryStats()]);

    if (itemsResult.success && itemsResult.data) {
      setItems(itemsResult.data.items);
    }
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
  };
  const handleSubmit = async (data: AddItemFormData) => {
    try {
      if (isEditMode && currentItemId) {
        setAnimatingItems((prev) => new Set(prev).add(currentItemId));
        const result = await updateItem(currentItemId, data);
        if (result.success) {
          toast.success("Item updated successfully");
          await updateDataSmoothly(async () => {});
        } else {
          toast.error(result.error || "Failed to update item");
          return;
        }
        setAnimatingItems((prev) => {
          const s = new Set(prev);
          s.delete(currentItemId);
          return s;
        });
      } else {
        const result = await createItem(data);
        if (result.success) {
          toast.success("Item added successfully");
          await updateDataSmoothly(async () => {});
        } else {
          toast.error(result.error || "Failed to add item");
          return;
        }
      }

      setFormData({
        name: "",
        category: "",
        brand: "",
        model: "",
        quantity: 0,
        price: 0,
        threshold: 5,
        supplier: "",
        description: "",
      });
      setShowModal(false);
      setIsEditMode(false);
      setCurrentItemId(null);
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (item: IInventoryItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand,
      model: item.modelName,
      quantity: item.quantity,
      price: item.price,
      threshold: item.threshold,
      supplier: item.supplier,
      description: item.description || "",
    });
    setIsEditMode(true);
    setCurrentItemId(item._id?.toString() || null);
    setShowModal(true);
  };

  const handleDeleteClick = (guerra: string) => {
    setSelectedItemId(guerra);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItemId) return;
    setAnimatingItems((prev) => new Set(prev).add(selectedItemId));

    try {
      const result = await deleteItem(selectedItemId);
      if (result.success) {
        toast.success("Item deleted successfully");
        setTimeout(async () => {
          await updateDataSmoothly(async () => {});
          setAnimatingItems((prev) => {
            const s = new Set(prev);
            s.delete(selectedItemId);
            return s;
          });
        }, 300);
      } else {
        toast.error(result.error || "Failed to delete item");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setAnimatingItems((prev) => {
        const s = new Set(prev);
        s.delete(selectedItemId);
        return s;
      });
      setSelectedItemId(null);
    }
  };

  const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">Manage TV parts and components stock</p>
          </div>
          <Button
            onClick={() => {
              setShowModal(true);
              setIsEditMode(false);
              setFormData({
                name: "",
                category: "",
                brand: "",
                model: "",
                quantity: 0,
                price: 0,
                threshold: 5,
                supplier: "",
                description: "",
              });
            }}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
        {stats && (
          <div className="transition-all duration-500 ease-in-out">
            <InventoryStats items={convertedItems} />
          </div>
        )}
        <div className="transition-all duration-300 ease-in-out">
          <InventoryFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
        </div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 transition-all duration-500 ease-in-out opacity-100">
            <p className="text-gray-500 text-lg">No items found</p>
            {searchTerm || selectedCategory !== "all" ? (
              <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
            ) : (
              <p className="text-gray-400 mt-2">Start by adding your first inventory item</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 transition-all duration-300 ease-in-out">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-300 ease-in-out transform ${animatingItems.has(item.id) ? "opacity-50 scale-95" : "opacity-100 scale-100 hover:scale-105"}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <InventoryCard
                  item={item}
                  getStockStatus={getStockStatus}
                  onEdit={(item) => {
                    const original = items.find((i) => i._id?.toString() === item.id);
                    if (original) handleEdit(original);
                  }}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <AddItemDialog open={showModal} onOpenChange={setShowModal} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEdit={isEditMode} />
      <ConfirmDeleteModal open={showDeleteModal} onOpenChange={setShowDeleteModal} onConfirm={handleConfirmDelete} />
    </div>
  );
}
