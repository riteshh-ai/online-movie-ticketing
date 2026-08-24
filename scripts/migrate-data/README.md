# migrate-data

One-time tool that copies data out of the legacy MySQL database (schema
reconstructed in `legacy/PROJECT_REFERENCE.md` §5) into the new schema
(`server/prisma/schema.prisma`). Same database engine on both sides — this is
a schema cleanup + copy, not a cross-engine conversion.

## What it does

Reads every legacy table with `mysql2`, transforms each row, and writes it
into the new database through the generated Prisma client, in dependency
order so foreign keys resolve correctly:

1. `genre`, `industry`, `language`, `cinema`, `show_time` — lookup tables
2. `movie` (needs the genre/industry/language id maps from step 1)
3. `customer` — **plaintext `password` is bcrypt-hashed here** (12 rounds);
   this is the only point in the whole migration where the plaintext is ever
   read, and it's read directly out of the legacy DB, never written to disk
   or logged. No forced password reset needed since we have the real
   plaintext at migration time.
4. `show` (needs movie/cinema/show_time id maps)
5. `seat_reserved` → `SeatReservation` (needs show/customer id maps). The
   legacy `reserved` column's inverted meaning (0 = booked, per
   `PROJECT_REFERENCE.md` §5) is dropped entirely — a `SeatReservation` row
   existing at all means that seat is taken, no flag to get backwards.
6. `seat_detail` is read into memory only (not copied as its own table — the
   new schema folds it into `Booking.seatNumbers`, see schema comment) and
   joined against `booking.seat_dt_id` when migrating bookings.
7. `booking` → `Booking` (needs customer/show id maps + the in-memory
   `seat_detail` join from step 6). `total_amount` is copied as stored — this
   script does not attempt to retroactively recompute historical charges
   even though legacy's calculation had a known bug (see
   `PROJECT_REFERENCE.md` §9); that bug is fixed going forward in
   `server/src/routes/bookings.routes.ts`, not rewritten into history.
8. `contact`, `feedback` (rating normalized from legacy free-text
   `'1'/'3'/'4'/'5'` to a real int), `slider` — independent, no id maps needed.
9. `admin_users` → `AdminUser` (needs the cinema id map), each created with
   `role: CINEMA_ADMIN`. The hardcoded super-admin (`admin@gmail.com` /
   `admin1234` in legacy `Admin/index.php`) is **not** in this table and is
   **not** created by this script — it's bootstrapped separately by
   `server/prisma/seed/index.ts` from `SEED_SUPERADMIN_EMAIL`/`_PASSWORD`, so
   you control its credentials instead of inheriting the hardcoded ones.

## Running it

```bash
# 1. Copy .env.example to .env and fill in both connection strings.
cp .env.example .env

# 2. From server/: create the new schema, then seed the super-admin.
npm run prisma:migrate --workspace=server
npm run seed --workspace=server

# 3. From repo root (or this folder): run the migration.
npm run migrate --workspace=scripts/migrate-data
```

The script is **not** idempotent/re-runnable against a non-empty target
database — it always inserts, it doesn't upsert. Run it once against a fresh
`server/prisma/migrate dev` database. If you need to re-run it, reset the
target database first (`prisma migrate reset --workspace=server`).

## Not handled by this script

- **Images** (`legacy/Images/`, `legacy/Images/landscape/`): copy the files
  you actually want to keep into `server/uploads/`, then update the copied
  rows' `posterPath`/`landscapePath`/`imageUrl` fields to match — deliberately
  left manual since it's a good moment to drop unused/test images rather than
  copy the whole folder wholesale, and because the final URL scheme depends
  on how `server/src/routes/admin/movies.routes.ts` ends up serving uploads
  once implemented.
- Live re-validation of `eSewa` `transaction_id`s — payments stay
  simulate-only per `migration.md`, so this is copied as inert historical
  data only.
