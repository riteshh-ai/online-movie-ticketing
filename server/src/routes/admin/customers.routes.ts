import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deletecustomer.php. Legacy had NO
// cinema-scoping and NO auth check on this page at all — it was only kept
// out of a scoped admin's reach by being absent from their sidebar links
// (PROJECT_REFERENCE.md §10.6, a real authorization gap). Fixed here by
// requiring requireSuperAdmin server-side, not just hiding a nav link.
export const adminCustomersRouter = Router();

function toCustomerDto(c: { id: number; fullName: string; email: string; phone: string | null; gender: string | null; createdAt: Date }) {
  return { id: c.id, fullName: c.fullName, email: c.email, phone: c.phone, gender: c.gender, createdAt: c.createdAt.toISOString() };
}

adminCustomersRouter.get(
  "/",
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    res.json(customers.map(toCustomerDto));
  }),
);

const createSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  gender: z.string().optional(),
});

adminCustomersRouter.post(
  "/",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const existing = await prisma.customer.findUnique({ where: { email: body.email } });
    if (existing) throw new HttpError(409, "An account with that email already exists.");

    const passwordHash = await bcrypt.hash(body.password, 12);
    const customer = await prisma.customer.create({
      data: { fullName: body.fullName, email: body.email, phone: body.phone, gender: body.gender, passwordHash },
    });
    res.status(201).json(toCustomerDto(customer));
  }),
);

const updateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  password: z.string().min(6).optional(),
});

adminCustomersRouter.put(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const { password, ...rest } = body;

    const customer = await prisma.customer
      .update({
        where: { id: Number(req.params.id) },
        data: { ...rest, passwordHash: password ? await bcrypt.hash(password, 12) : undefined },
      })
      .catch(() => {
        throw new HttpError(404, "Customer not found.");
      });
    res.json(toCustomerDto(customer));
  }),
);

adminCustomersRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.customer.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Customer not found.");
    });
    res.status(204).end();
  }),
);
