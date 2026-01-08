"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2,  User, Bug } from "lucide-react";

type SettingsTab = "Technicians" | "Problem Category" | "Brands";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const settingsTabs = [
  { id: "Technicians", label: "Technicians Information", icon: User },
  { id: "Brands", label: "Brands Information", icon: Building2 },
  { id: "Problem Category", label: "Problem Category", icon: Bug  },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <Card className="bg-white w-full md:w-64 h-fit shadow-sm rounded-xl">
      <div className="px-4">
        <h2 className="text-base md:text-lg font-semibold px-2 mb-3">Settings</h2>
        <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm font-medium border",
                  "hover:shadow-sm",
                  activeTab === tab.id ? "bg-primary text-primary-foreground shadow-md border-primary" : "bg-white text-foreground border-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </Card>
  );
}
