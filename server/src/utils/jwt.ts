import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type CustomerTokenPayload = {
  type: "customer";
  customerId: number;
};

export type AdminTokenPayload = {
  type: "admin";
  adminId: number;
  role: "SUPER_ADMIN" | "CINEMA_ADMIN";
  cinemaId: number | null;
};

export type TokenPayload = CustomerTokenPayload | AdminTokenPayload;

const ACCESS_TOKEN_TTL = "15m";

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}
