"use client";

import { Card } from "@/components/ui/card";
import type { Transaction } from "@/types/pettyCash";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

interface StatsDashboardProps {
  transactions: Transaction[];
}

export function StatsDashboard({ transactions }: StatsDashboardProps) {
  const calculateStats = () => {
    const today = new Date();

    let balance = 0;
    let todayIncome = 0;
    let todayExpenses = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const isToday = txDate.getDate() === today.getDate() && txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();

      if (tx.type === "income") {
        balance += tx.amount;
        if (isToday) {
          todayIncome += tx.amount;
        }
      } else if (tx.type === "expense") {
        balance -= tx.amount;
        if (isToday) {
          todayExpenses += tx.amount;
        }
      }
    });

    const netCashFlow = todayIncome - todayExpenses;
    return { balance, todayIncome, todayExpenses, netCashFlow };
  };

  const stats = calculateStats();

  const StatCard = ({ title, amount, Icon, color }: { title: string; amount: number; Icon: any; color: string }) => (
    <Card className="flex flex-row items-center p-5 text-center hover:shadow-md transition-shadow duration-200">
      <div className={`p-3 rounded-full ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col items-start justify-center ml-3">
        <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">{amount.toLocaleString()}</div>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Current Balance" amount={stats.balance} Icon={Wallet} color="bg-green-100 text-green-600" />
      <StatCard title="Today's Income" amount={stats.todayIncome} Icon={ArrowUpCircle} color="bg-blue-100 text-blue-600" />
      <StatCard title="Today's Expenses" amount={stats.todayExpenses} Icon={ArrowDownCircle} color="bg-red-100 text-red-600" />
      <StatCard title="Net Cash Flow" amount={stats.netCashFlow} Icon={Activity} color="bg-purple-100 text-purple-600" />
    </div>
  );
}
