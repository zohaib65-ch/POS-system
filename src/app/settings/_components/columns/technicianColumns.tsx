import { Button } from "@/components/ui/button";
import { Technician } from "@/modals/TechnicianModal";
import { Pencil, Trash } from "lucide-react";

export const technicianColumns = (onEdit: (tech: Technician) => void, onDelete: (id: number) => void) => [
  {
    key: "name",
    label: "Technician Name",
  },
  {
    key: "actions",
    label: "Actions",
    render: (_value: any, row: Technician) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </Button>
        <Button size="sm" variant="outline" className=" text-red-600 hover:text-red-800" onClick={() => row.id && onDelete(row.id)}>
          <Trash size={16} />
        </Button>
      </div>
    ),
  },
];
