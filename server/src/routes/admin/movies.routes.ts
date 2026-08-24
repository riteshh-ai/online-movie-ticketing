import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { movieInclude, toMovieDto } from "../../utils/dto.js";
import { prisma } from "../../utils/prisma.js";
import { uploadMovieImages, uploadPathFor } from "../../utils/upload.js";

// Replaces legacy/Admin/add|edit|view|deletemovie.php. addmovie.php/editmovie.php
// each handle two file uploads (poster + landscape banner) via
// move_uploaded_file() — reimplemented here with multer, storing under
// server/uploads/movies/ (see .gitignore) and served statically via app.ts,
// fixing the legacy Images/ vs images/ casing inconsistency
// (PROJECT_REFERENCE.md §2) in the process.
export const adminMoviesRouter = Router();

const movieSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.string().optional(),
  director: z.string().optional(),
  cast: z.string().optional(),
  ageRating: z.string().optional(),
  genreId: z.coerce.number().int().optional(),
  industryId: z.coerce.number().int().optional(),
  languageId: z.coerce.number().int().optional(),
});

function filesOf(req: import("express").Request) {
  return req.files as { poster?: Express.Multer.File[]; landscape?: Express.Multer.File[] } | undefined;
}

adminMoviesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const movies = await prisma.movie.findMany({ include: movieInclude, orderBy: { createdAt: "desc" } });
    res.json(movies.map(toMovieDto));
  }),
);

adminMoviesRouter.post(
  "/",
  uploadMovieImages,
  asyncHandler(async (req, res) => {
    const body = movieSchema.parse(req.body);
    const files = filesOf(req);

    const movie = await prisma.movie.create({
      data: {
        ...body,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined,
        posterPath: files?.poster?.[0] ? uploadPathFor("movies", files.poster[0].filename) : undefined,
        landscapePath: files?.landscape?.[0] ? uploadPathFor("movies", files.landscape[0].filename) : undefined,
      },
      include: movieInclude,
    });
    res.status(201).json(toMovieDto(movie));
  }),
);

adminMoviesRouter.put(
  "/:id",
  uploadMovieImages,
  asyncHandler(async (req, res) => {
    const body = movieSchema.partial().parse(req.body);
    const files = filesOf(req);

    const movie = await prisma.movie
      .update({
        where: { id: Number(req.params.id) },
        data: {
          ...body,
          releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined,
          posterPath: files?.poster?.[0] ? uploadPathFor("movies", files.poster[0].filename) : undefined,
          landscapePath: files?.landscape?.[0] ? uploadPathFor("movies", files.landscape[0].filename) : undefined,
        },
        include: movieInclude,
      })
      .catch(() => {
        throw new HttpError(404, "Movie not found.");
      });
    res.json(toMovieDto(movie));
  }),
);

adminMoviesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.movie.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Movie not found.");
    });
    res.status(204).end();
  }),
);
