import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deleteslider.php (homepage banner
// images). addslider.php handles one file upload — see movies.routes.ts
// comment on the multer/uploads approach replacing move_uploaded_file().
export const adminSlidersRouter = Router();

adminSlidersRouter.get("/", notImplemented("list slider images — legacy/Admin/viewslider.php"));
adminSlidersRouter.post("/", requireSuperAdmin, notImplemented("create slider image — legacy/Admin/addslider.php"));
adminSlidersRouter.put("/:id", requireSuperAdmin, notImplemented("update slider image — legacy/Admin/editslider.php"));
adminSlidersRouter.delete("/:id", requireSuperAdmin, notImplemented("delete slider image — legacy/Admin/deleteslider.php"));
