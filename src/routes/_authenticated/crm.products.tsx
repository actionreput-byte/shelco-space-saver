import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState } from "@/components/app/app-shell";
import { num, tzs } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    sku: "",
    name: "",
    category: "",
    unit: "pcs",
    price: "0",
    stock_qty: "0",
    reorder_level: "0",
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        sku: draft.sku,
        name: draft.name,
        category: draft.category || null,
        unit: draft.unit,
        price: Number(draft.price),
        stock_qty: Number(draft.stock_qty),
        reorder_level: Number(draft.reorder_level),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product added");
      setAdding(false);
      void qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = useMutation({
    mutationFn: async ({ id, delta }: { id: string; delta: number }) => {
      const { error } = await supabase
        .from("stock_movements")
        .insert({ product_id: id, delta, reason: delta > 0 ? "Stock in" : "Stock out" });
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["products"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const writable = can("products", "write");

  return (
    <Card
      title="Products & stock"
      action={
        writable && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-2 text-sm font-bold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        )
      }
    >
      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="mb-4 grid gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:grid-cols-3"
        >
          {(
            [
              ["sku", "SKU"],
              ["name", "Name"],
              ["category", "Category"],
              ["unit", "Unit"],
              ["price", "Price (TZS)"],
              ["stock_qty", "Opening stock"],
              ["reorder_level", "Reorder level"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <input
                required={key === "sku" || key === "name"}
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-lg brand-gradient px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Save product
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <EmptyState text="No products yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2 text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const low = Number(p.stock_qty) <= Number(p.reorder_level);
                return (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="py-2.5">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.sku} · {p.category ?? "uncategorised"}
                      </div>
                    </td>
                    <td className="py-2.5">{tzs(p.price)}</td>
                    <td className={`py-2.5 font-bold ${low ? "text-destructive" : ""}`}>
                      {num(p.stock_qty)} {p.unit}
                    </td>
                    <td className="py-2.5 text-right">
                      {writable && (
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            aria-label="Stock out"
                            onClick={() => move.mutate({ id: p.id, delta: -1 })}
                            className="rounded-md border border-border p-1.5 hover:bg-accent"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Stock in"
                            onClick={() => move.mutate({ id: p.id, delta: 1 })}
                            className="rounded-md border border-border p-1.5 hover:bg-accent"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
