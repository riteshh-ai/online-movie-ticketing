import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deletefeedback.php. Same sidebar-only
// gating gap as customers/contacts, fixed with requireSuperAdmin.
export const adminFeedbackRouter = Router();

adminFeedbackRouter.get("/", requireSuperAdmin, notImplemented("list feedback — legacy/Admin/viewfeedback.php"));
adminFeedbackRouter.post("/", requireSuperAdmin, notImplemented("create feedback — legacy/Admin/addfeedback.php"));
adminFeedbackRouter.put("/:id", requireSuperAdmin, notImplemented("update feedback — legacy/Admin/editfeedback.php"));
adminFeedbackRouter.delete("/:id", requireSuperAdmin, notImplemented("delete feedback — legacy/Admin/deletefeedback.php"));
