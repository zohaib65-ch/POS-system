"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface Brand {
  id?: number;
  name: string;
}

interface BrandModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (brand: Brand) => void;
  editingBrand: Brand | null;
}

export default function BrandModal({ open, onClose, onSave, editingBrand }: BrandModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(editingBrand?.name || "");
  }, [editingBrand]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ id: editingBrand?.id, name });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <Input placeholder="Brand Name" value={name} onChange={(e) => setName(e.target.value)} />

          <Button className="w-full" onClick={handleSubmit}>
            {editingBrand ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
