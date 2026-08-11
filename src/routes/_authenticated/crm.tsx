import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Boxes,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/app-shell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/crm")({
  component: CrmLayout,
});

const ICON = "h-4 w-4";

function CrmLayout() {
  const { role, loading, can } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role === "client") void navigate({ to: "/portal", replace: true });
  }, [role, loading, navigate]);

  const nav: NavItem[] = [
    { to: "/crm", label: "Dashboard", icon: <LayoutDashboard className={ICON} /> },
    ...(can("clients") ? [{ to: "/crm/clients", label: "Clients", icon: <Users className={ICON} /> }] : []),
    ...(can("orders") ? [{ to: "/crm/orders", label: "Orders", icon: <Boxes className={ICON} /> }] : []),
    ...(can("products")
      ? [{ to: "/crm/products", label: "Products & stock", icon: <Package className={ICON} /> }]
      : []),
    ...(can("invoices")
      ? [{ to: "/crm/invoices", label: "Invoices", icon: <FileText className={ICON} /> }]
      : []),
    ...(can("files") ? [{ to: "/crm/files", label: "Files", icon: <FolderOpen className={ICON} /> }] : []),
    ...(role === "owner"
      ? [{ to: "/crm/team", label: "Team & access", icon: <ShieldCheck className={ICON} /> }]
      : []),
  ];

  return (
    <AppShell title="Shelco CRM" nav={nav}>
      <Outlet />
    </AppShell>
  );
}
