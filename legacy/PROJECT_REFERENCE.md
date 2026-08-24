# Online Movie Ticket Booking — Full Project Reference

> Purpose of this document: a complete, self-contained technical snapshot of this
> project, written so that another AI (or developer) with **zero prior context**
> can use it to plan and execute a migration to a different tech stack — without
> having to re-read every PHP file first. It documents current behavior
> (including bugs and security holes) as-is; it does not prescribe a target
> architecture, since that depends on what stack you're migrating to.

Generated: 2026-08-24. Project name in-app: **MyCineZone**.

---

## 1. What this app does

A student-built movie-ticket booking website for a fictional Nepal-based
cinema chain ("MyCineZone"), with two surfaces:

- **Public site** (project root `/`): browse movies (now showing / coming
  soon / search), view movie details, register/login as a customer, book
  tickets against a specific show + cinema + seats, pay via a simulated
  eSewa flow or "pay at counter", leave feedback, submit a contact form,
  view own profile.
- **Admin panel** (`/Admin/`): a session-gated back office with full CRUD
  over every entity (movies, shows, cinemas, genres, industries, languages,
  showtimes, customers, bookings, seat records, contact messages, feedback,
  homepage slider images, and cinema-scoped admin accounts). Supports a
  **super-admin** (sees/edits everything) and **cinema-scoped admins** (see
  only their own cinema's shows/bookings).

There is no API layer, no SPA, no build step — every page is a server-rendered
`.php` file that mixes HTML, inline `<style>`, inline `<script>`, and raw SQL
in one file. Navigation is plain `<a href="page.php">` links; forms `POST` to
themselves or to a sibling `.php` file.

---

## 2. Current tech stack

| Layer | Technology |
|---|---|
| Language / runtime | PHP (procedural style, no framework). Tested/run here on PHP 8.2. |
| Database | MySQL, accessed via the `mysqli` extension (object-oriented style: `new mysqli(...)`). Database name: `movie_ticket_booking`. |
| Web server | Apache (`mod_php` / `php:*-apache` style deployment). No `.htaccess` routing rules — every URL maps 1:1 to a `.php` file on disk. |
| Frontend | Server-rendered HTML + Bootstrap 4.3.1 + jQuery 3.3.1 + Popper.js 1.14.7 + Font Awesome 4.7.0 — **all loaded from public CDNs**, no local copies, no npm/yarn, no bundler. |
| Sessions/auth | PHP native sessions (`session_start()`, `$_SESSION`), cookie `PHPSESSID`. No password hashing — plaintext passwords stored and compared with `==`/`===`. No CSRF tokens anywhere. |
| File storage | Local filesystem under `Images/` (movie posters/banners, landscape images) and `images/` (slider banners — note the **inconsistent casing** between the two, which matters if you ever deploy on a case-sensitive filesystem like Linux; on this Windows dev box it "just works" by accident). Uploads handled with plain `move_uploaded_file()`. |
| Payments | eSewa (Nepali payment gateway) — **scaffolded, not actually wired to the live gateway**. See §7. |
| Dependency management | None. No `composer.json`, no `package.json`. Everything is hand-written or a `<script src="https://...">` CDN tag. |
| Config | Hardcoded in PHP files (DB credentials in `conn.php`, eSewa test keys in `esewa_config.php`, super-admin credentials hardcoded in `Admin/index.php`). No `.env` file, no environment-variable usage anywhere. |

There is **no schema.sql / migrations directory in the repo** — the only
shipped SQL is `DATABASE_UPDATES.sql`, which is an *incremental* patch (adds
payment columns to `booking`, creates `admin_users`). The full schema in §5
below was **reverse-engineered from the PHP source** (every `INSERT`/`SELECT`
statement across the codebase) and confirmed working by actually standing up
MySQL + Apache/PHP in Docker and running the app's core flows end-to-end
(home page render, customer login, full seat-booking flow with real DB
writes, admin login, admin dashboard counts). Treat §5 as accurate but
derived, not as an original artifact of the project.

---

## 3. Directory / file inventory

```
/ (site root, served as web root)
├── conn.php                 DB connection class `connec` (see §6) — included by nearly every page
├── header.php                Site <head>+navbar+Register/Login modals, shared by all public pages.
│                              Handles: customer login POST, customer registration POST.
├── footer.php                Site </body> close, shared footer markup + CDN <script> tags.
├── index.php                 Home page: slider (from `slider` table), search box, "Now Showing"
│                              (movies with rel_date in the last month) and "Coming Soon" grids.
├── nowshowing.php             Standalone "Now Showing" listing (movies releasing in the last month),
│                              dark-themed, shows industry/language/genre per movie.
├── commingsoon.php             Standalone "Coming Soon" listing (rel_date > today).
├── movie_details.php          Single movie detail page (`?movie_id=`), joins genre/industry/language.
├── booking.php                 THE core booking flow: seat picker UI + POST handler that inserts into
│                              `seat_reserved`, `seat_detail`, and `booking`, then shows a payment-method
│                              modal (eSewa vs Counter). Requires customer to be logged in.
├── esewa_payment.php            Builds the eSewa gateway form (HMAC-SHA256 signature) but does NOT
│                              auto-submit it — presents "Simulate Success" / "Simulate Failure" links
│                              instead. See §7.
├── payment_success.php          Handles return from eSewa (or the simulate-success link): verifies
│                              transaction_uuid + amount against session, marks booking completed.
├── payment_failure.php          Handles failed/cancelled eSewa payment: marks booking failed.
├── payment_counter.php          Handles "Pay at Counter" choice: marks booking pending/counter,
│                              shows an instructions page.
├── profile.php                 Logged-in customer's own profile (read-only view of `customer` row).
├── contact.php                  Public contact form → inserts into `contact`.
├── feedback.php                  Public feedback form (star-style rating 1/3/4/5) → inserts into `feedback`.
├── about.php / terms.php        Static marketing/legal content pages.
├── esewa_config.php              eSewa test/prod constants (gateway URL, merchant code, secret key,
│                              callback URLs built from `$_SERVER['HTTP_HOST']`).
├── style.css                     Empty file (0 bytes) — all styling is inline `<style>` blocks per page.
├── DATABASE_UPDATES.sql          Incremental SQL patch (payment_* columns on booking, admin_users table).
├── ESEWA_INTEGRATION_GUIDE.md    Human-written doc describing the eSewa integration & test credentials.
├── IMPLEMENTATION_SUMMARY.txt    Human-written summary of the eSewa integration work.
├── README.md                      Repo readme; documents the admin_users feature added Feb 2026.
├── Images/                        Uploaded/static images: movie banners (`Images/`), landscape banners
│                              (`Images/landscape/`), plus site art (logo, background photos).
│
└── Admin/                        Admin back office (session-gated on `$_SESSION["admin_username"]`)
    ├── index.php                Admin login page + handler. Hardcoded super-admin
    │                              (admin@gmail.com / admin1234, admin_cinema_id = 0 = "no restriction").
    │                              Falls back to looking up `admin_users` by email+password for
    │                              cinema-scoped admins.
    ├── logout.php                 session_destroy() → redirect to login.
    ├── dashboard.php               Stat cards (movie/booking/customer/cinema counts, booking count
    │                              cinema-filtered for scoped admins) + quick-action links.
    ├── admin_header.php / admin_footer.php / admin_sidenavbar.php
    │                              Shared admin chrome. Sidenav hides Admins/Cinema/Contact/Customer/
    │                              Feedback links from cinema-scoped admins (super-admin only).
    │
    ├── add<entity>.php / edit<entity>.php / view<entity>.php / delete<entity>.php
    │   — one uniform CRUD quartet per entity, for:
    │     admin (admin_users), booking, cinema, contact, customer, feedback, genre,
    │     industry, language, movie, seat_details (seat_detail table), seat_reserved,
    │     show (the `show` table), showtime (show_time table), slider
    │
    │   Pattern per quartet (deviations noted):
    │     - view*.php  : SELECT (often a JOIN for human-readable names) + HTML table + Edit/Delete links.
    │                    view*.php for booking/show/seat_details/seat_reserved apply a
    │                    `WHERE cinema_id = $_SESSION['admin_cinema_id']` filter when the logged-in
    │                    admin is cinema-scoped (admin_cinema_id > 0).
    │     - add*.php   : renders a form; on POST builds `INSERT INTO <table> VALUES(0, ...)` (the
    │                    literal `0` is a placeholder consumed by AUTO_INCREMENT) and redirects to
    │                    view*.php. addmovie.php also handles two file uploads (banner + landscape
    │                    image) via move_uploaded_file(). addslider.php handles one file upload.
    │     - edit*.php  : loads a row by `?id=`, pre-fills the form, on POST runs an `UPDATE ... SET`.
    │     - delete*.php: deletes by `?id=`, sometimes after manually deleting dependent rows first
    │                    (deleteshow.php deletes dependent booking/seat_detail/seat_reserved rows
    │                    before deleting the show; deletebooking.php frees the related seat rows).
    │
    │   ⚠ KNOWN BUG: Admin/addbooking.php's raw SQL for `seat_detail` and `booking` omits the leading
    │   `0`/id placeholder that every other add*.php uses, and does not list explicit column names
    │   (unlike the customer-facing booking.php, which does list columns and works correctly). This
    │   causes a MySQL column-count mismatch error at insert time. This is a pre-existing bug in the
    │   app as received — flagging it here rather than "fixing" it silently.
    └── (35 files total following the pattern above — see `Admin/` listing for exact filenames)
```

---

## 4. Routing model

There is no router. Every `.php` file **is** a URL (Apache serves files
directly). Query strings are used for record identifiers (`?id=5`,
`?movie_id=3`), never for path segments. A migration to a framework with a
real router should map each file above 1:1 to a route, e.g.:

- `GET /` → home / movie listing
- `GET /movies/:id` → `movie_details.php?movie_id=`
- `GET|POST /booking` → `booking.php`
- `GET /admin` → `Admin/index.php` (login)
- `GET /admin/dashboard`, `/admin/movies`, `/admin/movies/new`,
  `/admin/movies/:id/edit`, `/admin/movies/:id` (delete) → the
  `view/add/edit/delete` quartets under `Admin/`

---

## 5. Database schema (reconstructed, verified working)

Connect as: host `localhost` (see §6 for a caveat on this), user `root`,
password *(empty string)*, database `movie_ticket_booking`.

```sql
SET NAMES utf8mb4;

CREATE TABLE `genre` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `genre_name` VARCHAR(100) NOT NULL
);

CREATE TABLE `industry` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `industry_name` VARCHAR(100) NOT NULL
);

CREATE TABLE `language` (                 -- reserved word: always backticked in queries
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lang_name` VARCHAR(100) NOT NULL
);

CREATE TABLE `cinema` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL
);

CREATE TABLE `show_time` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `time` VARCHAR(50) NOT NULL           -- free-text label, e.g. "7:00 PM" — not a TIME column
);

CREATE TABLE `movie` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `movie_banner` VARCHAR(255) DEFAULT NULL,      -- portrait poster, path under Images/
  `movie_desc` TEXT,
  `rel_date` DATE DEFAULT NULL,
  `industry_id` INT DEFAULT NULL,        -- FK to industry.id (no constraint enforced)
  `genre_id` INT DEFAULT NULL,           -- FK to genre.id (no constraint enforced)
  `lang_id` INT DEFAULT NULL,            -- FK to language.id (no constraint enforced)
  `duration` VARCHAR(50) DEFAULT NULL,   -- free text, e.g. "2h 15m"
  `director` VARCHAR(255) DEFAULT NULL,
  `cast` VARCHAR(500) DEFAULT NULL,      -- comma-separated names, single column
  `age_rating` VARCHAR(10) DEFAULT NULL, -- free text, e.g. "PG-13"
  `landscape_img` VARCHAR(255) DEFAULT NULL      -- wide banner, path under Images/landscape/
);

CREATE TABLE `show` (                    -- reserved word: always backticked in queries
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `movie_id` INT DEFAULT NULL,           -- FK to movie.id
  `show_date` DATE DEFAULT NULL,
  `show_time_id` INT DEFAULT NULL,       -- FK to show_time.id
  `no_seat` INT DEFAULT NULL,            -- total seat capacity for this show (not decremented anywhere)
  `cinema_id` INT DEFAULT NULL,          -- FK to cinema.id — this is what scopes cinema-admins
  `ticket_price` DECIMAL(10,2) DEFAULT NULL
);

CREATE TABLE `customer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,  -- login identifier
  `cellno` VARCHAR(50) DEFAULT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,     -- 'male' | 'female' | 'others' from a radio group
  `password` VARCHAR(255) NOT NULL       -- ⚠ stored PLAINTEXT, compared with ==
);

CREATE TABLE `seat_reserved` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `show_id` INT DEFAULT NULL,
  `cust_id` INT DEFAULT NULL,
  `seat_number` VARCHAR(20) DEFAULT NULL,   -- e.g. "R1S1" (Row 1 Seat 1) — generated client-side
  `reserved` TINYINT(1) DEFAULT 0           -- written as 0 on every booking; admin UI reads 0 as
                                             -- "Already Booked" and non-zero as "Available" (inverted
                                             -- label logic worth noting if you carry it forward)
);

CREATE TABLE `seat_detail` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cust_id` INT DEFAULT NULL,
  `show_id` INT DEFAULT NULL,
  `seat_no` VARCHAR(255) DEFAULT NULL       -- comma-separated seat list for the whole booking,
                                             -- e.g. "R1S1, R1S2" (NOT one row per seat)
);

CREATE TABLE `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cust_id` INT DEFAULT NULL,
  `show_id` INT DEFAULT NULL,
  `no_ticket` INT DEFAULT NULL,
  `seat_dt_id` INT DEFAULT NULL,            -- FK to seat_detail.id
  `booking_date` DATE DEFAULT NULL,
  `total_amount` DECIMAL(10,2) DEFAULT NULL,-- ⚠ note: DATABASE_UPDATES.sql calls this column
                                             -- `total_amnt` — that name is STALE/wrong; every actual
                                             -- query in the codebase (booking.php, Admin/*booking.php,
                                             -- payment_*.php) uses `total_amount`. Trust the code, not
                                             -- that one file.
  `payment_status` VARCHAR(50) DEFAULT 'pending',   -- 'pending' | 'completed' | 'failed'
  `payment_method` VARCHAR(50) DEFAULT 'counter',   -- 'counter' | 'esewa'
  `transaction_id` VARCHAR(255) DEFAULT NULL,       -- present in schema, never actually written to
  `payment_date` DATETIME DEFAULT NULL              -- present in schema, never actually written to
);

CREATE TABLE `contact` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `num` VARCHAR(50) DEFAULT NULL,
  `msg` TEXT,
  `msg_date` DATETIME DEFAULT NULL
);

CREATE TABLE `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `message` TEXT,
  `rating` VARCHAR(10) DEFAULT NULL,        -- customer-facing form sends '5'/'4'/'3'/'1' (note: no '2')
  `submitted_date` DATETIME DEFAULT NULL
);

CREATE TABLE `slider` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `img_path` VARCHAR(255) NOT NULL,         -- full relative path incl. "images/" prefix, saved as-is
  `alt` VARCHAR(255) DEFAULT NULL
);

CREATE TABLE `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,   -- login identifier
    `password` VARCHAR(255) NOT NULL,       -- ⚠ plaintext, compared with real_escape_string'd equality
    `cinema_id` INT NOT NULL,
    FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(`id`) ON DELETE CASCADE
    -- this is the ONLY foreign key constraint anywhere in the schema
);
```

### Entity relationships (informal — no FKs enforce these except admin_users.cinema_id)

```
industry ─┐
genre    ─┼─< movie >─┐
language ─┘           │
                       │
cinema ─┐              │
show_time ─┼─< `show` ─┘
                │
                ├─< seat_reserved  (one row per individual seat)
                ├─< seat_detail    (one row per booking; seat_no is a CSV of seats)
                └─< booking  (references seat_detail.id via seat_dt_id)

customer ─< booking, seat_detail, seat_reserved, (login only, no FK)

cinema ─< admin_users   (real FK, ON DELETE CASCADE)
cinema ─< `show`        (informal only)
```

### Sample seed data used during local verification

Genres (Action/Comedy/Drama/Sci-Fi/Horror), industries
(Hollywood/Bollywood/Kollywood), languages (English/Hindi/Nepali), 4 cinemas
(CineBliss, Cinema Grand, QFX Dreamscape, CinePlus), 5 showtimes, 5 sample
movies with shows, one demo customer (`demo@example.com` / `demo1234`), and
the cinema-admin rows documented in `README.md` (`cinebliss@example.com` /
`pass123`, etc., against `cinema_id` 1–4). Not part of the app's real data —
purely for smoke-testing the flows.

---

## 6. `conn.php` — the data access layer

Everything routes through one small class, `connec`, in `conn.php`:

```php
class connec {
    public $username = "root";
    public $password = "";
    public $server_name = "localhost";
    public $db_name = "movie_ticket_booking";
    public $conn;   // the mysqli instance

    function __construct() { $this->conn = new mysqli(...); }

    select_all($table)                 // SELECT * FROM `$table`
    select_show_dt()                   // the big show+movie+time+cinema JOIN used by booking.php
    select_movie($table, $date)        // "comingsoon" vs "now showing" filter (has a real bug: the
                                        // comingsoon branch's SQL is `WHERE rel_date > row` — `row` is
                                        // not a valid column/keyword; every real caller in the codebase
                                        // instead calls select_by_query() directly with correct SQL, so
                                        // this method appears effectively dead/unused in practice)
    select_by_query($query)            // raw passthrough — used constantly, no parameterization
    select($table, $id)                // SELECT * FROM `$table` WHERE id=$id  (int concatenated raw)
    select_login($table, $email)       // SELECT * FROM `$table` WHERE email='$email' (raw concatenation)
    insert($query, $msg)                // runs $query, then `echo '<script>alert("$msg")</script>'`
    update($query, $msg)                // same alert-on-success pattern
    delete($table, $id)                  // DELETE FROM `$table` WHERE id=$id
    insert_lastid($query)                // runs $query, returns mysqli_insert_id()
}
```

Nearly every page does `require_once("conn.php"); $conn = new connec();`
then calls one of the above. **This is the layer a migration needs to
replace with a real ORM/query builder + parameterized queries.**

**Runtime gotcha (Docker/containerized deployments only):** with
`server_name = "localhost"`, PHP's `mysqli` always attempts a Unix domain
socket connection rather than TCP — this fails if the app and DB run in
separate containers even on a shared network, because they don't share a
filesystem/socket namespace. The fix used during local verification was
changing this to `"127.0.0.1"` to force TCP. On a traditional single-host
LAMP/XAMPP setup, `"localhost"` is fine as shipped. **This file currently has
`"localhost"` in the working tree** (the value was reverted back after the
temporary Docker-based test run) — a stack migration should replace this
whole class anyway, so treat this only as a note on *why* you might see one
value or the other in history.

---

## 7. Payment integration (eSewa) — current state is a scaffold, not live

- `esewa_payment.php` builds a real eSewa v2 form (amount, transaction UUID,
  HMAC-SHA256 signature over `total_amount,transaction_uuid,product_code`
  using a **test** merchant secret hardcoded in `esewa_config.php`), but the
  `<form>` is **not auto-submitted** — the page instead shows two manual
  links: "✅ Simulate Success" and "❌ Simulate Failure", which just navigate
  to `payment_success.php` / `payment_failure.php` with fabricated query
  params matching what eSewa would send back.
- `payment_success.php` re-validates `transaction_uuid` and `total_amount`
  against what was stashed in `$_SESSION` before "payment", then sets
  `booking.payment_status = 'completed'`, `payment_method = 'esewa'`.
- `payment_failure.php` sets `payment_status = 'failed'`.
- `payment_counter.php` is the "pay in person" path: sets
  `payment_status = 'pending'`, `payment_method = 'counter'`, shows an
  instructions screen with the booking summary.
- Test credentials (never used against a live account, per
  `ESEWA_INTEGRATION_GUIDE.md`): eSewa ID `9806800001`–`9806800005`,
  password `Nepal@123`, MPIN `1122`, merchant code `EPAYTEST`, secret
  `8gBm/:&EnhH.1/q`, gateway `https://uat.esewa.com.np/api/epay/main/v2/form`.
- **For migration**: if the new stack needs real payments, this needs a
  genuine server-to-server signature verification and status-check call to
  eSewa (or whatever gateway is chosen) — the current implementation trusts
  client-supplied GET params for "success", which would not be safe to keep
  as-is even conceptually.

---

## 8. Auth / session model

Two entirely separate, hand-rolled session schemes coexist:

**Customer session** (set in `header.php` on successful login POST):
- `$_SESSION["username"]` — customer's `fullname` (used for "Hello, X" and as the logged-in flag)
- `$_SESSION["cust_id"]` — customer's `id`
- Logout: `index.php?action=logout` → `session_destroy()`

**Admin session** (set in `Admin/index.php`):
- `$_SESSION["admin_username"]` — used everywhere as the "is an admin logged in" flag
- `$_SESSION["admin_cinema_id"]` — `0` for the super-admin (no restriction), otherwise the
  specific `cinema.id` this admin is scoped to; used to filter bookings/shows/seat views
- `$_SESSION["admin_email"]` — only set for `admin_users`-backed logins, not for the
  hardcoded super-admin
- Logout: `Admin/logout.php` → `session_destroy()`

**Super-admin** is not a database row — it's a literal `if` check in
`Admin/index.php`: email `admin@gmail.com`, password `admin1234`, hardcoded
in source. Cinema-scoped admins are real rows in `admin_users`, looked up by
`SELECT * FROM admin_users WHERE email='...' AND password='...'` (escaped
via `real_escape_string`, but still a plaintext-password equality check, and
still string-built SQL rather than a prepared statement).

There is no role/permission table beyond "is cinema_id 0 or not" — the
sidenav (`Admin/admin_sidenavbar.php`) just hides certain `<a>` links (not
the underlying pages) from scoped admins based on that one flag. **The
underlying view*.php files themselves also apply the cinema filter**, so
it's not purely cosmetic, but there's no server-side check stopping a scoped
admin from directly navigating to, say, `viewcustomer.php` — that page has
no cinema-scoping logic at all and isn't hidden by an auth check, only by
being absent from their sidebar link list. **Treat this as a genuine
authorization gap to close in any rebuild**, not just a UI nicety to
replicate.

---

## 9. Business logic notes worth preserving (or deliberately fixing) on migration

- **Seat identifiers** are strings like `R1S1`…`R4S10` (4 rows × 10 seats =
  40 seats), generated entirely client-side in `booking.php`'s JavaScript —
  there is no server-side seat map/layout table. A show's actual capacity
  (`show.no_seat`) is disconnected from this fixed 40-seat grid.
- **Ticket price**: `booking.php`'s server-side POST handler still uses a
  hardcoded `$total_amnt = 250 * $no_tikt` fallback in the PHP calculation,
  while the on-page JS total display correctly reads the per-show
  `ticket_price`. In practice the seed/tested data used ticket_price=250 for
  the show that was booked, so this discrepancy didn't surface during
  verification — but it means **the amount actually charged/stored may not
  match the show's real ticket price** for shows priced differently. Worth a
  deliberate fix, not a silent carry-over, in any rewrite.
- **No seat-conflict check**: booking a seat only ever inserts into
  `seat_reserved`; nothing queries "is `R2S3` for `show_id=7` already taken"
  before allowing the insert. Two customers can book the same seat.
- **No inventory decrement**: `show.no_seat` is set once at show creation
  and never decremented as bookings come in.
- Cast/crew, duration, age rating are all **free-text strings**, not
  structured data (no separate `person`/`cast_member` table).
- Movie "now showing" vs "coming soon" is a **derived date filter**
  (`rel_date <= CURDATE() AND rel_date + 1 month > CURDATE()` vs
  `rel_date > CURDATE()`), not a stored status flag.

---

## 10. Known bugs / security issues (flag these to whoever plans the rewrite)

1. **SQL injection**: the overwhelming majority of queries string-concatenate
   `$_POST`/`$_GET` values directly (e.g. every `add*.php`/`edit*.php` in
   `Admin/`, `index.php`'s search box, `profile.php`). A small minority of
   newer code paths use `real_escape_string()` (booking.php's seat insert,
   `Admin/addadmin.php`, `Admin/index.php`'s admin lookup) but this is the
   exception, not the rule.
2. **Plaintext passwords**, both `customer.password` and
   `admin_users.password`, compared with `==`/`===` or raw SQL equality —
   no hashing anywhere (`password_hash`/`password_verify` are never used).
3. **Hardcoded super-admin credentials** in source (`Admin/index.php`):
   `admin@gmail.com` / `admin1234`.
4. **No CSRF protection** on any form (login, registration, booking, all
   admin CRUD).
5. **Inconsistent output escaping** — some templates use `htmlspecialchars()`
   on DB-sourced values, most don't, so stored XSS is plausible anywhere an
   admin-entered field (movie name, cinema name, feedback message, contact
   message) is echoed back into a customer-facing or admin page.
6. **Authorization gap**: cinema-scoped admin restriction is enforced
   per-page (where implemented) rather than centrally, and several
   admin pages (e.g. `viewcustomer.php`, `viewcontact.php`) have no
   cinema-scoping logic at all — they're just not linked from the scoped
   admin's sidebar.
7. **`Admin/addbooking.php` bug**: raw `INSERT` statements for
   `seat_detail`/`booking` omit the id placeholder/column list that every
   sibling `add*.php` uses, causing a column-count mismatch at runtime (see
   §3). Not fixed here; flagged for whoever migrates/maintains this.
8. **No real payment verification** — see §7.
9. **No FK constraints** anywhere except `admin_users.cinema_id`, so
   referential integrity is only as good as each individual delete-handler's
   manual cleanup (some are thorough, e.g. `deleteshow.php`; others aren't).
10. **Double-booking of seats** possible — see §9.
11. `conn.php`'s `select_movie($table, $date)` "coming soon" branch contains
    a SQL syntax bug (`WHERE rel_date > row`) — appears to be dead code since
    nothing in the app actually calls this method with `$date == "comingsoon"`
    (real callers use `select_by_query()` with correct SQL instead), but
    would throw if ever invoked.

---

## 11. External/CDN dependencies (exact versions, for parity if rebuilding the UI)

- jQuery 3.3.1 (`code.jquery.com`) — full build on public pages, slim build in admin/footer
- Bootstrap 4.3.1 CSS + JS (`stackpath.bootstrapcdn.com`)
- Popper.js 1.14.7 (`cdnjs.cloudflare.com`) — required by Bootstrap 4's dropdowns/modals
- Font Awesome 4.7.0 (`cdnjs.cloudflare.com`) — icons throughout (nav, buttons, floating feedback button)

No local `node_modules`, no bundler config, no `style.css` content (the file
exists but is empty — everything is inline `<style>` per page).

---

## 12. Environment / secrets inventory

| Name | Where | Value (as shipped) |
|---|---|---|
| DB host | `conn.php` | `localhost` |
| DB user | `conn.php` | `root` |
| DB password | `conn.php` | *(empty string)* |
| DB name | `conn.php` | `movie_ticket_booking` |
| Super-admin email/password | `Admin/index.php` | `admin@gmail.com` / `admin1234` |
| eSewa test merchant code | `esewa_config.php` | `EPAYTEST` |
| eSewa test secret key | `esewa_config.php` | `8gBm/:&EnhH.1/q` |
| eSewa gateway URL (test) | `esewa_config.php` | `https://uat.esewa.com.np/api/epay/main/v2/form` |

All of the above are plaintext in version control today — a migration is a
natural point to move these to real environment variables/secrets
management.

---

## 13. What "running this today" requires (for reference)

No PHP or MySQL is installed on the host this was last verified on; it was
run via two Docker containers — a `mysql:8.0` container and a
`php:8.2-apache` container (with the `mysqli` extension installed via
`docker-php-ext-install mysqli`) sharing a network namespace
(`--network container:<mysql-container>`), with the repo directory bind-mounted
as the Apache web root. `conn.php`'s DB host had to be switched to `127.0.0.1`
for that specific container topology (see §6) — that change is not
otherwise required on a normal single-host LAMP/XAMPP install.

---

## 14. Suggested inputs to give a migration-planning AI

If you paste this whole file to another model and ask "help me migrate this
to `<X>`", the useful follow-up context to also give it is:

- Which target stack (framework, DB, hosting) you're moving to
- Whether you want to **preserve current behavior exactly** (including the
  bugs in §10) or **fix issues opportunistically** during the rewrite
- Whether real eSewa payment processing needs to go live, or the
  simulate-only flow is fine to keep for now
- Whether the existing MySQL data (if any is in production use) needs a
  real migration/export, or whether starting fresh is acceptable
