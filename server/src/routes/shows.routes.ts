import { allSeatIds, type SeatMapDto } from "@mycinezone/shared";
import { Router } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { showInclude, toShowDto } from "../utils/dto.js";
import { prisma } from "../utils/prisma.js";

// Replaces the show+cinema+time picker and seat grid inside legacy/booking.php
// (GET side). The seat grid stays a fixed 4x10 "R{row}S{seat}" layout (see
// migration.md "Business logic carried over as-is"), but /:showId/seats now
// returns which seats are actually taken by querying SeatReservation instead
// of leaving conflict-checking undone.
export const showsRouter = Router();

showsRouter.get(
  "/movie/:movieId",
  asyncHandler(async (req, res) => {
    const shows = await prisma.show.findMany({
      where: { movieId: Number(req.params.movieId) },
      include: showInclude,
      orderBy: [{ showDate: "asc" }],
    });
    res.json(shows.map(toShowDto));
  }),
);

showsRouter.get(
  "/:showId",
  asyncHandler(async (req, res) => {
    const show = await prisma.show.findUnique({
      where: { id: Number(req.params.showId) },
      include: { ...showInclude, movie: true },
    });
    if (!show) throw new HttpError(404, "Show not found.");
    res.json({ ...toShowDto(show), movieName: show.movie.name });
  }),
);

showsRouter.get(
  "/:showId/seats",
  asyncHandler(async (req, res) => {
    const showId = Number(req.params.showId);
    const show = await prisma.show.findUnique({ where: { id: showId } });
    if (!show) throw new HttpError(404, "Show not found.");

    const taken = await prisma.seatReservation.findMany({ where: { showId }, select: { seatNumber: true } });
    const body: SeatMapDto = { seatIds: allSeatIds(), takenSeatIds: taken.map((t) => t.seatNumber) };
    res.json(body);
  }),
);
