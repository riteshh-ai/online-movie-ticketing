import { Router } from "express";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces legacy/index.php (listing + search), legacy/nowshowing.php,
// legacy/commingsoon.php, legacy/movie_details.php. "Now showing" / "coming
// soon" stay derived from releaseDate (no stored status flag), matching
// legacy behavior — see migration.md "Business logic carried over as-is".
export const moviesRouter = Router();

moviesRouter.get("/", notImplemented("movie listing + ?q= search — legacy/index.php"));
moviesRouter.get("/now-showing", notImplemented("now showing grid — legacy/nowshowing.php"));
moviesRouter.get("/coming-soon", notImplemented("coming soon grid — legacy/commingsoon.php"));
moviesRouter.get("/:id", notImplemented("movie detail — legacy/movie_details.php"));
