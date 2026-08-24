import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Public read of the cinema list — used by the booking flow's cinema
// filter, sourced from the same `cinema` table legacy/Admin/addcinema.php
// etc. manage.
export const cinemasRouter = Router();

cinemasRouter.get("/", notImplemented("public cinema list"));
