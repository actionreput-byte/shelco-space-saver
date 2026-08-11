import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState } from "@/components/app/app-shell";
import { shortDate } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm/files")({
  component: FilesPage,
});

function FilesPage() {
  const qc = useQueryClient();
  const { can, user } = useAuth();
  const [clientId, setClientId] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-mini"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, company_name").order("company_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("files").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["files"] }),
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!clientId) {
      toast.error("Pick a client first");
      return;
    }
    setBusy(true);
    try {
      const path = `${clientId}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("crm-files").upload(path, file);
      if (up.error) throw up.error;
      const { error } = await supabase.from("files").insert({
        client_id: clientId,
        name: file.name,
        path,
        mime: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
        visible_to_client: true,
      });
      if (error) throw error;
      toast.success("File uploaded");
      void qc.invalidateQueries({ queryKey: ["files"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function download(path: string) {
    const { data, error } = await supabase.storage.from("crm-files").createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("Could not create download link");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  return (
    <Card title="Documents">
      {can("files", "write") && (
        <div className="mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-border bg-muted/40 p-3">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Client
            </span>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg brand-gradient px-4 py-2.5 text-sm font-bold text-primary-foreground">
            <Upload className="h-4 w-4" />
            {busy ? "Uploading…" : "Upload file"}
            <input type="file" className="hidden" onChange={handleUpload} disabled={busy} />
          </label>
        </div>
      )}

      {files.length === 0 ? (
        <EmptyState text="No documents uploaded yet." />
      ) : (
        <ul className="divide-y divide-border">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{f.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {(f.clients as { company_name: string } | null)?.company_name ?? "—"} ·{" "}
                  {shortDate(f.created_at)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void download(f.path)}
                className="rounded-lg border border-border p-2 hover:bg-accent"
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              {can("files", "write") && (
                <button
                  type="button"
                  onClick={() => remove.mutate(f.id)}
                  className="text-xs font-bold text-destructive"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
