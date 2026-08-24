import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deletecinema.php. Super-admin only.
export const adminCinemasRouter = Router();

adminCinemasRouter.get("/", notImplemented("list cinemas — legacy/Admin/viewcinema.php"));
adminCinemasRouter.post("/", notImplemented("create cinema — legacy/Admin/addcinema.php"));
adminCinemasRouter.put("/:id", notImplemented("update cinema — legacy/Admin/editcinema.php"));
adminCinemasRouter.delete("/:id", notImplemented("delete cinema — legacy/Admin/deletecinema.php"));
