"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import BrandModal, { Brand } from "@/modals/BrandModal";
import { brandColumns } from "./columns/brandColumns";
import { ConfirmDeleteModal } from "@/modals/ConfirmDeleteModal";

export function BrandsInformationForm() {
  const [brands, setBrands] = useState<Brand[]>([
    { id: 1, name: "Samsung" },
    { id: 2, name: "Apple" },
    { id: 3, name: "Xiaomi" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };

  const handleSave = (brand: Brand) => {
    if (brand.id) {
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? { ...b, name: brand.name } : b)));
    } else {
      setBrands((prev) => [...prev, { id: Date.now(), name: brand.name }]);
    }
  };
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (deleteId !== null) {
      setBrands((prev) => prev.filter((b) => b.id !== deleteId));
    }
  };
  const columns = brandColumns((row) => {
    setEditingBrand(row);
    setModalOpen(true);
  }, handleDeleteClick);

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex sm:flex-row flex-col justify-start sm:justify-between items-start sm:items-center">
          <CardTitle>Brands</CardTitle>
          <Button onClick={handleAdd} className="max-sm:w-full">Add Brand</Button>
        </CardHeader>

        <CardContent>
          <DataTable columns={columns} data={brands} />
        </CardContent>
      </Card>
      <BrandModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingBrand={editingBrand} />
      <ConfirmDeleteModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </>
  );
}
