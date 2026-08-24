import { PrismaClient, type PaymentMethod, type PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import mysql from "mysql2/promise";

// See README.md for the full step-by-step explanation of what this does and
// why each transform exists. Short version: legacy MySQL (movie_ticket_booking,
// schema reconstructed in legacy/PROJECT_REFERENCE.md §5) -> new MySQL
// (mycinezone, server/prisma/schema.prisma), same engine, cleaned-up shape.

const legacyUrl = process.env.LEGACY_DATABASE_URL;
if (!legacyUrl) throw new Error("Set LEGACY_DATABASE_URL in scripts/migrate-data/.env");

const prisma = new PrismaClient();
const legacy = await mysql.createConnection(legacyUrl);

async function rows<T>(sql: string): Promise<T[]> {
  const [result] = await legacy.query(sql);
  return result as T[];
}

// legacy id -> new id, one map per entity, populated as we insert.
const genreMap = new Map<number, number>();
const industryMap = new Map<number, number>();
const languageMap = new Map<number, number>();
const cinemaMap = new Map<number, number>();
const showTimeMap = new Map<number, number>();
const movieMap = new Map<number, number>();
const customerMap = new Map<number, number>();
const showMap = new Map<number, number>();

async function migrateLookups() {
  for (const g of await rows<{ id: number; genre_name: string }>("SELECT id, genre_name FROM genre")) {
    const created = await prisma.genre.create({ data: { name: g.genre_name } });
    genreMap.set(g.id, created.id);
  }
  for (const i of await rows<{ id: number; industry_name: string }>("SELECT id, industry_name FROM industry")) {
    const created = await prisma.industry.create({ data: { name: i.industry_name } });
    industryMap.set(i.id, created.id);
  }
  for (const l of await rows<{ id: number; lang_name: string }>("SELECT id, lang_name FROM `language`")) {
    const created = await prisma.language.create({ data: { name: l.lang_name } });
    languageMap.set(l.id, created.id);
  }
  for (const c of await rows<{ id: number; name: string; location: string; city: string }>(
    "SELECT id, name, location, city FROM cinema",
  )) {
    const created = await prisma.cinema.create({ data: { name: c.name, location: c.location, city: c.city } });
    cinemaMap.set(c.id, created.id);
  }
  for (const t of await rows<{ id: number; time: string }>("SELECT id, time FROM show_time")) {
    const created = await prisma.showTime.create({ data: { label: t.time } });
    showTimeMap.set(t.id, created.id);
  }
  console.log(
    `Lookups: ${genreMap.size} genres, ${industryMap.size} industries, ${languageMap.size} languages, ${cinemaMap.size} cinemas, ${showTimeMap.size} showtimes`,
  );
}

type LegacyMovie = {
  id: number;
  name: string;
  movie_banner: string | null;
  movie_desc: string | null;
  rel_date: Date | null;
  industry_id: number | null;
  genre_id: number | null;
  lang_id: number | null;
  duration: string | null;
  director: string | null;
  cast: string | null;
  age_rating: string | null;
  landscape_img: string | null;
};

async function migrateMovies() {
  const movies = await rows<LegacyMovie>("SELECT * FROM movie");
  for (const m of movies) {
    const created = await prisma.movie.create({
      data: {
        name: m.name,
        description: m.movie_desc,
        posterPath: m.movie_banner,
        landscapePath: m.landscape_img,
        releaseDate: m.rel_date,
        duration: m.duration,
        director: m.director,
        cast: m.cast,
        ageRating: m.age_rating,
        genreId: m.genre_id != null ? (genreMap.get(m.genre_id) ?? null) : null,
        industryId: m.industry_id != null ? (industryMap.get(m.industry_id) ?? null) : null,
        languageId: m.lang_id != null ? (languageMap.get(m.lang_id) ?? null) : null,
      },
    });
    movieMap.set(m.id, created.id);
  }
  console.log(`Movies: ${movieMap.size}`);
}

type LegacyCustomer = {
  id: number;
  fullname: string;
  email: string;
  cellno: string | null;
  gender: string | null;
  password: string;
};

async function migrateCustomers() {
  const customers = await rows<LegacyCustomer>("SELECT * FROM customer");
  for (const c of customers) {
    const passwordHash = await bcrypt.hash(c.password, 12);
    const created = await prisma.customer.create({
      data: {
        fullName: c.fullname,
        email: c.email,
        phone: c.cellno,
        gender: c.gender,
        passwordHash,
      },
    });
    customerMap.set(c.id, created.id);
  }
  console.log(`Customers: ${customerMap.size}`);
}

type LegacyShow = {
  id: number;
  movie_id: number;
  show_date: Date;
  show_time_id: number;
  no_seat: number;
  cinema_id: number;
  ticket_price: string;
};

async function migrateShows() {
  const shows = await rows<LegacyShow>("SELECT * FROM `show`");
  for (const s of shows) {
    const movieId = movieMap.get(s.movie_id);
    const cinemaId = cinemaMap.get(s.cinema_id);
    const showTimeId = showTimeMap.get(s.show_time_id);
    if (!movieId || !cinemaId || !showTimeId) {
      console.warn(`Skipping show ${s.id}: dangling reference (movie/cinema/showtime not migrated)`);
      continue;
    }
    const created = await prisma.show.create({
      data: {
        movieId,
        cinemaId,
        showTimeId,
        showDate: s.show_date,
        seatCapacity: s.no_seat,
        ticketPrice: s.ticket_price,
      },
    });
    showMap.set(s.id, created.id);
  }
  console.log(`Shows: ${showMap.size}`);
}

async function migrateSeatReservations() {
  const seats = await rows<{ id: number; show_id: number; cust_id: number; seat_number: string }>(
    "SELECT id, show_id, cust_id, seat_number FROM seat_reserved",
  );
  let migrated = 0;
  for (const s of seats) {
    const showId = showMap.get(s.show_id);
    const customerId = customerMap.get(s.cust_id);
    if (!showId || !customerId) continue;
    // A show's seats can legitimately collide if legacy already double-booked
    // one (the exact bug this schema's unique constraint now prevents going
    // forward, PROJECT_REFERENCE.md §10.10) — skip silently rather than crash
    // the whole migration on historical data.
    await prisma.seatReservation
      .create({ data: { showId, customerId, seatNumber: s.seat_number } })
      .then(() => migrated++)
      .catch(() => console.warn(`Skipping duplicate seat ${s.seat_number} on show ${showId} (pre-existing legacy double-booking)`));
  }
  console.log(`Seat reservations: ${migrated}/${seats.length}`);
}

async function migrateBookings() {
  const seatDetails = new Map<number, string>();
  for (const sd of await rows<{ id: number; seat_no: string }>("SELECT id, seat_no FROM seat_detail")) {
    seatDetails.set(sd.id, sd.seat_no);
  }

  type LegacyBooking = {
    id: number;
    cust_id: number;
    show_id: number;
    no_ticket: number;
    seat_dt_id: number | null;
    booking_date: Date;
    total_amount: string;
    payment_status: string;
    payment_method: string;
    transaction_id: string | null;
    payment_date: Date | null;
  };

  const paymentStatusMap: Record<string, PaymentStatus> = {
    pending: "PENDING",
    completed: "COMPLETED",
    failed: "FAILED",
  };
  const paymentMethodMap: Record<string, PaymentMethod> = {
    counter: "COUNTER",
    esewa: "ESEWA",
  };

  const bookings = await rows<LegacyBooking>("SELECT * FROM booking");
  let migrated = 0;
  for (const b of bookings) {
    const customerId = customerMap.get(b.cust_id);
    const showId = showMap.get(b.show_id);
    if (!customerId || !showId) {
      console.warn(`Skipping booking ${b.id}: dangling customer/show reference`);
      continue;
    }
    const seatNumbers = (b.seat_dt_id != null ? seatDetails.get(b.seat_dt_id) : undefined) ?? "";
    await prisma.booking.create({
      data: {
        customerId,
        showId,
        ticketCount: b.no_ticket,
        seatNumbers,
        totalAmount: b.total_amount,
        paymentStatus: paymentStatusMap[b.payment_status] ?? "PENDING",
        paymentMethod: paymentMethodMap[b.payment_method] ?? "COUNTER",
        transactionId: b.transaction_id,
        paymentDate: b.payment_date,
        bookingDate: b.booking_date,
      },
    });
    migrated++;
  }
  console.log(`Bookings: ${migrated}/${bookings.length}`);
}

async function migrateContactAndFeedbackAndSlider() {
  const contacts = await rows<{ name: string; email: string; num: string | null; msg: string; msg_date: Date | null }>(
    "SELECT name, email, num, msg, msg_date FROM contact",
  );
  for (const c of contacts) {
    await prisma.contact.create({
      data: { name: c.name, email: c.email, phone: c.num, message: c.msg, createdAt: c.msg_date ?? new Date() },
    });
  }

  const feedback = await rows<{
    name: string;
    email: string | null;
    phone: string | null;
    message: string;
    rating: string | null;
    submitted_date: Date | null;
  }>("SELECT name, email, phone, message, rating, submitted_date FROM feedback");
  for (const f of feedback) {
    const rating = Number.parseInt(f.rating ?? "", 10);
    await prisma.feedback.create({
      data: {
        name: f.name,
        email: f.email,
        phone: f.phone,
        message: f.message,
        rating: Number.isFinite(rating) ? rating : 5,
        createdAt: f.submitted_date ?? new Date(),
      },
    });
  }

  const sliders = await rows<{ img_path: string; alt: string | null }>("SELECT img_path, alt FROM slider");
  for (const s of sliders) {
    await prisma.slider.create({ data: { imageUrl: s.img_path, altText: s.alt } });
  }

  console.log(`Contacts: ${contacts.length}, Feedback: ${feedback.length}, Sliders: ${sliders.length}`);
}

async function migrateAdminUsers() {
  const admins = await rows<{ id: number; username: string; email: string; password: string; cinema_id: number }>(
    "SELECT id, username, email, password, cinema_id FROM admin_users",
  );
  let migrated = 0;
  for (const a of admins) {
    const cinemaId = cinemaMap.get(a.cinema_id);
    if (!cinemaId) {
      console.warn(`Skipping admin_users ${a.id} (${a.email}): dangling cinema reference`);
      continue;
    }
    const passwordHash = await bcrypt.hash(a.password, 12);
    await prisma.adminUser.create({
      data: { username: a.username, email: a.email, passwordHash, role: "CINEMA_ADMIN", cinemaId },
    });
    migrated++;
  }
  console.log(`Cinema admins: ${migrated}/${admins.length} (super-admin bootstrapped separately by prisma/seed)`);
}

async function main() {
  await migrateLookups();
  await migrateMovies();
  await migrateCustomers();
  await migrateShows();
  await migrateSeatReservations();
  await migrateBookings();
  await migrateContactAndFeedbackAndSlider();
  await migrateAdminUsers();
  console.log("Data migration complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await legacy.end();
    await prisma.$disconnect();
  });
