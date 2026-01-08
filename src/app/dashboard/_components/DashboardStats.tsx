import React from "react";
import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Layers } from "lucide-react";
import { DashboardItem } from "@/types/dashboardItem";

interface DashboardStatsProps {
  items: DashboardItem[];
  activeJobs: number;
  completedToday: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ items, activeJobs, completedToday }) => {
  const totalRevenue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lowStock = items.filter((item) => item.quantity < item.threshold).length;

  const stats = [
    { label: "Total Revenue", value: `৳ ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6 text-green-500" />, bg: "bg-green-50" },
    { label: "Active Jobs", value: activeJobs, icon: <Package className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
    { label: "Completed Today", value: completedToday, icon: <Layers className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
    { label: "Low Stock Items", value: lowStock, icon: <AlertTriangle className="w-6 h-6 text-red-500" />, bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-row items-center justify-start p-5 text-center hover:shadow-md transition-shadow duration-200">
          <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
          <div className="flex flex-col items-start justify-center ml-3">
            <div className="text-sm font-medium text-gray-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};
