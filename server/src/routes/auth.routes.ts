import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces the customer login/registration POST handlers embedded in
// legacy/header.php, and the read-only view in legacy/profile.php.
// Fixes to apply here (see migration.md "Auth"): bcrypt password hashing
// instead of plaintext ==, issue JWT in an httpOnly cookie instead of a
// bare $_SESSION flag, real input validation (zod) instead of none.
export const authRouter = Router();

authRouter.post("/register", notImplemented("customer registration — legacy/header.php register POST handler"));
authRouter.post("/login", notImplemented("customer login — legacy/header.php login POST handler"));
authRouter.post("/logout", notImplemented("customer logout — legacy/index.php?action=logout"));
authRouter.get("/me", notImplemented("current customer profile — legacy/profile.php"));
