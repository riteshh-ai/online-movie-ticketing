import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/view|edit|deletecontact.php — same "hidden from
// sidebar, not actually access-controlled" gap as customers.routes.ts, fixed
// the same way with requireSuperAdmin.
export const adminContactsRouter = Router();

adminContactsRouter.get("/", requireSuperAdmin, notImplemented("list contact messages — legacy/Admin/viewcontact.php"));
adminContactsRouter.put("/:id", requireSuperAdmin, notImplemented("update contact message — legacy/Admin/editcontact.php"));
adminContactsRouter.delete("/:id", requireSuperAdmin, notImplemented("delete contact message — legacy/Admin/deletecontact.php"));
