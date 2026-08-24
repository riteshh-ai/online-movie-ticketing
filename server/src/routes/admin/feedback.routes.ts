import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deletefeedback.php. Same sidebar-only
// gating gap as customers/contacts, fixed with requireSuperAdmin.
export const adminFeedbackRouter = Router();

adminFeedbackRouter.get(
  "/",
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
    res.json(feedback.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() })));
  }),
);

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
});

adminFeedbackRouter.post(
  "/",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const feedback = await prisma.feedback.create({ data: body });
    res.status(201).json({ ...feedback, createdAt: feedback.createdAt.toISOString() });
  }),
);

const updateSchema = createSchema.partial();

adminFeedbackRouter.put(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const feedback = await prisma.feedback.update({ where: { id: Number(req.params.id) }, data: body }).catch(() => {
      throw new HttpError(404, "Feedback not found.");
    });
    res.json({ ...feedback, createdAt: feedback.createdAt.toISOString() });
  }),
);

adminFeedbackRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.feedback.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Feedback not found.");
    });
    res.status(204).end();
  }),
);
