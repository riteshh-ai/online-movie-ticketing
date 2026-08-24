import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/view|edit|deleteseat_reserved.php. Legacy's inverted
// label logic (reserved=0 shown as "Already Booked", non-zero as
// "Available" — PROJECT_REFERENCE.md §5) is NOT carried over: a
// SeatReservation row existing simply means that seat is taken, no boolean
// flag to get backwards.
//
// legacy/Admin/view|edit|deleteseat_details.php has no equivalent router
// here — that legacy table (seat_detail, one comma-separated row per
// booking) is now just Booking.seatNumbers (see prisma/schema.prisma), so
// editing it is just editing the booking via admin/bookings.routes.ts.
export const adminSeatsRouter = Router();

adminSeatsRouter.get("/", notImplemented("list reserved seats (cinema-scoped) — legacy/Admin/viewseat_reserved.php"));
adminSeatsRouter.delete("/:id", notImplemented("release a reserved seat — legacy/Admin/deleteseat_reserved.php"));
