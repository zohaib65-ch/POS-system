"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import ProblemCategoryModal, { ProblemCategory } from "@/modals/ProblemCategoryModal";
import { problemCategoryColumns } from "./columns/problemCategoryColumns";
import { ConfirmDeleteModal } from "@/modals/ConfirmDeleteModal";

export function ProblemCategoryManagement() {
  const [categories, setCategories] = useState<ProblemCategory[]>([
    { id: 1, name: "Display Issue" },
    { id: 2, name: "Battery Problem" },
    { id: 3, name: "Overheating" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProblemCategory | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleSave = (cat: ProblemCategory) => {
    if (cat.id) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, name: cat.name } : c)));
    } else {
      setCategories((prev) => [...prev, { id: Date.now(), name: cat.name }]);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (deleteId !== null) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    }
  };

  const columns = problemCategoryColumns((row) => {
    setEditingCategory(row);
    setModalOpen(true);
  }, handleDeleteClick);

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center">
          <CardTitle>Problem Categories</CardTitle>
          <Button onClick={handleAdd} className="max-sm:w-full">
            Add Category
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
      <ProblemCategoryModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingCategory={editingCategory} />
      <ConfirmDeleteModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this problem category? This action cannot be undone."
      />
    </>
  );
}
