import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, Pill } from "@/components/app/app-shell";
import { ORDER_STATUS_LABELS, shortDate, tzs } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/orders/$orderId")({
  component: OrderDetail,
});

const STATUSES = [
  "quote",
  "confirmed",
  "in_production",
  "installed",
  "closed",
  "cancelled",
] as const;

function OrderDetail() {
  const { orderId } = Route.useParams();
  const qc = useQueryClient();
  const { can } = useAuth();

  const { data } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const [order, items, events] = await Promise.all([
        supabase.from("orders").select("*, clients(company_name, email)").eq("id", orderId).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", orderId).order("created_at"),
        supabase.from("order_events").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
      ]);
      return { order: order.data, items: items.data ?? [], events: events.data ?? [] };
    },
  });

  const setStatus = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as (typeof STATUSES)[number] })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      void qc.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createInvoice = useMutation({
    mutationFn: async () => {
      if (!data?.order) return;
      const subtotal = Number(data.order.total);
      const { error } = await supabase.from("invoices").insert({
        client_id: data.order.client_id,
        order_id: orderId,
        subtotal,
        total: Math.round(subtotal * 1.18),
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Invoice created"),
    onError: (e: Error) => toast.error(e.message),
  });

  const order = data?.order;

  return (
    <div className="space-y-4">
      <Link to="/crm/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      {!order ? (
        <EmptyState text="Order not found." />
      ) : (
        <>
          <Card title={order.order_number}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold">
                  {(order.clients as { company_name: string } | null)?.company_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.title ?? "Untitled"} · {order.site_address ?? "No site address"} ·{" "}
                  {shortDate(order.created_at)}
                </div>
              </div>
              <div className="text-xl font-extrabold text-primary">{tzs(order.total)}</div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {can("orders", "write") ? (
                <select
                  value={order.status}
                  onChange={(e) => setStatus.mutate(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-bold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              ) : (
                <Pill>{ORDER_STATUS_LABELS[order.status]}</Pill>
              )}
              {can("invoices", "write") && (
                <button
                  type="button"
                  onClick={() => createInvoice.mutate()}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-bold hover:bg-accent"
                >
                  Generate invoice
                </button>
              )}
            </div>
          </Card>

          <Card title="Line items">
            {data.items.length === 0 ? (
              <EmptyState text="No line items yet." />
            ) : (
              <ul className="divide-y divide-border text-sm">
                {data.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3 py-2">
                    <span className="min-w-0 truncate">
                      {i.description} × {i.qty}
                    </span>
                    <span className="font-bold">{tzs(Number(i.qty) * Number(i.unit_price))}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Activity">
            {data.events.length === 0 ? (
              <EmptyState text="No activity recorded." />
            ) : (
              <ul className="space-y-2 text-sm">
                {data.events.map((e) => (
                  <li key={e.id} className="flex items-center gap-2">
                    <Pill>{ORDER_STATUS_LABELS[e.status]}</Pill>
                    <span className="text-xs text-muted-foreground">{shortDate(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
