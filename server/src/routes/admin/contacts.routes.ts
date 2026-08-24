import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/view|edit|deletecontact.php — same "hidden from
// sidebar, not actually access-controlled" gap as customers.routes.ts, fixed
// the same way with requireSuperAdmin.
export const adminContactsRouter = Router();

adminContactsRouter.get(
  "/",
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    res.json(contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
  }),
);

const updateSchema = z.object({ message: z.string().min(1).optional(), phone: z.string().optional() });

adminContactsRouter.put(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const contact = await prisma.contact.update({ where: { id: Number(req.params.id) }, data: body }).catch(() => {
      throw new HttpError(404, "Contact message not found.");
    });
    res.json({ ...contact, createdAt: contact.createdAt.toISOString() });
  }),
);

adminContactsRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.contact.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Contact message not found.");
    });
    res.status(204).end();
  }),
);
