# Migration plan: MyCineZone (PHP/MySQL → Node/Express + React)

Source material: [`legacy/PROJECT_REFERENCE.md`](./legacy/PROJECT_REFERENCE.md)
is a full technical snapshot of the original app (procedural PHP, `mysqli`,
no framework) — current behavior, schema, bugs, and security holes, all
reverse-engineered and verified against a real run of the app. Read it first
if anything below is unclear; it's the source of truth for "what legacy
actually does."

## Decisions (locked in 2026-08-25)

| Question | Decision |
|---|---|
| Target stack | Node.js + Express API, React SPA (Vite), TypeScript throughout |
| Database | Stay on MySQL (via Prisma) — same engine as legacy, so the data migration is a same-engine copy + cleanup, not a cross-engine conversion |
| Behavior policy | Fix known issues opportunistically, not a byte-for-byte behavioral clone — see "Fixes applied" below |
| Payments | Keep the eSewa flow **simulate-only** (no live gateway call) |
| Existing data | Migrate it — `scripts/migrate-data/` copies the legacy database into the new schema |

## Status: structure scaffolded, business logic not yet implemented

This pass built the project skeleton — folders, configs, Prisma schema, the
full route map, and page map, all wired and importable — with route/page
*handlers* stubbed to `501 Not implemented`. That was the actual ask
("create a proper structure of the project first"). Implementing the real
handlers is the next phase; see "Suggested build order" at the bottom.

## Repository layout

```
client/                       React SPA (Vite + TS)
  src/
    api/client.ts               fetch wrapper (credentials: include, JSON)
    context/AuthContext.tsx     customer + admin session state (hydrated from /me endpoints, not yet wired)
    components/                 PageStub, RequireAdmin route guard
    pages/                      one file per public route (see "Route map" below)
    pages/admin/                one file per admin route
    App.tsx                     react-router-dom route table

server/                        Express API (TS)
  src/
    config/env.ts                zod-validated environment config
    utils/prisma.ts, jwt.ts      Prisma client singleton, JWT sign/verify
    middleware/auth.ts            attachPrincipal, requireCustomer, requireAdmin, requireSuperAdmin, adminCinemaScope
    middleware/errorHandler.ts    HttpError, centralized error + 404 handling
    routes/                       one file per public resource
    routes/admin/                 one file per admin resource, mounted behind requireAdmin in routes/admin/index.ts
    app.ts, index.ts              express app wiring / entrypoint
  prisma/schema.prisma            the new DB schema (see "Database" below)
  prisma/seed/index.ts             bootstraps the super-admin from env vars

shared/src/index.ts             types + constants used by both client and server
                                 (seat grid constants, PaymentStatus/Method/AdminRole, DTO shapes)

scripts/migrate-data/           one-time legacy DB -> new DB copy tool (see its README.md)

legacy/                         original PHP app (git metadata stripped), kept for reference only
```

Monorepo is plain **npm workspaces** (`server`, `client`, `shared`,
`scripts/migrate-data`) — no Turborepo/Nx; the project is small enough that
the extra tooling wouldn't pay for itself.

## Route map (legacy file → new route)

Public:

| Legacy | New |
|---|---|
| `index.php` | `GET /` (client) · `GET /api/movies?q=` (server) |
| `nowshowing.php` | `GET /now-showing` · `GET /api/movies/now-showing` |
| `commingsoon.php` | `GET /coming-soon` · `GET /api/movies/coming-soon` |
| `movie_details.php?movie_id=` | `GET /movies/:movieId` · `GET /api/movies/:id` |
| `booking.php` (GET: picker) | `GET /booking/:showId` · `GET /api/shows/movie/:movieId`, `GET /api/shows/:showId/seats` |
| `booking.php` (POST: create) | `POST /api/bookings` |
| `esewa_payment.php` | `POST /api/payments/esewa/initiate` |
| `payment_success.php` / `payment_failure.php` | `GET /payment/:outcome` · `POST /api/payments/esewa/simulate-success` \| `-failure` |
| `payment_counter.php` | `POST /api/payments/counter` |
| `profile.php` | `GET /profile` · `GET /api/auth/me`, `GET /api/bookings/me` |
| `contact.php` | `GET /contact` · `POST /api/contact` |
| `feedback.php` | `GET /feedback` · `POST /api/feedback` |
| `about.php` / `terms.php` | `GET /about` / `GET /terms` (static) |
| header.php login/register modals | `GET /login`, `GET /register` · `POST /api/auth/login`, `/register`, `/logout` |

Admin (all behind `requireAdmin`, entity CRUD behind `requireSuperAdmin` where
legacy hid it from the scoped-admin sidebar — see "Fixes applied"):

| Legacy | New |
|---|---|
| `Admin/index.php`, `logout.php` | `/admin/login` · `POST /api/admin/auth/login`, `/logout` |
| `Admin/dashboard.php` | `/admin` · `GET /api/admin/dashboard/stats` |
| `Admin/*movie.php` | `/admin/movies` · `/api/admin/movies` |
| `Admin/*cinema.php` | `/admin/cinemas` · `/api/admin/cinemas` |
| `Admin/*show.php` | `/admin/shows` · `/api/admin/shows` |
| `Admin/*showtime.php`, `*genre.php`, `*industry.php`, `*language.php` | `/admin/catalog` · `/api/admin/{showtimes,genres,industries,languages}` |
| `Admin/*seat_reserved.php` | `/admin/seats` · `/api/admin/seats` |
| `Admin/*seat_details.php` | folded into booking editing — no separate route (see `server/src/routes/admin/seats.routes.ts` comment) |
| `Admin/*booking.php` | `/admin/bookings` · `/api/admin/bookings` |
| `Admin/*customer.php` | `/admin/customers` · `/api/admin/customers` (now `requireSuperAdmin`, see fixes) |
| `Admin/*contact.php` | `/admin/contacts` · `/api/admin/contacts` (now `requireSuperAdmin`) |
| `Admin/*feedback.php` | `/admin/feedback` · `/api/admin/feedback` (now `requireSuperAdmin`) |
| `Admin/*slider.php` | `/admin/sliders` · `/api/admin/sliders` |
| `Admin/*admin.php` | `/admin/admins` · `/api/admin/admins` (`requireSuperAdmin`) |

## Database

`server/prisma/schema.prisma` is the cleaned-up version of the schema
reconstructed in `legacy/PROJECT_REFERENCE.md` §5. Deliberate differences,
each called out with a comment at its point of use in the schema:

- **`SeatReservation` has a `@@unique([showId, seatNumber])` constraint** —
  closes the legacy double-booking gap (§9/§10.10: nothing checked whether a
  seat was already taken before inserting).
- **Passwords are hashed** (`passwordHash`, bcrypt) — legacy stored
  `customer.password` / `admin_users.password` in plaintext, compared with
  `==`.
- **Real foreign keys everywhere** (`onDelete: Cascade` where legacy did
  manual multi-table cleanup, e.g. `deleteshow.php`) — legacy had exactly one
  FK constraint in the whole schema (`admin_users.cinema_id`).
- **`AdminUser.role` + nullable `cinemaId`** replaces legacy's two-tier admin
  model (a literal hardcoded credential check in `Admin/index.php` for the
  super-admin, plus real `admin_users` rows for cinema-scoped admins).
  `cinemaId: null` = super-admin, same meaning as legacy's
  `admin_cinema_id == 0` sentinel, but every admin is now a real row.
- **`Feedback.rating` is a real `Int`** — legacy sent free-text strings
  `'1'/'3'/'4'/'5'` from the form (no `'2'` — a legacy UI gap, not enforced
  here).
- **Legacy's `seat_detail` table is gone** — it stored one comma-separated
  `seat_no` string per booking; that's now just `Booking.seatNumbers`
  directly, no separate table/join needed.
- **`total_amount` is unambiguous** — legacy's `DATABASE_UPDATES.sql` called
  this column `total_amnt` while every actual query used `total_amount`
  (§5); moot here since Prisma field names aren't hand-typed per query.

Run `npm run prisma:migrate --workspace=server` to create the schema, then
`npm run seed --workspace=server` to bootstrap the super-admin from
`SEED_SUPERADMIN_EMAIL`/`SEED_SUPERADMIN_PASSWORD` (replaces the hardcoded
`admin@gmail.com`/`admin1234` check in legacy `Admin/index.php`).

## Auth & authorization

- Both customer and admin sessions become a signed JWT in an **httpOnly
  cookie** (`access_token`), read by `server/src/middleware/auth.ts`'s
  `attachPrincipal`. Replaces legacy's two separate hand-rolled
  `$_SESSION` flag sets (`§8`).
- `requireCustomer` / `requireAdmin` / `requireSuperAdmin` middleware gate
  routes **centrally**, mounted once in `routes/admin/index.ts` rather than
  copy-checked per page. This directly fixes
  `legacy/PROJECT_REFERENCE.md` §10.6: several admin pages
  (`viewcustomer.php`, `viewcontact.php`, feedback pages) had **no**
  cinema-scoping or auth logic at all in legacy — they were only kept out of
  reach by being absent from the scoped-admin's sidebar, not by any
  server-side check. Here, customers/contacts/feedback/admins are
  `requireSuperAdmin` on the server, independent of what the client renders.
- `adminCinemaScope(req)` centralizes the "super-admin sees everything,
  cinema-admin sees only their cinema" filter legacy applied ad hoc per
  `view*.php` file.
- CSRF: none in legacy on any form. Mitigated here structurally — the SPA
  talks to the API over `fetch` with `credentials: "include"` and a strict
  `CLIENT_ORIGIN` CORS allowlist (`server/src/app.ts`) rather than
  browser-submitted `<form>` posts; add a double-submit CSRF token if
  cookie-based auth is ever exposed to a second origin.

## Business logic — deliberate fixes vs. legacy (per "fix opportunistically")

From `legacy/PROJECT_REFERENCE.md` §9/§10, to apply when implementing the
stubbed handlers:

1. **SQL injection** (§10.1) — moot by construction: every query goes
   through Prisma's parameterized query builder, no string-concatenated SQL
   anywhere.
2. **Plaintext passwords** (§10.2) — bcrypt hashing, see "Database" above.
3. **Hardcoded super-admin credentials** (§10.3) — real seeded row instead,
   see "Database" above.
4. **No CSRF protection** (§10.4) — see "Auth" above.
5. **Inconsistent output escaping / stored XSS** (§10.5) — moot by
   construction: React escapes all rendered text by default; nothing here
   uses `dangerouslySetInnerHTML`.
6. **Authorization gap on several admin pages** (§10.6) — fixed with
   centralized `requireSuperAdmin`, see "Auth" above.
7. **`Admin/addbooking.php`'s column-count-mismatch bug** (§10.7) — moot by
   construction: Prisma's typed `create()` replaces the hand-built `INSERT`.
8. **No real payment verification** (§10.8) — explicitly **not** fixed this
   round per the "keep simulate-only" decision; `payments.routes.ts` carries
   forward the same trust model legacy's `payment_success.php` used
   (session-bound re-validation, not a live gateway callback).
9. **No FK constraints** (§10.9) — fixed, see "Database" above.
10. **Double-booking of seats** (§10.10) — fixed via the `SeatReservation`
    unique constraint, see "Database" above. Implement the booking handler
    so a conflicting insert surfaces as a clean "seat taken" error, not a raw
    DB constraint violation.
11. **Dead/buggy `select_movie()` SQL syntax bug** (§10.11) — moot: `conn.php`
    isn't carried over at all.
12. **Ticket price drift** (§9) — legacy's server-side POST handler had a
    hardcoded `$total_amnt = 250 * $no_tikt` fallback that could disagree
    with the show's real `ticket_price`. Fix: `POST /api/bookings` must
    compute `totalAmount` server-side from `show.ticketPrice`, never trust a
    client-supplied total.
13. **No inventory decrement** (§9) — `Show.seatCapacity` is informational
    only in legacy; decide when implementing whether to enforce it against
    `SeatReservation` count or leave it informational (legacy never enforced
    it either way, so this isn't a correctness bug, just an option).

Kept as-is deliberately (not bugs, just simple-by-design and not worth
over-engineering for this app): free-text `duration`/`cast`/`ageRating`
instead of structured tables; "now showing" vs "coming soon" as a derived
`releaseDate` filter rather than a stored status; the fixed 4×10 seat grid
(`shared/src/index.ts`'s `SEAT_ROWS`/`SEATS_PER_ROW`) instead of a real
per-cinema seat map.

## Payments

Per the "keep simulate-only" decision, `server/src/routes/payments.routes.ts`
carries forward legacy's `esewa_payment.php` → `payment_success.php` /
`payment_failure.php` / `payment_counter.php` flow, including the real
HMAC-SHA256 signature construction from `legacy/esewa_config.php`'s test
credentials — but still ends in a "Simulate Success/Failure" choice rather
than an auto-submitted form to the live gateway. If this ever needs to go
live: replace the simulate endpoints with a real server-to-server signature
verification + status-check call to eSewa, per
`legacy/PROJECT_REFERENCE.md` §7's explicit warning that trusting
client-supplied GET params (legacy's actual behavior) is not safe to keep
even conceptually.

## Data migration

Handled by `scripts/migrate-data/` — see that folder's `README.md` for the
full table-by-table mapping, ordering, and how to run it. Short version: same
MySQL engine, id-remapped copy, passwords re-hashed from the plaintext
legacy stores (read once, in memory, during the migration run — never
written to disk). Images under `legacy/Images/` are a deliberate manual step,
not automated — see that README's "Not handled by this script" section.

## Suggested build order (next phase)

The routes/pages exist and are wired end-to-end (`app.ts` → `routes/index.ts`
→ each resource file) but return `501`. Reasonable implementation order:

1. `server/src/routes/auth.routes.ts` + `admin/auth.routes.ts` — nothing else
   is testable without login working.
2. `server/src/routes/movies.routes.ts`, `shows.routes.ts`, `cinemas.routes.ts`
   — read-only, unblocks the public browsing pages.
3. `server/src/routes/bookings.routes.ts` + `shows.routes.ts`'s
   `/:showId/seats` — the core flow; apply fixes #10 and #12 above here.
4. `server/src/routes/payments.routes.ts` — depends on bookings existing.
5. `server/src/routes/admin/*` — CRUD, in whatever order matches which admin
   screens are needed first (movies/shows are the highest-value ones since
   nothing can be booked without them).
6. Client pages, wired to the corresponding API routes as each lands.
7. Run `scripts/migrate-data/` against a real legacy database once the
   schema and seed are stable and you're ready to cut over.
