import { Transaction } from "@/types/pettyCash";
import { getStatusColor } from "@/components/common/StatusColor";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

export const pettyCashColumns = (
  onViewTransaction: (transaction: Transaction) => void,
  onEditTransaction: (transaction: Transaction) => void,
  onDeleteTransaction: (transaction: Transaction) => void
) => [
  {
    key: "date",
    label: "Date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "type",
    label: "Status",
    render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
    ),
  },
  {
    key: "amount",
    label: "Amount (BDT)",
    render: (value: number, row: Transaction) => (
      <span className={`font-mono font-semibold ${row.type === "income" ? "text-green-600" : row.type === "expense" ? "text-red-600" : "text-blue-600"}`}>
        {row.type === "expense" ? "-" : "+"}৳ {Math.abs(value).toLocaleString()}
      </span>
    ),
  },
  {
    key: "paymentMethod",
    label: "Method",
  },
  {
    key: "receiptNumber",
    label: "Receipt/Invoice",
    render: (value: string) => value || "-",
  },
  {
    key: "id",
    label: "Actions",
    render: (_value: string, row: Transaction) => (
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onViewTransaction(row)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEditTransaction(row)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDeleteTransaction(row)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    ),
  },
];
