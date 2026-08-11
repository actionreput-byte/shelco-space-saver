import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, Pill, StatTile } from "@/components/app/app-shell";
import { INVOICE_STATUS_LABELS, ORDER_STATUS_LABELS, shortDate, tzs } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/portal/")({
  component: PortalHome,
});

function PortalHome() {
  const { data } = useQuery({
    queryKey: ["portal"],
    queryFn: async () => {
      const [orders, invoices, files] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase
          .from("files")
          .select("*")
          .eq("visible_to_client", true)
          .order("created_at", { ascending: false }),
      ]);
      return {
        orders: orders.data ?? [],
        invoices: invoices.data ?? [],
        files: files.data ?? [],
      };
    },
  });

  const outstanding = (data?.invoices ?? []).reduce(
    (s, i) => s + (Number(i.total) - Number(i.paid_amount)),
    0,
  );

  async function download(path: string) {
    const { data: signed, error } = await supabase.storage
      .from("crm-files")
      .createSignedUrl(path, 60);
    if (error || !signed) {
      toast.error("Could not create download link");
      return;
    }
    window.open(signed.signedUrl, "_blank", "noopener");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile label="Orders" value={data?.orders.length ?? 0} />
        <StatTile label="Invoices" value={data?.invoices.length ?? 0} />
        <StatTile label="Outstanding" value={tzs(outstanding)} />
      </div>

      <Card title="My orders">
        {(data?.orders ?? []).length === 0 ? (
          <EmptyState text="No orders yet. Request a quote from the website and it will appear here." />
        ) : (
          <ul className="divide-y divide-border">
            {data?.orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{o.order_number}</div>
                  <div className="truncate text-xs text-muted-foreground">
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

      <Card title="My invoices">
        {(data?.invoices ?? []).length === 0 ? (
          <EmptyState text="No invoices yet." />
        ) : (
          <ul className="divide-y divide-border">
            {data?.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{i.invoice_number}</div>
                  <div className="text-xs text-muted-foreground">
                    Issued {shortDate(i.issue_date)} · due {shortDate(i.due_date)}
                  </div>
                </div>
                <Pill>{INVOICE_STATUS_LABELS[i.status]}</Pill>
                <div className="font-bold">{tzs(i.total)}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="My documents">
        {(data?.files ?? []).length === 0 ? (
          <EmptyState text="No documents shared with you yet." />
        ) : (
          <ul className="divide-y divide-border">
            {data?.files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{shortDate(f.created_at)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => void download(f.path)}
                  aria-label="Download"
                  className="rounded-lg border border-border p-2 hover:bg-accent"
                >
                  <Download className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
