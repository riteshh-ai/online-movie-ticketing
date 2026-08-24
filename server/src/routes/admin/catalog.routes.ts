import { Router } from "express";
import { z } from "zod";
import { requireSuperAdmin } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/errorHandler.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces the four near-identical lookup-table CRUD quartets in legacy/Admin:
// add|edit|view|delete genre.php, industry.php, language.php, showtime.php.
// Super-admin only in legacy (hidden from scoped-admin sidebar); enforced
// here with requireSuperAdmin on mutating routes, not just by hiding a link.
export const adminCatalogRouter = Router();

// [plural route segment, Prisma delegate name, model field holding the display value]
const kinds = [
  ["genres", "genre", "name"],
  ["industries", "industry", "name"],
  ["languages", "language", "name"],
  ["showtimes", "showTime", "label"],
] as const;

const bodySchema = z.object({ value: z.string().min(1) });

type Row = { id: number; [key: string]: unknown };

for (const [plural, model, field] of kinds) {
  const delegate = prisma[model] as unknown as {
    findMany: (args: unknown) => Promise<Row[]>;
    create: (args: unknown) => Promise<Row>;
    update: (args: unknown) => Promise<Row>;
    delete: (args: unknown) => Promise<Row>;
  };

  adminCatalogRouter.get(
    `/${plural}`,
    asyncHandler(async (_req, res) => {
      const rows = await delegate.findMany({ orderBy: { [field]: "asc" } });
      res.json(rows.map((r) => ({ id: r.id, name: r[field] })));
    }),
  );

  adminCatalogRouter.post(
    `/${plural}`,
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
      const { value } = bodySchema.parse(req.body);
      const row = await delegate.create({ data: { [field]: value } });
      res.status(201).json({ id: row.id, name: row[field] });
    }),
  );

  adminCatalogRouter.put(
    `/${plural}/:id`,
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
      const { value } = bodySchema.parse(req.body);
      const row = await delegate
        .update({ where: { id: Number(req.params.id) }, data: { [field]: value } })
        .catch(() => {
          throw new HttpError(404, `Not found.`);
        });
      res.json({ id: row.id, name: row[field] });
    }),
  );

  adminCatalogRouter.delete(
    `/${plural}/:id`,
    requireSuperAdmin,
    asyncHandler(async (req, res) => {
      await delegate.delete({ where: { id: Number(req.params.id) } }).catch(() => {
        throw new HttpError(404, `Not found.`);
      });
      res.status(204).end();
    }),
  );
}
