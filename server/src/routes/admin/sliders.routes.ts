import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";
import { uploadPathFor, uploadSliderImage } from "../../utils/upload.js";

// Replaces legacy/Admin/add|edit|view|deleteslider.php (homepage banner
// images). addslider.php handles one file upload — see admin/movies.routes.ts
// for the multer/uploads approach replacing move_uploaded_file().
export const adminSlidersRouter = Router();

adminSlidersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.slider.findMany({ orderBy: { id: "asc" } }));
  }),
);

const altTextSchema = z.object({ altText: z.string().optional() });

adminSlidersRouter.post(
  "/",
  requireSuperAdmin,
  uploadSliderImage,
  asyncHandler(async (req, res) => {
    const body = altTextSchema.parse(req.body);
    const file = req.file;
    if (!file) throw new HttpError(400, "An image file is required.");

    const slider = await prisma.slider.create({ data: { imageUrl: uploadPathFor("sliders", file.filename), altText: body.altText } });
    res.status(201).json(slider);
  }),
);

adminSlidersRouter.put(
  "/:id",
  requireSuperAdmin,
  uploadSliderImage,
  asyncHandler(async (req, res) => {
    const body = altTextSchema.parse(req.body);
    const file = req.file;

    const slider = await prisma.slider
      .update({
        where: { id: Number(req.params.id) },
        data: { altText: body.altText, imageUrl: file ? uploadPathFor("sliders", file.filename) : undefined },
      })
      .catch(() => {
        throw new HttpError(404, "Slider not found.");
      });
    res.json(slider);
  }),
);

adminSlidersRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.slider.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Slider not found.");
    });
    res.status(204).end();
  }),
);
