import type { RequestHandler } from "express";
import { HttpError } from "../middleware/errorHandler.js";

/** Placeholder handler for routes scaffolded but not yet implemented. */
export function notImplemented(note: string): RequestHandler {
  return () => {
    throw new HttpError(501, `Not implemented yet: ${note}`);
  };
}
