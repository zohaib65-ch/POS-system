import { Button } from "@/components/ui/button";
import { InvoiceItem } from "@/types/Invoice";

interface InvoiceItemColumnsProps {
  removeItem: (id: string) => void;
}

export const invoiceItemColumns = ({ removeItem }: InvoiceItemColumnsProps) => [
  { key: "name", label: "Description" },
  { key: "quantity", label: "Qty" },
  { key: "price", label: "Unit Price", render: (value: number) => `৳ ${value.toLocaleString()}` },
  { key: "total", label: "Total", render: (_: any, row: InvoiceItem) => `৳ ${(row.price * row.quantity).toLocaleString()}` },
  {
    key: "actions",
    label: "Actions",
    render: (_: any, row: InvoiceItem) => (
      <Button variant="outline" size="sm" onClick={() => removeItem(row.id)}>
        Delete
      </Button>
    ),
  },
];
