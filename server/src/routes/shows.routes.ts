import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces the show+cinema+time picker and seat grid inside legacy/booking.php
// (GET side). The seat grid stays a fixed 4x10 "R{row}S{seat}" layout (see
// migration.md "Business logic carried over as-is"), but /:showId/seats now
// returns which seats are actually taken by querying SeatReservation instead
// of leaving conflict-checking undone.
export const showsRouter = Router();

showsRouter.get("/movie/:movieId", notImplemented("shows for a movie, grouped by cinema/date/time — legacy/booking.php"));
showsRouter.get("/:showId/seats", notImplemented("seat map + reserved seats for a show — new, legacy had no server-side seat query"));
