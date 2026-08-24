import { allSeatIds } from "@mycinezone/shared";
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { requireCustomer } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bookingInclude, toBookingDto } from "../utils/dto.js";
import { prisma } from "../utils/prisma.js";

// Replaces the POST handler in legacy/booking.php. Fixes applied here (see
// migration.md "Business logic fixes"): total_amount always computed
// server-side from show.ticketPrice (legacy had a hardcoded 250/ticket
// fallback that could drift from the real price); seat insert wrapped in a
// transaction guarded by SeatReservation's unique (showId, seatNumber)
// constraint, so an already-taken seat fails instead of silently double-booking.
export const bookingsRouter = Router();

const createBookingSchema = z.object({
  showId: z.number().int(),
  seatIds: z.array(z.string().min(1)).min(1),
});

bookingsRouter.post(
  "/",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const body = createBookingSchema.parse(req.body);
    const validSeats = new Set(allSeatIds());
    if (!body.seatIds.every((s) => validSeats.has(s))) {
      throw new HttpError(400, "Invalid seat selection.");
    }

    const show = await prisma.show.findUnique({ where: { id: body.showId } });
    if (!show) throw new HttpError(404, "Show not found.");

    const totalAmount = show.ticketPrice.times(body.seatIds.length);
    const customerId = req.customer!.customerId;

    try {
      const booking = await prisma.$transaction(async (tx) => {
        await tx.seatReservation.createMany({
          data: body.seatIds.map((seatNumber) => ({ showId: body.showId, customerId, seatNumber })),
        });
        return tx.booking.create({
          data: {
            customerId,
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
        throw new HttpError(409, "One or more selected seats were just taken — please choose different seats.");
      }
      throw err;
    }
  }),
);

bookingsRouter.get(
  "/me",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      where: { customerId: req.customer!.customerId },
      include: bookingInclude,
      orderBy: { bookingDate: "desc" },
    });
    res.json(bookings.map(toBookingDto));
  }),
);

bookingsRouter.get(
  "/:id",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) }, include: bookingInclude });
    if (!booking || booking.customerId !== req.customer!.customerId) throw new HttpError(404, "Booking not found.");
    res.json(toBookingDto(booking));
  }),
);
