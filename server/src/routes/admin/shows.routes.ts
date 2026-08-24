import { Router } from "express";
import { z } from "zod";
import { adminCinemaScope } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { showInclude, toShowDto } from "../../utils/dto.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deleteshow.php. view/create/edit/delete
// all apply adminCinemaScope() for cinema-scoped admins, same restriction
// legacy applied via a WHERE cinema_id filter. deleteshow.php in legacy
// manually cascades to booking/seat_detail/seat_reserved rows first — here
// that's just `onDelete: Cascade` in prisma/schema.prisma, no manual cleanup.
export const adminShowsRouter = Router();

const showSchema = z.object({
  movieId: z.coerce.number().int(),
  cinemaId: z.coerce.number().int(),
  showTimeId: z.coerce.number().int(),
  showDate: z.string().min(1),
  seatCapacity: z.coerce.number().int().positive(),
  ticketPrice: z.coerce.number().positive(),
});

adminShowsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cinemaId = adminCinemaScope(req);
    const shows = await prisma.show.findMany({
      where: cinemaId ? { cinemaId } : {},
      include: { ...showInclude, movie: true },
      orderBy: { showDate: "desc" },
    });
    res.json(shows.map((s) => ({ ...toShowDto(s), movieName: s.movie.name })));
  }),
);

adminShowsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = showSchema.parse(req.body);
    const scope = adminCinemaScope(req);
    if (scope && body.cinemaId !== scope) throw new HttpError(403, "You can only create shows for your own cinema.");

    const show = await prisma.show.create({
      data: { ...body, showDate: new Date(body.showDate) },
      include: { ...showInclude, movie: true },
    });
    res.status(201).json({ ...toShowDto(show), movieName: show.movie.name });
  }),
);

async function assertScopedShow(showId: number, scope: number | null) {
  const show = await prisma.show.findUnique({ where: { id: showId } });
  if (!show) throw new HttpError(404, "Show not found.");
  if (scope && show.cinemaId !== scope) throw new HttpError(403, "You can only manage shows for your own cinema.");
  return show;
}

adminShowsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const showId = Number(req.params.id);
    const scope = adminCinemaScope(req);
    await assertScopedShow(showId, scope);

    const body = showSchema.partial().parse(req.body);
    if (scope && body.cinemaId && body.cinemaId !== scope) throw new HttpError(403, "You can only manage shows for your own cinema.");

    const show = await prisma.show.update({
      where: { id: showId },
      data: { ...body, showDate: body.showDate ? new Date(body.showDate) : undefined },
      include: { ...showInclude, movie: true },
    });
    res.json({ ...toShowDto(show), movieName: show.movie.name });
  }),
);

adminShowsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const showId = Number(req.params.id);
    await assertScopedShow(showId, adminCinemaScope(req));
    await prisma.show.delete({ where: { id: showId } });
    res.status(204).end();
  }),
);
