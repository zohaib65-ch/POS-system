"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/Invoice";
import { Printer } from "lucide-react";
import InvoiceReport from "./InvoiceReport";

interface ViewInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export default function ViewInvoiceModal({ open, onOpenChange, invoice }: ViewInvoiceModalProps) {
  const handlePrint = () => {
    if (!invoice) return;
    const reportContent = document.getElementById("invoice-report-print")?.innerHTML || "";
    const printWindow = window.open("", "", "width=800,height=600");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice-${invoice.invoiceId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4; margin: 0.5in; }
              body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${reportContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!invoice) return null;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "card":
        return "bg-blue-100 text-blue-800";
      case "mobile":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Invoice Information</h3>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="text-lg font-semibold">{invoice.invoiceId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(invoice.date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Payment</h3>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <Badge className={getPaymentMethodColor(invoice.paymentMethod)}>{invoice.paymentMethod}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{invoice.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{invoice.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="font-mono">৳ {invoice.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
        <div id="invoice-report-print" className="hidden">
          <InvoiceReport invoice={invoice} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
