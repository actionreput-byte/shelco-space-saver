import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppRedirect,
});

function AppRedirect() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (role === "owner" || role === "employee") void navigate({ to: "/crm", replace: true });
    else void navigate({ to: "/portal", replace: true });
  }, [role, loading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
