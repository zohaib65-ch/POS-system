import { Button } from "@/components/ui/button";
import { ProblemCategory } from "@/modals/ProblemCategoryModal";
import { Pencil, Trash } from "lucide-react";

export const problemCategoryColumns = (onEdit: (cat: ProblemCategory) => void, onAskDelete: (id: number) => void) => [
  {
    key: "name",
    label: "Category Name",
  },
  {
    key: "actions",
    label: "Actions",
    render: (_value: any, row: ProblemCategory) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
          <Pencil size={16} />
        </Button>

        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-800" onClick={() => row.id && onAskDelete(row.id)}>
          <Trash size={16} />
        </Button>
      </div>
    ),
  },
];
