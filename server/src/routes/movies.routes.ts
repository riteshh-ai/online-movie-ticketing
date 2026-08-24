import { Router } from "express";
import { HttpError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { movieInclude, toMovieDto } from "../utils/dto.js";
import { prisma } from "../utils/prisma.js";

// Replaces legacy/index.php (listing + search), legacy/nowshowing.php,
// legacy/commingsoon.php, legacy/movie_details.php. "Now showing" / "coming
// soon" stay derived from releaseDate (no stored status flag), matching
// legacy behavior — see migration.md "Business logic carried over as-is".
export const moviesRouter = Router();

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

moviesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const movies = await prisma.movie.findMany({
      where: q ? { name: { contains: q } } : undefined,
      include: movieInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(movies.map(toMovieDto));
  }),
);

moviesRouter.get(
  "/now-showing",
  asyncHandler(async (_req, res) => {
    const movies = await prisma.movie.findMany({
      where: { OR: [{ releaseDate: null }, { releaseDate: { lte: startOfToday() } }] },
      include: movieInclude,
      orderBy: { releaseDate: "desc" },
    });
    res.json(movies.map(toMovieDto));
  }),
);

moviesRouter.get(
  "/coming-soon",
  asyncHandler(async (_req, res) => {
    const movies = await prisma.movie.findMany({
      where: { releaseDate: { gt: startOfToday() } },
      include: movieInclude,
      orderBy: { releaseDate: "asc" },
    });
    res.json(movies.map(toMovieDto));
  }),
);

moviesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const movie = await prisma.movie.findUnique({ where: { id: Number(req.params.id) }, include: movieInclude });
    if (!movie) throw new HttpError(404, "Movie not found.");
    res.json(toMovieDto(movie));
  }),
);
