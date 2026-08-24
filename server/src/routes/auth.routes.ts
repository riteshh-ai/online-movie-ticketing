import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireCustomer } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";
import { signAccessToken } from "../utils/jwt.js";
import { prisma } from "../utils/prisma.js";

// Replaces the customer login/registration POST handlers embedded in
// legacy/header.php, and the read-only view in legacy/profile.php.
// Fixes applied here (see migration.md "Auth"): bcrypt password hashing
// instead of plaintext ==, JWT in an httpOnly cookie instead of a bare
// $_SESSION flag, real input validation (zod) instead of none.
export const authRouter = Router();

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  gender: z.string().optional(),
});

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.customer.findUnique({ where: { email: body.email } });
    if (existing) throw new HttpError(409, "An account with that email already exists.");

    const passwordHash = await bcrypt.hash(body.password, 12);
    const customer = await prisma.customer.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        passwordHash,
      },
    });

    const token = signAccessToken({ type: "customer", customerId: customer.id });
    setAuthCookie(res, token);
    res.status(201).json({ id: customer.id, fullName: customer.fullName, email: customer.email });
  }),
);

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const customer = await prisma.customer.findUnique({ where: { email: body.email } });
    if (!customer || !(await bcrypt.compare(body.password, customer.passwordHash))) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const token = signAccessToken({ type: "customer", customerId: customer.id });
    setAuthCookie(res, token);
    res.json({ id: customer.id, fullName: customer.fullName, email: customer.email });
  }),
);

authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

authRouter.get(
  "/me",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const customer = await prisma.customer.findUnique({ where: { id: req.customer!.customerId } });
    if (!customer) throw new HttpError(404, "Customer not found.");
    res.json({ id: customer.id, fullName: customer.fullName, email: customer.email, phone: customer.phone, gender: customer.gender });
  }),
);
