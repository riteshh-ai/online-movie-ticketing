import { allSeatIds } from "@mycinezone/shared";
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { adminCinemaScope } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { bookingInclude, toBookingDto } from "../../utils/dto.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deletebooking.php. NOTE: legacy
// addbooking.php has a known bug — its raw INSERT for seat_detail/booking
// omits the id placeholder/column list every other add*.php uses, causing a
// column-count mismatch at runtime (PROJECT_REFERENCE.md §3, §10.7). Moot
// here since Prisma's typed create() replaces the hand-built SQL.
export const adminBookingsRouter = Router();

async function assertScopedBooking(bookingId: number, scope: number | null) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: bookingInclude });
  if (!booking) throw new HttpError(404, "Booking not found.");
  if (scope && booking.show.cinemaId !== scope) throw new HttpError(403, "You can only manage bookings for your own cinema.");
  return booking;
}

adminBookingsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cinemaId = adminCinemaScope(req);
    const bookings = await prisma.booking.findMany({
      where: cinemaId ? { show: { cinemaId } } : {},
      include: bookingInclude,
      orderBy: { bookingDate: "desc" },
    });
    res.json(bookings.map(toBookingDto));
  }),
);

const createSchema = z.object({
  customerId: z.coerce.number().int(),
  showId: z.coerce.number().int(),
  seatIds: z.array(z.string().min(1)).min(1),
});

adminBookingsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const validSeats = new Set(allSeatIds());
    if (!body.seatIds.every((s) => validSeats.has(s))) throw new HttpError(400, "Invalid seat selection.");

    const show = await prisma.show.findUnique({ where: { id: body.showId } });
    if (!show) throw new HttpError(404, "Show not found.");
    const scope = adminCinemaScope(req);
    if (scope && show.cinemaId !== scope) throw new HttpError(403, "You can only book shows at your own cinema.");

    const totalAmount = show.ticketPrice.times(body.seatIds.length);

    try {
      const booking = await prisma.$transaction(async (tx) => {
        await tx.seatReservation.createMany({
          data: body.seatIds.map((seatNumber) => ({ showId: body.showId, customerId: body.customerId, seatNumber })),
        });
        return tx.booking.create({
          data: {
            customerId: body.customerId,
            showId: body.showId,
            ticketCount: body.seatIds.length,
            seatNumbers: body.seatIds.join(","),
            totalAmount,
          },
          include: bookingInclude,
        });
      });
      res.status(201).json(toBookingDto(booking));
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new HttpError(409, "One or more selected seats are already taken.");
      }
      throw err;
    }
  }),
);

const updateSchema = z.object({
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  paymentMethod: z.enum(["COUNTER", "ESEWA"]).optional(),
});

adminBookingsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const bookingId = Number(req.params.id);
    await assertScopedBooking(bookingId, adminCinemaScope(req));
    const body = updateSchema.parse(req.body);

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { ...body, paymentDate: body.paymentStatus === "COMPLETED" ? new Date() : undefined },
      include: bookingInclude,
    });
    res.json(toBookingDto(booking));
  }),
);

adminBookingsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const bookingId = Number(req.params.id);
    const booking = await assertScopedBooking(bookingId, adminCinemaScope(req));
    const seatNumbers = booking.seatNumbers.split(",").filter(Boolean);

    await prisma.$transaction([
      prisma.seatReservation.deleteMany({
        where: { showId: booking.showId, customerId: booking.customerId, seatNumber: { in: seatNumbers } },
      }),
      prisma.booking.delete({ where: { id: bookingId } }),
    ]);
    res.status(204).end();
  }),
);
