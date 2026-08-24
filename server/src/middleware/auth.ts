import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AdminTokenPayload, type CustomerTokenPayload } from "../utils/jwt.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      customer?: CustomerTokenPayload;
      admin?: AdminTokenPayload;
    }
  }
}

function readToken(req: Request): ReturnType<typeof verifyAccessToken> | null {
  const token = req.cookies?.access_token;
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

/** Populates req.customer / req.admin if a valid token cookie is present. Never rejects. */
export function attachPrincipal(req: Request, _res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (payload?.type === "customer") req.customer = payload;
  if (payload?.type === "admin") req.admin = payload;
  next();
}

export function requireCustomer(req: Request, res: Response, next: NextFunction) {
  if (!req.customer) return res.status(401).json({ error: "Login required." });
  next();
}

/** Any admin — super-admin or cinema-scoped. Legacy only ever checked this much,
 * per-page and inconsistently (PROJECT_REFERENCE.md §10.6). Here it's centralized
 * on every /api/admin/* route via routes/admin/index.ts, closing that gap. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.admin) return res.status(401).json({ error: "Admin login required." });
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.admin || req.admin.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Super-admin access required." });
  }
  next();
}

/** Cinema scoping helper for admin handlers: null for a super-admin (no filter),
 * or the specific cinemaId a cinema-scoped admin is restricted to. Use this
 * instead of trusting the client for every cinema-scoped query. */
export function adminCinemaScope(req: Request): number | null {
  if (!req.admin) return null;
  return req.admin.role === "SUPER_ADMIN" ? null : req.admin.cinemaId;
}
