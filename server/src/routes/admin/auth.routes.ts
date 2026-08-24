import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { toAdminUserDto } from "../../utils/dto.js";
import { signAccessToken } from "../../utils/jwt.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/index.php (login form + handler, including the
// hardcoded super-admin credential check) and legacy/Admin/logout.php.
// Fix applied here (see migration.md "Auth"): the super-admin is now a real
// AdminUser row (role SUPER_ADMIN, cinemaId null) created by prisma/seed,
// not a literal `if` in source. Not mounted behind requireAdmin — this is
// how an admin session starts.
export const adminAuthRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

adminAuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({ where: { email: body.email }, include: { cinema: true } });
    if (!admin || !(await bcrypt.compare(body.password, admin.passwordHash))) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const token = signAccessToken({ type: "admin", adminId: admin.id, role: admin.role, cinemaId: admin.cinemaId });
    setAuthCookie(res, token);
    res.json(toAdminUserDto(admin));
  }),
);

adminAuthRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

adminAuthRouter.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.adminId }, include: { cinema: true } });
    if (!admin) throw new HttpError(404, "Admin not found.");
    res.json(toAdminUserDto(admin));
  }),
);
