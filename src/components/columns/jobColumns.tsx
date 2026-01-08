import { JobTicket } from "@/types/jobTicket";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, QrCode } from "lucide-react";
import { getStatusColor } from "../common/StatusColor";

const formatStatus = (status: string) =>
  status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const createJobColumns = (onViewJob: (job: JobTicket) => void, onEditJob: (job: JobTicket) => void, onQRCode: (job: JobTicket) => void, onDeleteJob: (job: JobTicket) => void) => [
  {
    key: "jobId",
    label: "Job ID",
    render: (value: string) => <span className="font-mono text-sm font-medium">{value}</span>,
  },
  {
    key: "customerName",
    label: "Customer",
    render: (value: string, row: JobTicket) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-gray-500">{row.phoneNumber}</div>
      </div>
    ),
  },
  {
    key: "brand",
    label: "Device",
    render: (_value: string, row: JobTicket) => (
      <div>
        <div className="font-medium">{row.brand.toUpperCase()}</div>
        {row.tvModel && <div className="text-sm text-gray-500">{row.tvModel}</div>}
        {row.screenSize && <div className="text-xs text-gray-400">{row.screenSize}"</div>}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string, row: JobTicket) => (
      <div className="space-y-1">
        <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(value)}`}>{formatStatus(value)}</Badge>
        {row.isOverdue && <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Overdue</Badge>}
      </div>
    ),
  },
  {
    key: "technician",
    label: "Technician",
    render: (value: any) => <span className="text-sm">{value?.name || "Unassigned"}</span>,
  },
  {
    key: "problemCategory",
    label: "Problem",
    render: (value: string) => <span className="text-sm capitalize">{value.replace(/-/g, " ")}</span>,
  },
  {
    key: "createdAt",
    label: "Created",
    render: (value: Date) => <span className="text-sm">{new Date(value).toLocaleDateString()}</span>,
  },
  {
    key: "_id",
    label: "Actions",
    render: (_value: string, row: JobTicket) => (
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onViewJob(row)}>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEditJob(row)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onQRCode(row)}>
          <QrCode className="w-4 h-4 text-blue-600" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDeleteJob(row)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    ),
  },
];
