import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { toAdminUserDto } from "../../utils/dto.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/add|edit|view|deleteadmin.php (managing admin_users
// rows). Super-admin only, same as legacy's "Admins" sidebar section —
// enforced here with requireSuperAdmin on every route, not just by hiding
// the nav section.
export const adminAdminsRouter = Router();

adminAdminsRouter.get(
  "/",
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    const admins = await prisma.adminUser.findMany({ include: { cinema: true }, orderBy: { createdAt: "desc" } });
    res.json(admins.map(toAdminUserDto));
  }),
);

const createSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SUPER_ADMIN", "CINEMA_ADMIN"]).default("CINEMA_ADMIN"),
  cinemaId: z.coerce.number().int().optional(),
});

adminAdminsRouter.post(
  "/",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 12);
    const admin = await prisma.adminUser.create({
      data: {
        username: body.username,
        email: body.email,
        passwordHash,
        role: body.role,
        cinemaId: body.role === "SUPER_ADMIN" ? null : body.cinemaId,
      },
      include: { cinema: true },
    });
    res.status(201).json(toAdminUserDto(admin));
  }),
);

const updateSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["SUPER_ADMIN", "CINEMA_ADMIN"]).optional(),
  cinemaId: z.coerce.number().int().nullable().optional(),
});

adminAdminsRouter.put(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const { password, ...rest } = body;

    const admin = await prisma.adminUser
      .update({
        where: { id: Number(req.params.id) },
        data: {
          ...rest,
          cinemaId: rest.role === "SUPER_ADMIN" ? null : rest.cinemaId,
          passwordHash: password ? await bcrypt.hash(password, 12) : undefined,
        },
        include: { cinema: true },
      })
      .catch(() => {
        throw new HttpError(404, "Admin not found.");
      });
    res.json(toAdminUserDto(admin));
  }),
);

adminAdminsRouter.delete(
  "/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    await prisma.adminUser.delete({ where: { id: Number(req.params.id) } }).catch(() => {
      throw new HttpError(404, "Admin not found.");
    });
    res.status(204).end();
  }),
);
