"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import TechnicianModal, { Technician } from "@/modals/TechnicianModal";
import { technicianColumns } from "./columns/technicianColumns";
import { ConfirmDeleteModal } from "@/modals/ConfirmDeleteModal";

export function TechniciansTab() {
  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: 1, name: "Ali Ahmad" },
    { id: 2, name: "Usman Khan" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingTechnician(null);
    setModalOpen(true);
  };

  const handleSave = (tech: Technician) => {
    if (tech.id) {
      setTechnicians((prev) => prev.map((t) => (t.id === tech.id ? { ...t, name: tech.name } : t)));
    } else {
      setTechnicians((prev) => [...prev, { id: Date.now(), name: tech.name }]);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      setTechnicians((prev) => prev.filter((t) => t.id !== deleteId));
    }
  };

  const columns = technicianColumns((row) => {
    setEditingTechnician(row);
    setModalOpen(true);
  }, handleDeleteClick);

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center">
          <CardTitle>Technicians</CardTitle>
          <Button onClick={handleAdd} className="max-sm:w-full">
            Add Technician
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={technicians} />
        </CardContent>
      </Card>
      <TechnicianModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingTechnician={editingTechnician} />
      <ConfirmDeleteModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Technician"
        description="Are you sure you want to delete this technician? This action cannot be undone."
      />
    </>
  );
}
