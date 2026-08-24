import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prisma.js";

// Replaces legacy/feedback.php's form POST handler. `rating` is now a real
// 1-5 int (legacy sent free-text strings '1'/'3'/'4'/'5', with no '2' — see
// Feedback model comment in prisma/schema.prisma).
export const feedbackRouter = Router();

const feedbackSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

feedbackRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = feedbackSchema.parse(req.body);
    const feedback = await prisma.feedback.create({ data: body });
    res.status(201).json({ id: feedback.id });
  }),
);
