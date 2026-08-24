import { Router } from "express";
import { adminCinemaScope } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/view|edit|deleteseat_reserved.php. Legacy's inverted
// label logic (reserved=0 shown as "Already Booked", non-zero as
// "Available" — PROJECT_REFERENCE.md §5) is NOT carried over: a
// SeatReservation row existing simply means that seat is taken, no boolean
// flag to get backwards.
//
// legacy/Admin/view|edit|deleteseat_details.php has no equivalent router
// here — that legacy table (seat_detail, one comma-separated row per
// booking) is now just Booking.seatNumbers, so editing it is just editing
// the booking via admin/bookings.routes.ts.
export const adminSeatsRouter = Router();

adminSeatsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cinemaId = adminCinemaScope(req);
    const seats = await prisma.seatReservation.findMany({
      where: cinemaId ? { show: { cinemaId } } : {},
      include: { show: { include: { movie: true, cinema: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(
      seats.map((s) => ({
        id: s.id,
        showId: s.showId,
        seatNumber: s.seatNumber,
        movieName: s.show.movie.name,
        cinemaName: s.show.cinema.name,
        customerName: s.customer.fullName,
        createdAt: s.createdAt.toISOString(),
      })),
    );
  }),
);

adminSeatsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const seat = await prisma.seatReservation.findUnique({ where: { id }, include: { show: true } });
    if (!seat) throw new HttpError(404, "Reserved seat not found.");

    const scope = adminCinemaScope(req);
    if (scope && seat.show.cinemaId !== scope) throw new HttpError(403, "You can only manage seats for your own cinema.");

    await prisma.seatReservation.delete({ where: { id } });
    res.status(204).end();
  }),
);
