import { PrismaClient } from "@prisma/client";

// Single shared client — replaces legacy conn.php's `new connec()` created
// fresh on every page. All queries go through Prisma's parameterized query
// builder; no string-concatenated SQL anywhere in this codebase (see
// migration.md "Database access" for why that mattered).
export const prisma = new PrismaClient();
