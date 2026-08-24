import { createContext, useContext, useState, type ReactNode } from "react";

// Replaces legacy's two separate $_SESSION-based flags (customer session in
// header.php, admin session in Admin/index.php). Here both are just "is
// there a logged-in customer/admin" state hydrated from GET /api/auth/me and
// GET /api/admin/auth/me (TODO once those endpoints are implemented) — the
// actual session lives server-side in the httpOnly JWT cookie, not here.
export type Customer = { id: number; fullName: string; email: string };
export type Admin = { id: number; role: "SUPER_ADMIN" | "CINEMA_ADMIN"; cinemaId: number | null };

type AuthState = {
  customer: Customer | null;
  admin: Admin | null;
  setCustomer: (c: Customer | null) => void;
  setAdmin: (a: Admin | null) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  return <AuthContext.Provider value={{ customer, admin, setCustomer, setAdmin }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
