"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "./_components/DashboardStats";
import { dashboardItems } from "@/data/dashboardData";
import { useState, useEffect } from "react";
import { getAllJobs } from "../actions/jobs/actions";
import { getItems } from "@/app/actions/inventory/actions";
import type { JobTicket } from "@/types/jobTicket";
import type { IInventoryItem } from "@/models/Inventory";
import { getStatusColor } from "@/components/common/StatusColor";

export default function DashboardPage() {
  const [recentJobs, setRecentJobs] = useState<JobTicket[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<IInventoryItem[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);

  const getStatusIndicator = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-400",
      "in-progress": "bg-blue-500",
      diagnosis: "bg-purple-500",
      "parts-ordered": "bg-orange-500",
      repairing: "bg-indigo-500",
      testing: "bg-cyan-500",
      completed: "bg-green-500",
      delivered: "bg-emerald-500",
      cancelled: "bg-red-500",
    };
    return colors[status.toLowerCase()] || "bg-gray-500";
  };

  const fetchRecentJobs = async () => {
    setLoadingJobs(true);
    try {
      const result = await getAllJobs({}, 1, 6, "createdAt", "desc");
      if (result.success) {
        setRecentJobs(result.jobs as JobTicket[]);
      }
    } catch (error) {
      console.error("Failed to fetch recent jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchLowStockItems = async () => {
    setLoadingStock(true);
    try {
      const res = await getItems();
      if (res.success && res.data?.items) {
        const lowStock = res.data.items.filter((item: IInventoryItem) => item.quantity <= item.threshold).slice(0, 5);
        setLowStockItems(lowStock);
      }
    } catch (error) {
      console.error("Failed to fetch low stock items:", error);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    fetchRecentJobs();
    fetchLowStockItems();
  }, []);

  const JobRowSkeleton = () => (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-3 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  );

  const StockRowSkeleton = () => (
    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
      <div className="space-y-1">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-900 mb-2">Welcome to Promise Electronics</h2>
          <p className="text-xl text-gray-600">Complete TV Repair Shop Management System</p>
        </div>

        <DashboardStats items={dashboardItems} activeJobs={12} completedToday={8} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="gap-0 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job Tickets</h3>
              <a href="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </a>
            </div>
            {loadingJobs ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <JobRowSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.slice(0, 5).map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusIndicator(job.status)} mr-3`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.customerName}</p>
                        <p className="text-xs text-gray-500 font-mono">{job.jobId}</p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                ))}
                {recentJobs.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recent jobs found</p>}
              </div>
            )}
          </Card>

          <Card className="p-4 gap-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
              <a href="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </a>
            </div>

            {loadingStock ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <StockRowSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>}
                {lowStockItems.map((item) => (
                  <div key={item._id as string} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-800">{item.name}</p>
                      <p className="text-xs text-red-600">
                        Stock: {item.quantity} (Threshold: {item.threshold})
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low Stock</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
