import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/_authenticated/portal")({
  component: () => (
    <AppShell
      title="Client portal"
      nav={[{ to: "/portal", label: "My projects", icon: <LayoutDashboard className="h-4 w-4" /> }]}
    >
      <Outlet />
    </AppShell>
  ),
});
