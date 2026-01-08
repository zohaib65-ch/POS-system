"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/pettyCash";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { expenseSchema } from "@/lib/validations/pattyCashValidation";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transaction/action";
import { TransactionType } from "@/services/transactionService";

interface ExpenseModalProps {
  onClose: () => void;
  transaction?: Transaction;
}

export default function ExpenseModal({
  onClose,
  transaction,
}: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    date: new Date(),
    amount: "",
    category: "",
    description: "",
    paymentMethod: "",
    receiptNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date ? new Date(transaction.date) : new Date(),
        amount: transaction.amount?.toString() || "",
        category: transaction.category || "",
        description: transaction.description || "",
        paymentMethod: transaction.paymentMethod || "",
        receiptNumber: transaction.receiptNumber || "",
      });
    }
  }, [transaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: "category" | "paymentMethod",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      expenseSchema.parse(formData);

      const payload = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        type: TransactionType.EXPENSE,
        category: formData.category,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        receiptNumber: formData.receiptNumber || undefined,
      };

      let result;
      if (transaction) {
        // Update existing transaction
        result = await updateTransaction(transaction.id, payload);
      } else {
        // Create new transaction
        result = await createTransaction(payload);
      }

      if (result.success) {
        toast.success(
          transaction
            ? "Expense updated successfully!"
            : "Expense added successfully!"
        );
        onClose();
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((error) => {
          if (error.path[0])
            fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors(fieldErrors);
        toast.error(Object.values(fieldErrors)[0] || "Please fix the errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {formData.date
                    ? format(formData.date, "yyyy-MM-dd")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <Label htmlFor="amount">Amount (BDT)</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parts">Parts</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="receiptNumber">
              Receipt/Invoice Number (Optional)
            </Label>
            <Input
              id="receiptNumber"
              name="receiptNumber"
              value={formData.receiptNumber}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : transaction
                ? "Update Expense"
                : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
