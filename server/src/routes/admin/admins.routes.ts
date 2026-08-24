import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deleteadmin.php (managing admin_users
// rows). Super-admin only, same as legacy's "Admins" sidebar section —
// enforced here with requireSuperAdmin on every route, not just by hiding
// the nav section.
export const adminAdminsRouter = Router();

adminAdminsRouter.get("/", requireSuperAdmin, notImplemented("list cinema admins — legacy/Admin/viewadmin.php"));
adminAdminsRouter.post("/", requireSuperAdmin, notImplemented("create cinema admin — legacy/Admin/addadmin.php"));
adminAdminsRouter.put("/:id", requireSuperAdmin, notImplemented("update cinema admin — legacy/Admin/editadmin.php"));
adminAdminsRouter.delete("/:id", requireSuperAdmin, notImplemented("delete cinema admin — legacy/Admin/deleteadmin.php"));
