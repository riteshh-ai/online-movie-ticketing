import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deletecinema.php. GET is open to any
// admin (needed to populate cinema pickers elsewhere); mutations are
// super-admin only, same as legacy's sidebar restriction.
export const adminCinemasRouter = Router();

const cinemaSchema = z.object({ name: z.string().min(1), location: z.string().min(1), city: z.string().min(1) });

adminCinemasRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.cinema.findMany({ orderBy: { name: "asc" } }));
  }),
);

adminCinemasRouter.post(
  "/",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = cinemaSchema.parse(req.body);
    res.status(201).json(await prisma.cinema.create({ data: body }));
  }),
);

adminCinemasRouter.put(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = cinemaSchema.partial().parse(req.body);
    const cinema = await prisma.cinema.update({ where: { id: Number(req.params.id) }, data: body }).catch(() => {
      throw new HttpError(404, "Cinema not found.");
    });
    res.json(cinema);
  }),
);

adminCinemasRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.cinema.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Cinema not found.");
    });
    res.status(204).end();
  }),
);
