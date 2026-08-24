import { Router } from "express";
import { requireCustomer } from "../middleware/auth.js";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces the POST handler in legacy/booking.php. Fixes to apply here (see
// migration.md "Business logic fixes"): total_amount always computed
// server-side from show.ticketPrice (legacy had a hardcoded 250/ticket
// fallback that could drift from the real price); seat insert wrapped in a
// transaction guarded by SeatReservation's unique (showId, seatNumber)
// constraint, so a already-taken seat fails instead of silently double-booking.
export const bookingsRouter = Router();

bookingsRouter.post("/", requireCustomer, notImplemented("create booking — legacy/booking.php POST handler"));
bookingsRouter.get("/me", requireCustomer, notImplemented("current customer's bookings — new, legacy/profile.php didn't list bookings"));
bookingsRouter.get("/:id", requireCustomer, notImplemented("single booking detail"));
