import React from "react";
import { InventoryItem } from "@/types/inventory";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CardProps {
  item: InventoryItem;
  getStockStatus: (quantity: number, threshold: number) => string;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

// Define a category → badge color mapping
const categoryColors: Record<string, string> = {
  panels: "bg-blue-100 text-blue-800",
  boards: "bg-green-100 text-green-800",
  remotes: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

export const InventoryCard: React.FC<CardProps> = ({ item, getStockStatus, onEdit, onDelete }) => {
  const statusClass = getStockStatus(item.quantity, item.threshold);
  const badgeClass = categoryColors[item.category] || categoryColors.default;

  return (
    <Card className={`border ${statusClass} hover:shadow-lg gap-2 transition-shadow duration-200`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <Badge className={`text-xs ${badgeClass} mt-1 sm:mt-0`}>{item.category}</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1 sm:mt-0">
          {item.brand} {item.model}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between sm:flex-row flex-col">
          <span className="text-gray-600">Stock:</span>
          <span className="font-mono font-medium">{item.quantity}</span>
        </div>
        <div className="flex justify-between sm:flex-row flex-col">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-mono font-medium">৳ {item.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between sm:flex-row flex-col">
          <span className="text-gray-600">Value:</span>
          <span className="font-mono font-medium">৳ {(item.quantity * item.price).toLocaleString()}</span>
        </div>
        <div className="flex justify-between sm:flex-row flex-col">
          <span className="text-gray-600">Supplier:</span>
          <span className="font-mono font-medium">{item.supplier}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-1 w-full sm:w-auto text-blue-600 hover:text-blue-800"
          onClick={() => onEdit(item)}
        >
          <Edit size={16} /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-1 w-full sm:w-auto text-red-600 hover:text-red-800"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={16} /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
