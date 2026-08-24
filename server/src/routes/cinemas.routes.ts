import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prisma.js";

// Public read of the cinema list — used by the booking flow's cinema
// filter, sourced from the same `cinema` table legacy/Admin/addcinema.php
// etc. manage.
export const cinemasRouter = Router();

cinemasRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cinemas = await prisma.cinema.findMany({ orderBy: { name: "asc" } });
    res.json(cinemas);
  }),
);
