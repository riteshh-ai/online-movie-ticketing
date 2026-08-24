import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Client-side route guard — a UX nicety, NOT the real authorization boundary.
 * The server enforces requireAdmin/requireSuperAdmin on every /api/admin/*
 * route regardless of what this component does (see migration.md "Auth" and
 * PROJECT_REFERENCE.md §10.6 on why legacy's sidebar-only hiding wasn't
 * sufficient). */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, ready } = useAuth();
  if (!ready) return null;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
