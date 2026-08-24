import type { Response } from "express";
import { env } from "../config/env.js";

const COOKIE_NAME = "access_token";
const MAX_AGE_MS = 15 * 60 * 1000; // matches ACCESS_TOKEN_TTL in utils/jwt.ts

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_MS,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}
