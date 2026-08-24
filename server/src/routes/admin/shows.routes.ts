import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deleteshow.php. view/delete apply
// adminCinemaScope() for cinema-scoped admins, same restriction legacy
// applied via a WHERE cinema_id filter. deleteshow.php in legacy manually
// cascades to booking/seat_detail/seat_reserved rows first — here that's
// just `onDelete: Cascade` in prisma/schema.prisma, no manual cleanup needed.
export const adminShowsRouter = Router();

adminShowsRouter.get("/", notImplemented("list shows (cinema-scoped) — legacy/Admin/viewshow.php"));
adminShowsRouter.post("/", notImplemented("create show — legacy/Admin/addshow.php"));
adminShowsRouter.put("/:id", notImplemented("update show — legacy/Admin/editshow.php"));
adminShowsRouter.delete("/:id", notImplemented("delete show — legacy/Admin/deleteshow.php"));
