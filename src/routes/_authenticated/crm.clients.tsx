import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState, Pill } from "@/components/app/app-shell";
import { CLIENT_STATUS_LABELS, shortDate } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/clients")({
  component: ClientsPage,
});

const STATUSES = ["lead", "active", "dormant", "blocked"] as const;

function ClientsPage() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").insert({
        company_name: draft.company_name,
        contact_name: draft.contact_name || null,
        email: draft.email || null,
        phone: draft.phone || null,
        address: draft.address || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Client added");
      setAdding(false);
      setDraft({ company_name: "", contact_name: "", email: "", phone: "", address: "" });
      void qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("clients")
        .update({ status: status as (typeof STATUSES)[number] })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["clients"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = clients.filter((c) =>
    `${c.company_name} ${c.contact_name ?? ""} ${c.email ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <Card
        title="Clients"
        action={
          can("clients", "write") && (
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg brand-gradient px-3 py-2 text-sm font-bold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> New client
            </button>
          )
        }
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />

        {adding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
            className="mb-4 grid gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:grid-cols-2"
          >
            {(
              [
                ["company_name", "Company name", true],
                ["contact_name", "Contact person", false],
                ["email", "Email", false],
                ["phone", "Phone", false],
                ["address", "Address", false],
              ] as const
            ).map(([key, label, required]) => (
              <label key={key} className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <input
                  required={required}
                  value={draft[key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            ))}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={create.isPending}
                className="rounded-lg brand-gradient px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                Save client
              </button>
            </div>
          </form>
        )}

        {filtered.length === 0 ? (
          <EmptyState text="No clients found." />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{c.company_name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {c.contact_name ?? "—"} · {c.email ?? "no email"} · {c.phone ?? "no phone"}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Added {shortDate(c.created_at)}
                  </div>
                </div>
                {can("clients", "write") ? (
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs font-bold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {CLIENT_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Pill>{CLIENT_STATUS_LABELS[c.status]}</Pill>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
