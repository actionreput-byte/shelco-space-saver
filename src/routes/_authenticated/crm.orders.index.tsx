import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, Pill } from "@/components/app/app-shell";
import { ORDER_STATUS_LABELS, shortDate, tzs } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/orders/")({
  component: OrdersPage,
});

const STATUSES = [
  "quote",
  "confirmed",
  "in_production",
  "installed",
  "closed",
  "cancelled",
] as const;

function OrdersPage() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ client_id: "", title: "", site_address: "" });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-mini"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, company_name").order("company_name");
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("orders").insert({
        client_id: draft.client_id,
        title: draft.title || null,
        site_address: draft.site_address || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order created");
      setAdding(false);
      setDraft({ client_id: "", title: "", site_address: "" });
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const shown = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <Card
      title="Orders"
      action={
        can("orders", "write") && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-2 text-sm font-bold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New order
          </button>
        )
      }
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              filter === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/60"
            }`}
          >
            {s === "all" ? "All" : ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="mb-4 grid gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:grid-cols-3"
        >
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Client
            </span>
            <select
              required
              value={draft.client_id}
              onChange={(e) => setDraft((d) => ({ ...d, client_id: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Title
            </span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Site address
            </span>
            <input
              value={draft.site_address}
              onChange={(e) => setDraft((d) => ({ ...d, site_address: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-lg brand-gradient px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Create order
            </button>
          </div>
        </form>
      )}

      {shown.length === 0 ? (
        <EmptyState text="No orders in this view." />
      ) : (
        <ul className="divide-y divide-border">
          {shown.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  to="/crm/orders/$orderId"
                  params={{ orderId: o.id }}
                  className="font-bold text-primary"
                >
                  {o.order_number}
                </Link>
                <div className="truncate text-xs text-muted-foreground">
                  {(o.clients as { company_name: string } | null)?.company_name} ·{" "}
                  {o.title ?? "Untitled"} · {shortDate(o.created_at)}
                </div>
              </div>
              <Pill>{ORDER_STATUS_LABELS[o.status]}</Pill>
              <div className="font-bold">{tzs(o.total)}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
