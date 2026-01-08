"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceItem } from "@/types/Invoice";
import { getItems } from "@/app/actions/inventory/actions";

type SelectableInventory = {
  _id: string;
  name: string;
  brand?: string;
  modelName?: string;
  price: number;
  quantity: number;
};

interface ItemSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItems: (items: Array<InvoiceItem & { source: "inventory" }>) => void;
}

export default function ItemSelectionModal({
  open,
  onOpenChange,
  onSelectItems,
}: ItemSelectionModalProps) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<SelectableInventory[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getItems({ limit: 100 });
        if (res.success && res.data?.items) {
          const mapped: SelectableInventory[] = res.data.items.map(
            (it: any) => ({
              _id: it._id?.toString?.() || it._id,
              name: it.name,
              brand: it.brand,
              modelName: it.modelName || it.model,
              price: it.price,
              quantity: it.quantity,
            })
          );
          setItems(mapped);
        }
      } finally {
        setLoading(false);
      }
    };
    if (open) load();
  }, [open]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.brand || "").toLowerCase().includes(query) ||
        (item.modelName || "").toLowerCase().includes(query)
    );
  }, [search, items]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addSelected = () => {
    const chosen = filteredItems
      .filter((it) => selected[it._id])
      .map<InvoiceItem & { source: "inventory" }>((it) => ({
        id: it._id,
        name: it.name,
        quantity: 1,
        price: it.price,
        source: "inventory",
      }));
    if (chosen.length > 0) {
      onSelectItems(chosen);
      setSelected({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Item</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
          />
        </div>
        <div className="space-y-2 p-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card
                key={item._id}
                className={`py-3 hover:bg-gray-50 ${
                  selected[item._id] ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleSelect(item._id)}
              >
                <CardContent className="flex justify-between items-center gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!selected[item._id]}
                      onCheckedChange={() => toggleSelect(item._id)}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {(item.brand || "").toString()}{" "}
                        {(item.modelName || "").toString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div>৳ {item.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      Stock: {item.quantity}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No items found.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={addSelected}
            disabled={Object.values(selected).every((v) => !v)}
          >
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
