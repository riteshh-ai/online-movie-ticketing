import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deletebooking.php. NOTE: legacy
// addbooking.php has a known bug — its raw INSERT for seat_detail/booking
// omits the id placeholder/column list every other add*.php uses, causing a
// column-count mismatch at runtime (PROJECT_REFERENCE.md §3, §10.7). Moot
// once this uses Prisma's typed create() instead of hand-built SQL, but
// worth knowing why the legacy "add booking from admin" flow was actually
// broken.
export const adminBookingsRouter = Router();

adminBookingsRouter.get("/", notImplemented("list bookings (cinema-scoped) — legacy/Admin/viewbooking.php"));
adminBookingsRouter.post("/", notImplemented("create booking — legacy/Admin/addbooking.php (was buggy, see note above)"));
adminBookingsRouter.put("/:id", notImplemented("update booking — legacy/Admin/editbooking.php"));
adminBookingsRouter.delete("/:id", notImplemented("delete booking (+ free seats) — legacy/Admin/deletebooking.php"));
