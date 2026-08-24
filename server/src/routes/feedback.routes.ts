import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces legacy/feedback.php's form POST handler. `rating` is now a real
// 1-5 int (legacy sent free-text strings '1'/'3'/'4'/'5', with no '2' — see
// Feedback model comment in prisma/schema.prisma).
export const feedbackRouter = Router();

feedbackRouter.post("/", notImplemented("submit feedback form — legacy/feedback.php"));
