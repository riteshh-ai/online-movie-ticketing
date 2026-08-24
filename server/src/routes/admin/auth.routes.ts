import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/index.php (login form + handler, including the
// hardcoded super-admin credential check) and legacy/Admin/logout.php.
// Fix applied here (see migration.md "Auth"): the super-admin is now a real
// AdminUser row (role SUPER_ADMIN, cinemaId null) created by prisma/seed,
// not a literal `if` in source. Not mounted behind requireAdmin — this is
// how an admin session starts.
export const adminAuthRouter = Router();

adminAuthRouter.post("/login", notImplemented("admin login — legacy/Admin/index.php"));
adminAuthRouter.post("/logout", notImplemented("admin logout — legacy/Admin/logout.php"));
