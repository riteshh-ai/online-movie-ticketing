import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deletemovie.php. addmovie.php/editmovie.php
// each handle two file uploads (poster + landscape banner) via
// move_uploaded_file() — reimplement with multer, storing under
// server/uploads/ (see .gitignore) and serving via a static route in app.ts,
// fixing the legacy Images/ vs images/ casing inconsistency
// (PROJECT_REFERENCE.md §2) in the process.
export const adminMoviesRouter = Router();

adminMoviesRouter.get("/", notImplemented("list movies — legacy/Admin/viewmovie.php"));
adminMoviesRouter.post("/", notImplemented("create movie (+ poster/landscape upload) — legacy/Admin/addmovie.php"));
adminMoviesRouter.put("/:id", notImplemented("update movie — legacy/Admin/editmovie.php"));
adminMoviesRouter.delete("/:id", notImplemented("delete movie — legacy/Admin/deletemovie.php"));
