import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prisma.js";

// Replaces legacy/contact.php's form POST handler.
export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

contactRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = contactSchema.parse(req.body);
    const contact = await prisma.contact.create({ data: body });
    res.status(201).json({ id: contact.id });
  }),
);
