import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, EmptyState } from "@/components/app/app-shell";

export const Route = createFileRoute("/_authenticated/crm/team")({
  component: TeamPage,
});

const RESOURCES = ["clients", "orders", "products", "invoices", "files", "settings"] as const;
const LEVELS = ["none", "read", "write"] as const;

function TeamPage() {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const [roles, profiles, perms] = await Promise.all([
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("profiles").select("id, full_name, email"),
        supabase.from("staff_permissions").select("user_id, resource, level"),
      ]);
      return {
        roles: roles.data ?? [],
        profiles: profiles.data ?? [],
        perms: perms.data ?? [],
      };
    },
  });

  const setPerm = useMutation({
    mutationFn: async (v: { user_id: string; resource: string; level: string }) => {
      const { error } = await supabase
        .from("staff_permissions")
        .upsert(
          { user_id: v.user_id, resource: v.resource, level: v.level as (typeof LEVELS)[number] },
          { onConflict: "user_id,resource" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Permission updated");
      void qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const staff = (data?.roles ?? []).filter((r) => r.role !== "client");

  return (
    <Card title="Team & access">
      {staff.length === 0 ? (
        <EmptyState text="No staff accounts yet." />
      ) : (
        <div className="space-y-4">
          {staff.map((s) => {
            const profile = data?.profiles.find((p) => p.id === s.user_id);
            return (
              <div key={s.user_id} className="rounded-xl border border-border p-3">
                <div className="font-bold">{profile?.full_name ?? profile?.email ?? s.user_id}</div>
                <div className="text-xs uppercase tracking-wider text-primary">{s.role}</div>
                {s.role === "employee" && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {RESOURCES.map((res) => {
                      const level =
                        data?.perms.find((p) => p.user_id === s.user_id && p.resource === res)
                          ?.level ?? "none";
                      return (
                        <label key={res} className="block">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {res}
                          </span>
                          <select
                            value={level}
                            onChange={(e) =>
                              setPerm.mutate({
                                user_id: s.user_id,
                                resource: res,
                                level: e.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                          >
                            {LEVELS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
