import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/prisma.js";

// Public read of homepage banner images — replaces legacy/index.php's
// `SELECT * FROM slider` carousel query (no auth required to view it).
export const slidersRouter = Router();

slidersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await prisma.slider.findMany({ orderBy: { id: "asc" } }));
  }),
);
