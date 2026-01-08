"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentTransactions } from "./_components/recent-transactions";
import AddIncomeModal from "@/modals/AddIncomeModal";
import AddExpenseModal from "@/modals/AddExpenseModal";
import TransferModal from "@/modals/TransferModal";
import ViewTransactionModal from "@/modals/ViewTransactionModal";
import { ConfirmDeleteModal } from "@/modals/ConfirmDeleteModal";
import { Transaction } from "@/types/pettyCash";
import { pettyCashColumns } from "./_components/petty-cash-column";
import DateRangeField from "@/components/ui/DateRangeField";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllTransactions,
  deleteTransaction,
} from "@/app/actions/transaction/action";
import { toast } from "sonner";

export default function PettyCash() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Fetch transactions from database with pagination
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await getAllTransactions(
        {},
        { page: currentPage, limit: pageSize }
      );
      if (result.success && result.data) {
        // Map _id to id for frontend compatibility
        const mappedData = result.data.map((tx: any) => ({
          ...tx,
          id: tx._id || tx.id,
        }));
        setTransactions(mappedData as any);
        setTotalItems(result.total || 0);
      } else {
        toast.error(result.error || "Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions on mount and when page changes
  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  // Apply client-side filters
  useEffect(() => {
    let data = [...transactions];

    if (typeFilter !== "all")
      data = data.filter((tx) => tx.type === typeFilter);
    if (categoryFilter !== "all")
      data = data.filter((tx) => tx.category === categoryFilter);
    if (methodFilter !== "all")
      data = data.filter((tx) => tx.paymentMethod === methodFilter);
    if (dateRange?.from)
      data = data.filter((tx) => new Date(tx.date) >= dateRange.from!);
    if (dateRange?.to)
      data = data.filter((tx) => new Date(tx.date) <= dateRange.to!);

    setFilteredTransactions(data);
  }, [transactions, typeFilter, categoryFilter, methodFilter, dateRange]);
  const handleCloseModal = () => {
    setShowIncomeModal(false);
    setShowExpenseModal(false);
    setShowTransferModal(false);
    setEditingTransaction(null);
    // Refresh data after modal closes
    setCurrentPage(1);
    fetchTransactions();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onViewTransaction = (transaction: Transaction) =>
    setViewTransaction(transaction);

  const onEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (transaction.type === "income") setShowIncomeModal(true);
    if (transaction.type === "expense") setShowExpenseModal(true);
    if (transaction.type === "transfer") setShowTransferModal(true);
  };

  const onDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        // Use _id if available, otherwise fall back to id
        const transactionId = transactionToDelete._id || transactionToDelete.id;
        const result = await deleteTransaction(transactionId);
        if (result.success) {
          toast.success("Transaction deleted successfully");
          fetchTransactions();
        } else {
          toast.error(result.error || "Failed to delete transaction");
        }
      } catch (error) {
        toast.error("An error occurred while deleting");
      } finally {
        setTransactionToDelete(null);
        setShowDeleteModal(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Petty Cash Management
          </h1>
          <p className="text-gray-600">Track daily expenses and cash flow</p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {[...new Set(transactions.map((tx) => tx.category))].map(
                    (cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {[...new Set(transactions.map((tx) => tx.paymentMethod))].map(
                    (method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Range</Label>
              <DateRangeField value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Transaction Management
            </h1>
            <div className="flex justify-end gap-2 flex-wrap">
              <Button
                onClick={() => setShowIncomeModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Income
              </Button>
              <Button
                onClick={() => setShowExpenseModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Add Expense
              </Button>
              <Button
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Transfer
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {/* Table Header Skeleton */}
                <div className="flex gap-4 pb-3 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                {/* Table Rows Skeleton */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex gap-4 py-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            ) : (
              <DataTable
                columns={pettyCashColumns(
                  onViewTransaction,
                  onEditTransaction,
                  onDeleteTransaction
                )}
                data={filteredTransactions}
                emptyMessage="No transactions found"
                pagination={{
                  currentPage,
                  totalPages: Math.ceil(totalItems / pageSize),
                  pageSize,
                  totalItems,
                  onPageChange: handlePageChange,
                }}
              />
            )}
          </div>
        </Card>

        <RecentTransactions transactions={filteredTransactions} />
      </main>

      {showIncomeModal && (
        <AddIncomeModal
          onClose={handleCloseModal}
          transaction={
            editingTransaction?.type === "income"
              ? editingTransaction
              : undefined
          }
        />
      )}

      {showExpenseModal && (
        <AddExpenseModal
          onClose={handleCloseModal}
          transaction={
            editingTransaction?.type === "expense"
              ? editingTransaction
              : undefined
          }
        />
      )}

      {showTransferModal && (
        <TransferModal
          onClose={handleCloseModal}
          transaction={
            editingTransaction?.type === "transfer"
              ? editingTransaction
              : undefined
          }
        />
      )}

      {viewTransaction && (
        <ViewTransactionModal
          transaction={viewTransaction}
          onClose={() => setViewTransaction(null)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Transaction"
          description={`Are you sure you want to delete transaction ${transactionToDelete?.id}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
