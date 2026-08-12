import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/shelco-logo.asset.json";

type OAuthDetails = {
  client?: { name?: string | null } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

type OAuthResult = { data?: OAuthDetails | null; error?: { message: string } | null };

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s['authorization_id'] === "string" ? s['authorization_id'] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data ?? null;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center px-4">
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Could not load this authorization request:{" "}
        {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lift">
        <img src={logoAsset.url} alt="Shelco Storage Systems logo" className="h-9 w-auto" />
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <ShieldCheck className="h-3.5 w-3.5" /> Authorize access
        </div>
        <h1 className="mt-3 text-2xl font-extrabold">Connect {clientName} to your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {clientName} will be able to read and act on your Shelco data — orders, invoices,
          documents and enquiries — exactly as you can. You can revoke this at any time.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void decide(false)}
            className="rounded-lg border border-border px-3 py-2.5 text-sm font-bold text-secondary disabled:opacity-60"
          >
            Deny
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void decide(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg brand-gradient px-3 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Approve
          </button>
        </div>
      </div>
    </main>
  );
}
