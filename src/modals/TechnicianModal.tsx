"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types
export interface Technician {
  id?: number;
  name: string;
}

interface TechnicianModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tech: Technician) => void;
  editingTechnician: Technician | null;
}

export default function TechnicianModal({ open, onClose, onSave, editingTechnician }: TechnicianModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(editingTechnician?.name || "");
  }, [editingTechnician]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSave({
      id: editingTechnician?.id,
      name,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTechnician ? "Edit Technician" : "Add Technician"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <Input placeholder="Technician Name" value={name} onChange={(e) => setName(e.target.value)} />

          <Button className="w-full" onClick={handleSubmit}>
            {editingTechnician ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
