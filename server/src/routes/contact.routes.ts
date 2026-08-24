import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces legacy/contact.php's form POST handler.
export const contactRouter = Router();

contactRouter.post("/", notImplemented("submit contact form — legacy/contact.php"));
