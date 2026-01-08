"use client";

import { useState } from "react";
import { SettingsSidebar } from "./_components/settings-sidebar";
import { BrandsInformationForm } from "./_components/brands-information";
import { TechniciansTab } from "./_components/technicians-tab";
import { ProblemCategoryManagement } from "./_components/problem-category";

type SettingsTab = "Brands" | "Problem Category" | "Technicians";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Technicians");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Technicians":
        return <TechniciansTab />;
      case "Brands":
        return <BrandsInformationForm />;
      case "Problem Category":
        return <ProblemCategoryManagement />;

      default:
        return <TechniciansTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="sm:text-3xl text-xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Configure your TV repair shop management system</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 min-w-0">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
