import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, Pill } from "@/components/app/app-shell";
import { INVOICE_STATUS_LABELS, shortDate, tzs } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/invoices")({
  component: InvoicesPage,
});

const STATUSES = ["draft", "sent", "partially_paid", "paid", "overdue", "cancelled"] as const;

function InvoicesPage() {
  const qc = useQueryClient();
  const { can } = useAuth();

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("invoices")
        .update({ status: status as (typeof STATUSES)[number] })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["invoices"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card title="Invoices">
      {invoices.length === 0 ? (
        <EmptyState text="No invoices yet. Generate one from an order." />
      ) : (
        <ul className="divide-y divide-border">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold">{inv.invoice_number}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {(inv.clients as { company_name: string } | null)?.company_name} · issued{" "}
                  {shortDate(inv.issue_date)} · paid {tzs(inv.paid_amount)}
                </div>
              </div>
              {can("invoices", "write") ? (
                <select
                  value={inv.status}
                  onChange={(e) => setStatus.mutate({ id: inv.id, status: e.target.value })}
                  className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs font-bold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {INVOICE_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              ) : (
                <Pill>{INVOICE_STATUS_LABELS[inv.status]}</Pill>
              )}
              <div className="font-bold">{tzs(inv.total)}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
