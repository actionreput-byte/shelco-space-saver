import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/shelco-logo.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Client Portal & Staff Login | Shelco Storage Systems" },
      {
        name: "description",
        content:
          "Sign in to the Shelco client portal to track orders and invoices, or log in as Shelco staff to manage the CRM.",
      },
      { property: "og:title", content: "Client Portal & Staff Login | Shelco Storage Systems" },
      {
        property: "og:description",
        content: "Track your racking and shelving orders, invoices and documents online.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { mode?: "staff"; next?: string } => ({
    ...(search['mode'] === "staff" ? { mode: "staff" as const } : {}),
    ...(typeof search['next'] === "string" && search['next'].startsWith("/")
      ? { next: search['next'] }
      : {}),
  }),
  component: AuthPage,
});

type Mode = "signin" | "register";
type AccountType = "client" | "staff";

function AuthPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const search = Route.useSearch();
  const [accountType, setAccountType] = useState<AccountType>(
    search.mode === "staff" ? "staff" : "client",
  );
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    company: "",
    phone: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const nextPath = search.next && search.next.startsWith("/") ? search.next : null;

  function goNext() {
    if (nextPath) {
      window.location.href = nextPath;
      return;
    }
    void navigate({ to: "/app" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) throw error;
        await refresh();
        toast.success("Welcome back");
        goNext();
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}${nextPath ?? "/app"}`,
            data: {
              full_name: form.fullName,
              company: form.company,
              phone: form.phone,
              account_type: accountType,
            },
          },
        });
        if (error) throw error;
        await refresh();
        toast.success("Account created");
        goNext();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}${nextPath ?? ""}`,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      await refresh();
      goNext();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between steel-gradient p-10 text-steel-foreground lg:flex">
        <img src={logoAsset.url} alt="Shelco Storage Systems logo" className="h-12 w-auto" />
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Your storage projects,
            <span className="block bg-clip-text text-transparent brand-gradient">
              tracked end to end.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-steel-foreground/80">
            Follow every order from quote to installation, download invoices and
            drawings, and talk to the Shelco team in one place.
          </p>
        </div>
        <p className="text-xs text-steel-foreground/60">
          Changombe, Mwakalinga Road · Dar es Salaam
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lift"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>

          <img
            src={logoAsset.url}
            alt="Shelco Storage Systems logo"
            className="mt-4 h-9 w-auto lg:hidden"
          />

          <h1 className="mt-4 text-2xl font-extrabold">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Clients, staff and management use the same login."
              : "Register as a client to track your orders, or as Shelco staff."}
          </p>

          {mode === "register" && (
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              {(["client", "staff"] as AccountType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAccountType(t)}
                  className={`rounded-md px-3 py-2 text-sm font-bold capitalize transition ${
                    accountType === t
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {t === "client" ? "Client" : "Shelco staff"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === "register" && (
              <>
                <Field label="Full name" value={form.fullName} onChange={set("fullName")} required />
                <Field
                  label={accountType === "client" ? "Company name" : "Job title"}
                  value={form.company}
                  onChange={set("company")}
                />
                <Field label="Phone" value={form.phone} onChange={set("phone")} type="tel" />
              </>
            )}
            <Field label="Email" value={form.email} onChange={set("email")} type="email" required />
            <Field
              label="Password"
              value={form.password}
              onChange={set("password")}
              type="password"
              required
            />

            {mode === "register" && accountType === "staff" && (
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                Staff accounts need an invitation from the owner. The very first
                staff account created becomes the owner account.
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg brand-gradient px-4 py-3 font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-bold transition hover:bg-accent disabled:opacity-60"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already registered?"}{" "}
            <button
              type="button"
              className="font-bold text-primary"
              onClick={() => setMode(mode === "signin" ? "register" : "signin")}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
