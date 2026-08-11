import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "owner" | "employee" | "client";
export type PermLevel = "none" | "read" | "write";
export type Resource =
  | "clients"
  | "orders"
  | "products"
  | "invoices"
  | "files"
  | "settings";

type AuthState = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  permissions: Record<string, PermLevel>;
  clientId: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  can: (resource: Resource, level?: "read" | "write") => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [permissions, setPermissions] = useState<Record<string, PermLevel>>({});
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setRole(null);
      setPermissions({});
      setClientId(null);
      return;
    }
    const [{ data: roles }, { data: perms }, { data: client }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("staff_permissions").select("resource, level").eq("user_id", userId),
      supabase.from("clients").select("id").eq("profile_id", userId).maybeSingle(),
    ]);
    const found = (roles ?? []).map((r) => r.role as AppRole);
    setRole(
      found.includes("owner")
        ? "owner"
        : found.includes("employee")
          ? "employee"
          : found.includes("client")
            ? "client"
            : null,
    );
    setPermissions(
      Object.fromEntries((perms ?? []).map((p) => [p.resource, p.level as PermLevel])),
    );
    setClientId(client?.id ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      if (!newSession) {
        setRole(null);
        setPermissions({});
        setClientId(null);
      }
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      await loadProfileData(data.session?.user.id);
      setLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfileData]);

  useEffect(() => {
    if (!session?.user.id) return;
    void loadProfileData(session.user.id);
  }, [session?.user.id, loadProfileData]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    await loadProfileData(data.session?.user.id);
  }, [loadProfileData]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
    setPermissions({});
    setClientId(null);
  }, []);

  const can = useCallback(
    (resource: Resource, level: "read" | "write" = "read") => {
      if (role === "owner") return true;
      if (role !== "employee") return false;
      const granted = permissions[resource] ?? "none";
      if (level === "read") return granted === "read" || granted === "write";
      return granted === "write";
    },
    [role, permissions],
  );

  const value = useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      session,
      role,
      permissions,
      clientId,
      loading,
      refresh,
      signOut,
      can,
    }),
    [session, role, permissions, clientId, loading, refresh, signOut, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
