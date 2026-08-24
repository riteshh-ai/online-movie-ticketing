import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/dashboard.php's stat cards. Booking count stays
// cinema-filtered for scoped admins via adminCinemaScope() (see
// middleware/auth.ts), same restriction legacy applied.
export const adminDashboardRouter = Router();

adminDashboardRouter.get("/stats", notImplemented("dashboard stat cards — legacy/Admin/dashboard.php"));
