import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/shelco-logo.asset.json";

export type NavItem = { to: string; label: string; icon: ReactNode };

export function AppShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg border border-border p-2"
        >
          <Menu className="h-4 w-4" />
        </button>
        <img src={logoAsset.url} alt="Shelco" className="h-7 w-auto" />
        <span className="ml-auto truncate text-sm font-bold">{title}</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-background p-4 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <img src={logoAsset.url} alt="Shelco" className="h-8 w-auto" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {links}
          </aside>
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
          <Link to="/" className="mb-6 block">
            <img src={logoAsset.url} alt="Shelco Storage Systems" className="h-9 w-auto" />
          </Link>
          {links}
          <div className="mt-auto space-y-2 border-t border-border pt-4">
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {role ?? "—"}
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <h1 className="text-2xl font-extrabold">{title}</h1>
          </div>
          {children}
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold lg:hidden"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </main>
      </div>
    </div>
  );
}

export function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-extrabold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">
      {children}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
