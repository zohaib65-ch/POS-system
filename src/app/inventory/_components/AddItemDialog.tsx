"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addItemSchema, AddItemFormData } from "@/lib/validations/addItemValidation";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: AddItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddItemFormData>>;
  onSubmit: (data: AddItemFormData) => Promise<void>;
  isEdit?: boolean;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({ open, onOpenChange, formData, setFormData, onSubmit, isEdit = false }) => {
  const [errors, setErrors] = React.useState<Partial<Record<keyof AddItemFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleChange = (field: keyof AddItemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsed = addItemSchema.safeParse(formData);

      if (!parsed.success) {
        const fieldErrors: Partial<Record<keyof AddItemFormData, string>> = {};
        parsed.error.issues.forEach((err) => {
          const fieldName = err.path[0] as keyof AddItemFormData;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the form errors");
        return;
      }

      setErrors({});
      await onSubmit(parsed.data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(isEdit ? "Item updated successfully" : "Item added successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error(isEdit ? "Failed to update item" : "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl!  max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col">
              <Label>Item Name</Label>
              <Input placeholder="e.g. LED Panel" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panels">Panels</SelectItem>
                  <SelectItem value="boards">Boards</SelectItem>
                  <SelectItem value="remotes">Remotes</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Brand</Label>
              <Input value={formData.brand} onChange={(e) => handleChange("brand", e.target.value)} />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Model</Label>
              <Input value={formData.model} onChange={(e) => handleChange("model", e.target.value)} />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            {/* Quantity */}
            <div className="flex flex-col">
              <Label>Quantity</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => handleChange("quantity", Number(e.target.value) || 0)} />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Price (BDT)</Label>
              <Input type="number" value={formData.price} onChange={(e) => handleChange("price", Number(e.target.value) || 0)} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Low Stock Threshold</Label>
              <Input type="number" placeholder="e.g. 5" value={formData.threshold} onChange={(e) => handleChange("threshold", Number(e.target.value) || 0)} />
              {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
            </div>
            <div className="flex flex-col">
              <Label>Supplier</Label>
              <Input placeholder="Supplier Name" value={formData.supplier} onChange={(e) => handleChange("supplier", e.target.value)} />
              {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <Label>Description</Label>
              <textarea
                placeholder="Enter item description..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
