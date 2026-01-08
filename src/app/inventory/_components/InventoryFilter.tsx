import { Button } from "@/components/ui/button";
import React from "react";
interface FilterProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  categories: string[];
}
export const InventoryFilter: React.FC<FilterProps> = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search items..."
          />
        </div>
        <div className="flex space-x-2 ml-0 lg:ml-4">
          {["all", ...categories].map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === cat ? " text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
