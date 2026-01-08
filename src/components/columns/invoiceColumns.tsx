import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export const invoiceColumns = (onView?: (invoice: any) => void, onDelete?: (invoice: any) => void) => [
  { key: "invoiceId", label: "Invoice #" },
  { key: "customer", label: "Customer" },
  { key: "phone", label: "Phone" },
  {
    key: "total",
    label: "Total",
    render: (value: number) => `৳ ${value.toLocaleString()}`,
  },
  {
    key: "paymentMethod",
    label: "Payment",
    render: (value: string) => <span className={`px-2 py-1 rounded-full text-xs ${value.toLowerCase() === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{value}</span>,
  },
  {
    key: "date",
    label: "Date",
    render: (value: Date) => new Date(value).toLocaleDateString(),
  },
  ...(onView || onDelete
    ? [
        {
          key: "actions",
          label: "Actions",
          render: (_: any, row: any) => (
            <div className="flex gap-2">
              {onView && (
                <Button size="sm" variant="outline" onClick={() => onView(row)} className="h-8">
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline" onClick={() => onDelete(row)} className="h-8">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </div>
          ),
        },
      ]
    : []),
];
