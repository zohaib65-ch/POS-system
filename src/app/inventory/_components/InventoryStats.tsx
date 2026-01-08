import React from "react";
import { InventoryItem } from "@/types/inventory";
import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Layers } from "lucide-react";

interface StatsProps {
  items: InventoryItem[];
}

export const InventoryStats: React.FC<StatsProps> = ({ items }) => {
  const totalItems = items.length;
  const lowStockCount = items.filter((i) => i.quantity <= i.threshold).length;
  const stockValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: <Package className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      label: "Stock Value",
      value: `৳ ${stockValue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      label: "Categories",
      value: 5,
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-row items-center justify-start p-5 text-center hover:shadow-md transition-shadow duration-200">
          <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
          <div className="flex flex-col items-start justify-center">
            <div className="text-sm font-medium text-gray-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-semibold text-gray-900 ">{stat.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};
