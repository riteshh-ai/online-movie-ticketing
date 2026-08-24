import { Router } from "express";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces legacy/Admin/add|edit|view|deletecustomer.php. Legacy had NO
// cinema-scoping and NO auth check on this page at all — it was only kept
// out of a scoped admin's reach by being absent from their sidebar links
// (PROJECT_REFERENCE.md §10.6, a real authorization gap). Fixed here by
// requiring requireSuperAdmin server-side, not just hiding a nav link.
export const adminCustomersRouter = Router();

adminCustomersRouter.get("/", requireSuperAdmin, notImplemented("list customers — legacy/Admin/viewcustomer.php"));
adminCustomersRouter.post("/", requireSuperAdmin, notImplemented("create customer — legacy/Admin/addcustomer.php"));
adminCustomersRouter.put("/:id", requireSuperAdmin, notImplemented("update customer — legacy/Admin/editcustomer.php"));
adminCustomersRouter.delete("/:id", requireSuperAdmin, notImplemented("delete customer — legacy/Admin/deletecustomer.php"));
