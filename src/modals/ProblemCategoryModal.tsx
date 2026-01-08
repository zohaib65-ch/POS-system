"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProblemCategory {
  id?: number;
  name: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (cat: ProblemCategory) => void;
  editingCategory: ProblemCategory | null;
}

export default function ProblemCategoryModal({ open, onClose, onSave, editingCategory }: ModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(editingCategory?.name || "");
  }, [editingCategory]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ id: editingCategory?.id, name });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit Problem Category" : "Add Problem Category"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <Input placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />

          <Button className="w-full" onClick={handleSubmit}>
            {editingCategory ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
