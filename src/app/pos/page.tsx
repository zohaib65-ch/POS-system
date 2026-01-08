"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/ui/DataTable";
import { toast } from "sonner";
import { Invoice, InvoiceItem } from "@/types/Invoice";
import { invoiceItemColumns } from "@/components/columns/invoiceItemColumns";
import { invoiceColumns } from "@/components/columns/invoiceColumns";
import JobTicketModal from "@/modals/JobTicketModal";
import ItemSelectionModal from "@/modals/ItemSelectionModal";
import ViewInvoiceModal from "@/modals/ViewInvoiceModal";
import DeleteModal from "@/modals/DeleteModal";
import { createInvoiceAction, deleteInvoiceAction, getAllInvoicesAction } from "@/app/actions/invoice/actions";
import type { DateRange } from "react-day-picker";
import DateRangeField from "@/components/ui/DateRangeField";

type SelectedItem = InvoiceItem & { source: "inventory" | "job" };

export default function POSPage() {
  const [invoiceItems, setInvoiceItems] = useState<SelectedItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [historyInvoices, setHistoryInvoices] = useState<Invoice[]>([]);

  const [showHistory, setShowHistory] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showJobTicketModal, setShowJobTicketModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [recentFilterPhone, setRecentFilterPhone] = useState("");
  const [recentFilterCustomer, setRecentFilterCustomer] = useState("");
  const [recentFilterStatus, setRecentFilterStatus] = useState<string | undefined>(undefined);
  const [recentFilterPayment, setRecentFilterPayment] = useState<string | undefined>(undefined);
  const [recentDateRange, setRecentDateRange] = useState<DateRange | undefined>();

  const [historyFilterPhone, setHistoryFilterPhone] = useState("");
  const [historyFilterCustomer, setHistoryFilterCustomer] = useState("");
  const [historyFilterStatus, setHistoryFilterStatus] = useState<string | undefined>(undefined);
  const [historyFilterPayment, setHistoryFilterPayment] = useState<string | undefined>(undefined);
  const [historyDateRange, setHistoryDateRange] = useState<DateRange | undefined>();

  const paymentMethods = [
    { label: "Cash", value: "cash" },
    { label: "Credit Card", value: "card" },
    { label: "Mobile Payment", value: "mobile" },
  ];

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const loadInvoices = async () => {
    const result = await getAllInvoicesAction();
    if (result.success && result.data) {
      setInvoices(result.data);
      setHistoryInvoices(result.data);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoadingInvoices(true);
      await loadInvoices();
      setIsLoadingInvoices(false);
    };
    fetchInvoices();
  }, []);

  const mergeItems = (items: SelectedItem[]) => {
    setInvoiceItems((prev) => {
      const map = new Map<string, SelectedItem>();
      [...prev, ...items].forEach((it) => {
        if (map.has(it.id)) {
          const existing = map.get(it.id)!;
          map.set(it.id, { ...existing, quantity: existing.quantity + it.quantity });
        } else {
          map.set(it.id, { ...it });
        }
      });
      return Array.from(map.values());
    });
  };

  const addInventoryItems = (items: SelectedItem[]) => {
    mergeItems(items);
    toast.success(`${items.length} inventory item(s) added`);
  };

  const addJobTickets = (items: SelectedItem[]) => {
    mergeItems(items);
    toast.success(`${items.length} job ticket(s) added`);
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((i) => i.id !== id));
  };

  const createInvoice = async () => {
    if (!customerName) return toast.error("Customer Name is required");
    if (!customerPhone) return toast.error("Customer Phone is required");
    if (invoiceItems.length === 0) return toast.error("Add items to invoice");

    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const countToday = invoices.filter((i) => new Date(i.date).toISOString().split("T")[0] === today).length;

    const invoiceData = {
      invoiceId: `INV-${today.replace(/-/g, "")}-${String(countToday + 1).padStart(3, "0")}`,
      customer: customerName,
      phone: customerPhone,
      items: invoiceItems.map((item) => ({
        itemId: item.id,
        itemType: item.source,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      status: "Paid",
      date: new Date(today),
    };

    const result = await createInvoiceAction(invoiceData);

    if (result.success) {
      toast.success("Invoice created successfully!");
      await loadInvoices();
      setInvoiceItems([]);
      setCustomerName("");
      setCustomerPhone("");
    } else {
      toast.error(result.error || "Failed to create invoice");
    }

    setIsLoading(false);
  };

  const clearForm = () => {
    setInvoiceItems([]);
    setCustomerName("");
    setCustomerPhone("");
  };

  const filterInvoices = (invoices: Invoice[], customer: string, phone: string, status?: string, payment?: string, dateRange?: DateRange) => {
    let filtered = [...invoices];
    if (customer.trim()) {
      const q = customer.trim().toLowerCase();
      filtered = filtered.filter((i) => (i.customer || "").toLowerCase().includes(q));
    }
    if (phone.trim()) {
      const q = phone.trim().toLowerCase();
      filtered = filtered.filter((i) => (i.phone || "").toLowerCase().includes(q));
    }
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (payment) filtered = filtered.filter((i) => i.paymentMethod === payment);
    if (dateRange?.from || dateRange?.to) {
      const from = dateRange.from ?? new Date("1970-01-01");
      const to = dateRange.to ?? new Date();
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((i) => {
        const invoiceDate = new Date(i.date);
        return invoiceDate >= from && invoiceDate <= to;
      });
    }
    return filtered;
  };

  const applyRecentFilters = async () => {
    setIsRecentLoading(true);
    try {
      const allInvoices = await getAllInvoicesAction();
      const baseInvoices = allInvoices.success && allInvoices.data ? allInvoices.data : [];
      const filtered = filterInvoices(baseInvoices, recentFilterCustomer, recentFilterPhone, recentFilterStatus, recentFilterPayment, recentDateRange);
      setInvoices(filtered);
    } finally {
      setIsRecentLoading(false);
    }
  };

  const resetRecentFilters = async () => {
    setRecentFilterCustomer("");
    setRecentFilterPhone("");
    setRecentFilterStatus(undefined);
    setRecentFilterPayment(undefined);
    setRecentDateRange(undefined);
    await loadInvoices();
  };

  const applyHistoryFilters = async () => {
    setIsHistoryLoading(true);
    try {
      const allInvoices = await getAllInvoicesAction();
      const baseInvoices = allInvoices.success && allInvoices.data ? allInvoices.data : [];
      const filtered = filterInvoices(baseInvoices, historyFilterCustomer, historyFilterPhone, historyFilterStatus, historyFilterPayment, historyDateRange);
      setHistoryInvoices(filtered);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const resetHistoryFilters = async () => {
    setHistoryFilterCustomer("");
    setHistoryFilterPhone("");
    setHistoryFilterStatus(undefined);
    setHistoryFilterPayment(undefined);
    setHistoryDateRange(undefined);
    await loadInvoices();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const confirmDeleteInvoice = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center p-4">
            <Skeleton className="h-7 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-between border-t pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoadingInvoices) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <p className="text-gray-600">Create invoices and process payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 justify-between space-y-6 gap-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 py-2 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">Invoice Details</h2>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <Button onClick={() => setShowItemModal(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                Add from Inventory
              </Button>
              <Button onClick={() => setShowJobTicketModal(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                Link Job Ticket
              </Button>
            </div>
          </div>
          <CardContent className="flex flex-col h-full space-y-4">
            <div className="flex-1">
              <DataTable columns={invoiceItemColumns({ removeItem })} data={invoiceItems.map((item) => ({ ...item, total: item.price * item.quantity }))} emptyMessage="No items added" />
            </div>
            <div className="space-y-2 mt-auto p-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (10%):</span>
                <span className="font-mono">৳ {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-blue-600 text-lg">
                <span>Total:</span>
                <span className="font-mono">৳ {total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4 gap-0">
          <CardHeader>
            <h3 className="text-lg font-semibold">Payment Details</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label>Customer Name</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter customer name" />
              </div>
              <div className="space-y-1">
                <Label>Phone Number</Label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Enter phone number" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Button onClick={createInvoice} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
            <div className="space-y-1">
              <Button onClick={clearForm} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="space-y-4 gap-0">
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
            <div>
              <Label className="text-xs">Customer</Label>
              <Input placeholder="Customer name" value={recentFilterCustomer} onChange={(e) => setRecentFilterCustomer(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={recentFilterStatus} onValueChange={setRecentFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Payment</Label>
              <Select value={recentFilterPayment} onValueChange={setRecentFilterPayment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Date Range</Label>
              <DateRangeField value={recentDateRange} onChange={setRecentDateRange} placeholder="Select date range" />
            </div>
            <div className="flex gap-2 mt-1 lg:mt-6">
              <Button onClick={applyRecentFilters} variant="default" disabled={isRecentLoading}>
                {isRecentLoading ? "Filtering..." : "Apply Filters"}
              </Button>
              <Button onClick={resetRecentFilters} variant="outline" disabled={isRecentLoading}>
                Reset
              </Button>
            </div>
          </div>
          <DataTable columns={invoiceColumns(handleViewInvoice, confirmDeleteInvoice)} data={invoices} />
        </CardContent>
      </Card>

      {showHistory && (
        <Card className="space-y-4 gap-0">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Invoice History</h3>
            <Button onClick={() => setShowHistory(false)}>Hide History</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
              <div>
                <Label className="text-xs">Customer</Label>
                <Input placeholder="Customer name" value={historyFilterCustomer} onChange={(e) => setHistoryFilterCustomer(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={historyFilterStatus} onValueChange={setHistoryFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Payment</Label>
                <Select value={historyFilterPayment} onValueChange={setHistoryFilterPayment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((pm) => (
                      <SelectItem key={pm.value} value={pm.value}>
                        {pm.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Date Range</Label>
                <DateRangeField value={historyDateRange} onChange={setHistoryDateRange} placeholder="Select date range" />
              </div>
              <div className="flex gap-2 mt-1 lg:mt-6">
                <Button onClick={applyHistoryFilters} variant="default" disabled={isHistoryLoading}>
                  {isHistoryLoading ? "Filtering..." : "Apply Filters"}
                </Button>
                <Button onClick={resetHistoryFilters} variant="outline" disabled={isHistoryLoading}>
                  Reset
                </Button>
              </div>
            </div>
            <DataTable columns={invoiceColumns(handleViewInvoice, confirmDeleteInvoice)} data={historyInvoices} />
          </CardContent>
        </Card>
      )}

      {!showHistory && <Button onClick={() => setShowHistory(true)}>Show History</Button>}

      <ItemSelectionModal open={showItemModal} onOpenChange={setShowItemModal} onSelectItems={addInventoryItems} />
      <JobTicketModal open={showJobTicketModal} onOpenChange={setShowJobTicketModal} onSelectTickets={addJobTickets} />
      <ViewInvoiceModal open={showViewModal} onOpenChange={setShowViewModal} invoice={selectedInvoice} />
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={async () => {
          if (!invoiceToDelete) return;
          const result = await deleteInvoiceAction(invoiceToDelete.invoiceId);
          if (result.success) {
            toast.success("Invoice deleted successfully");
            await loadInvoices();
          } else {
            toast.error(result.error || "Failed to delete invoice");
          }
        }}
        title="Delete Invoice?"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </div>
  );
}
