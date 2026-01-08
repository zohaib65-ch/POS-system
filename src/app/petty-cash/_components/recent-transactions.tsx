"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react";

interface Transaction {
  _id: string;
  id: string;
  date: string;
  type: "income" | "expense" | "transfer";
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="w-6 h-6 text-green-500" />;
      case "expense":
        return <ArrowDownLeft className="w-6 h-6 text-red-500" />;
      case "transfer":
        return <ArrowRightLeft className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
        return "text-red-600";
      case "transfer":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };
  let runningBalance = 27500;
  const balances: { [key: string]: number } = {};

  for (let i = recent.length - 1; i >= 0; i--) {
    const tx = recent[i];
    if (tx.type === "income" || tx.type === "transfer") {
      runningBalance -= tx.amount;
    } else {
      runningBalance -= tx.amount;
    }
    balances[tx.id] = runningBalance;
  }

  return (
    <Card className="p-6 gap-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recent Transactions
      </h2>
      <div className="space-y-4">
        {recent.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                {getIcon(transaction.type)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  • {transaction.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${getColorClass(transaction.type)}`}>
                {transaction.type === "expense" ? "-" : "+"}৳{" "}
                {Math.abs(transaction.amount).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Balance: ৳ {balances[transaction.id]?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
