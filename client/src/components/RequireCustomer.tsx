import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireCustomer({ children }: { children: ReactNode }) {
  const { customer, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!customer) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}
