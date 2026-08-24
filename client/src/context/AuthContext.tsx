import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AdminAuth, Auth } from "../api";

// Replaces legacy's two separate $_SESSION-based flags (customer session in
// header.php, admin session in Admin/index.php). Both are hydrated once on
// load from GET /api/auth/me and GET /api/admin/auth/me — the actual
// session lives server-side in the httpOnly JWT cookie, not here.
export type Customer = { id: number; fullName: string; email: string };
export type Admin = { id: number; role: "SUPER_ADMIN" | "CINEMA_ADMIN"; cinemaId: number | null };

type AuthState = {
  customer: Customer | null;
  admin: Admin | null;
  ready: boolean;
  setCustomer: (c: Customer | null) => void;
  setAdmin: (a: Admin | null) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([Auth.me(), AdminAuth.me()]).then(([customerRes, adminRes]) => {
      if (customerRes.status === "fulfilled") setCustomer(customerRes.value);
      if (adminRes.status === "fulfilled") setAdmin(adminRes.value);
      setReady(true);
    });
  }, []);

  return <AuthContext.Provider value={{ customer, admin, ready, setCustomer, setAdmin }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
