"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, []);

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

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to Promise Electronics - TV Repair Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Today's Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">৳ 45,320</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Invoices Today
                </dt>
                <dd className="text-lg font-medium text-gray-900">8</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m0 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending Jobs
                </dt>
                <dd className="text-lg font-medium text-gray-900">12</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 -6a4 4 0 110-8 4 4 0 010 8z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Low Stock Items
                </dt>
                <dd className="text-lg font-medium text-gray-900">5</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <a
                href="/pos"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Create Invoice
              </a>
              <a
                href="/inventory"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Manage Inventory
              </a>
              <a
                href="/jobs"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                New Job Ticket
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">
                  Invoice INV-20241023-001 created
                </span>
                <span className="text-gray-400">2 hrs ago</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Stock updated: LED Panel</span>
                <span className="text-gray-400">4 hrs ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Job JT-20241023-001 completed
                </span>
                <span className="text-gray-400">6 hrs ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
