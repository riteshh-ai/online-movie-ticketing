import { Router } from "express";
import { notImplemented } from "../../utils/notImplemented.js";

// Replaces the four near-identical lookup-table CRUD quartets in legacy/Admin:
// add|edit|view|delete genre.php, industry.php, language.php, showtime.php.
// Super-admin only in legacy (hidden from scoped-admin sidebar); enforce that
// with requireSuperAdmin on mutating routes when implementing, not just by
// hiding a link.
export const adminCatalogRouter = Router();

// [plural route segment, singular legacy filename fragment]
const kinds = [
  ["genres", "genre"],
  ["industries", "industry"],
  ["languages", "language"],
  ["showtimes", "showtime"],
] as const;

for (const [plural, singular] of kinds) {
  adminCatalogRouter.get(`/${plural}`, notImplemented(`list ${plural} — legacy/Admin/view${singular}.php`));
  adminCatalogRouter.post(`/${plural}`, notImplemented(`create ${plural} — legacy/Admin/add${singular}.php`));
  adminCatalogRouter.put(`/${plural}/:id`, notImplemented(`update ${plural} — legacy/Admin/edit${singular}.php`));
  adminCatalogRouter.delete(`/${plural}/:id`, notImplemented(`delete ${plural} — legacy/Admin/delete${singular}.php`));
}
