"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/pettyCash";
import { format } from "date-fns";

interface ViewTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function ViewTransactionModal({ transaction, onClose }: ViewTransactionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div>
            <Label>ID</Label>
            <p className="text-gray-800">{transaction.id}</p>
          </div>

          <div>
            <Label>Date</Label>
            <p className="text-gray-800">{format(new Date(transaction.date), "yyyy-MM-dd")}</p>
          </div>

          <div>
            <Label>Type</Label>
            <p className="capitalize text-gray-800">{transaction.type}</p>
          </div>

          {transaction.type !== "transfer" && (
            <div>
              <Label>Category</Label>
              <p className="text-gray-800">{transaction.category}</p>
            </div>
          )}

          <div>
            <Label>Description</Label>
            <p className="text-gray-800">{transaction.description}</p>
          </div>

          <div>
            <Label>Amount</Label>
            <p className="text-gray-800">৳ {transaction.amount}</p>
          </div>

          {transaction.type !== "transfer" && (
            <div>
              <Label>Payment Method</Label>
              <p className="text-gray-800">{transaction.paymentMethod}</p>
            </div>
          )}

          {transaction.receiptNumber && (
            <div>
              <Label>Receipt/Invoice</Label>
              <p className="text-gray-800">{transaction.receiptNumber}</p>
            </div>
          )}

          {transaction.type === "transfer" && transaction.transferType && (
            <div>
              <Label>Transfer Type</Label>
              <p className="text-gray-800">{transaction.transferType}</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
