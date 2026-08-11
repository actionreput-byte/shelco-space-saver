import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, StatTile } from "@/components/app/app-shell";
import { ORDER_STATUS_LABELS, shortDate, tzs } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/crm/")({
  component: CrmDashboard,
});

function CrmDashboard() {
  const { data } = useQuery({
    queryKey: ["crm-dashboard"],
    queryFn: async () => {
      const [orders, invoices, clients, products, leads] = await Promise.all([
        supabase
          .from("orders")
          .select("id, order_number, status, total, created_at, clients(company_name)")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase.from("invoices").select("id, total, paid_amount, status"),
        supabase.from("clients").select("id, status"),
        supabase.from("products").select("id, name, stock_qty, reorder_level"),
        supabase
          .from("quote_requests")
          .select("id, name, company, service, created_at, handled")
          .eq("handled", false)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);
      return {
        orders: orders.data ?? [],
        invoices: invoices.data ?? [],
        clients: clients.data ?? [],
        products: products.data ?? [],
        leads: leads.data ?? [],
      };
    },
  });

  const openOrders = (data?.orders ?? []).filter(
    (o) => !["closed", "cancelled"].includes(o.status),
  ).length;
  const outstanding = (data?.invoices ?? []).reduce(
    (sum, i) => sum + (Number(i.total) - Number(i.paid_amount)),
    0,
  );
  const lowStock = (data?.products ?? []).filter(
    (p) => Number(p.stock_qty) <= Number(p.reorder_level),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Open orders" value={openOrders} />
        <StatTile label="Outstanding" value={tzs(outstanding)} />
        <StatTile label="Clients" value={data?.clients.length ?? 0} />
        <StatTile label="Low stock items" value={lowStock.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Latest orders">
          {(data?.orders ?? []).length === 0 ? (
            <EmptyState text="No orders yet." />
          ) : (
            <ul className="divide-y divide-border">
              {data?.orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      to="/crm/orders/$orderId"
                      params={{ orderId: o.id }}
                      className="truncate font-bold text-primary"
                    >
                      {o.order_number}
                    </Link>
                    <div className="truncate text-xs text-muted-foreground">
                      {(o.clients as { company_name: string } | null)?.company_name} ·{" "}
                      {ORDER_STATUS_LABELS[o.status]}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-bold">{tzs(o.total)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="New quote requests">
          {(data?.leads ?? []).length === 0 ? (
            <EmptyState text="No new requests." />
          ) : (
            <ul className="divide-y divide-border">
              {data?.leads.map((l) => (
                <li key={l.id} className="py-2.5">
                  <div className="font-bold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.company ?? "—"} · {l.service ?? "General"} · {shortDate(l.created_at)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Low stock alerts">
          {lowStock.length === 0 ? (
            <EmptyState text="Everything is above its reorder level." />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate">{p.name}</span>
                  <span className="font-bold text-destructive">
                    {Number(p.stock_qty)} / {Number(p.reorder_level)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
