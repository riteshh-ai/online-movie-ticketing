import type {
  AdminUserDto,
  BookingDto,
  CinemaDto,
  ContactDto,
  CustomerDto,
  DashboardStatsDto,
  FeedbackDto,
  LookupDto,
  MovieDto,
  SeatMapDto,
  ShowDto,
  SliderDto,
} from "@mycinezone/shared";
import { apiFetch } from "./client";

export { assetUrl } from "./client";
export { ApiError } from "./client";

type ShowWithMovieName = ShowDto & { movieName: string };
type SeatRow = { id: number; showId: number; seatNumber: string; movieName: string; cinemaName: string; customerName: string; createdAt: string };

// ---- Public ----
export const Movies = {
  list: (q?: string) => apiFetch<MovieDto[]>(`/movies${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  nowShowing: () => apiFetch<MovieDto[]>("/movies/now-showing"),
  comingSoon: () => apiFetch<MovieDto[]>("/movies/coming-soon"),
  get: (id: number | string) => apiFetch<MovieDto>(`/movies/${id}`),
};

export const Shows = {
  forMovie: (movieId: number | string) => apiFetch<ShowDto[]>(`/shows/movie/${movieId}`),
  get: (showId: number | string) => apiFetch<ShowWithMovieName>(`/shows/${showId}`),
  seats: (showId: number | string) => apiFetch<SeatMapDto>(`/shows/${showId}/seats`),
};

export const Cinemas = {
  list: () => apiFetch<CinemaDto[]>("/cinemas"),
};

export const Auth = {
  me: () => apiFetch<{ id: number; fullName: string; email: string; phone: string | null; gender: string | null }>("/auth/me"),
  login: (email: string, password: string) =>
    apiFetch<{ id: number; fullName: string; email: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data: { fullName: string; email: string; password: string; phone?: string; gender?: string }) =>
    apiFetch<{ id: number; fullName: string; email: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),
};

export const Bookings = {
  create: (showId: number, seatIds: string[]) =>
    apiFetch<BookingDto>("/bookings", { method: "POST", body: JSON.stringify({ showId, seatIds }) }),
  mine: () => apiFetch<BookingDto[]>("/bookings/me"),
  get: (id: number | string) => apiFetch<BookingDto>(`/bookings/${id}`),
};

export const Payments = {
  initiateEsewa: (bookingId: number) =>
    apiFetch<{ gatewayUrl: string; transactionUuid: string; fields: Record<string, string> }>("/payments/esewa/initiate", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    }),
  simulateSuccess: (bookingId: number, transactionUuid: string) =>
    apiFetch<BookingDto>("/payments/esewa/simulate-success", { method: "POST", body: JSON.stringify({ bookingId, transactionUuid }) }),
  simulateFailure: (bookingId: number) =>
    apiFetch<BookingDto>("/payments/esewa/simulate-failure", { method: "POST", body: JSON.stringify({ bookingId }) }),
  payAtCounter: (bookingId: number) => apiFetch<BookingDto>("/payments/counter", { method: "POST", body: JSON.stringify({ bookingId }) }),
};

export const ContactApi = {
  send: (data: { name: string; email: string; phone?: string; message: string }) =>
    apiFetch<{ id: number }>("/contact", { method: "POST", body: JSON.stringify(data) }),
};

export const FeedbackApi = {
  send: (data: { name: string; email?: string; phone?: string; message: string; rating: number }) =>
    apiFetch<{ id: number }>("/feedback", { method: "POST", body: JSON.stringify(data) }),
};

// ---- Admin ----
function crud<T>(base: string) {
  return {
    list: () => apiFetch<T[]>(base),
    create: (data: unknown) => apiFetch<T>(base, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: unknown) => apiFetch<T>(`${base}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => apiFetch<void>(`${base}/${id}`, { method: "DELETE" }),
  };
}

function catalog(base: string) {
  return {
    list: () => apiFetch<LookupDto[]>(base),
    create: (value: string) => apiFetch<LookupDto>(base, { method: "POST", body: JSON.stringify({ value }) }),
    update: (id: number, value: string) => apiFetch<LookupDto>(`${base}/${id}`, { method: "PUT", body: JSON.stringify({ value }) }),
    remove: (id: number) => apiFetch<void>(`${base}/${id}`, { method: "DELETE" }),
  };
}

export const AdminAuth = {
  me: () => apiFetch<AdminUserDto>("/admin/auth/me"),
  login: (email: string, password: string) =>
    apiFetch<AdminUserDto>("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => apiFetch<void>("/admin/auth/logout", { method: "POST" }),
};

export const AdminDashboard = {
  stats: () => apiFetch<DashboardStatsDto>("/admin/dashboard/stats"),
};

export const AdminMovies = {
  list: () => apiFetch<MovieDto[]>("/admin/movies"),
  create: (form: FormData) => apiFetch<MovieDto>("/admin/movies", { method: "POST", body: form }),
  update: (id: number, form: FormData) => apiFetch<MovieDto>(`/admin/movies/${id}`, { method: "PUT", body: form }),
  remove: (id: number) => apiFetch<void>(`/admin/movies/${id}`, { method: "DELETE" }),
};

export const AdminCinemas = crud<CinemaDto>("/admin/cinemas");
export const AdminCustomers = crud<CustomerDto>("/admin/customers");
export const AdminFeedbackApi = crud<FeedbackDto>("/admin/feedback");
export const AdminAdmins = crud<AdminUserDto>("/admin/admins");

export const AdminContactsApi = {
  list: () => apiFetch<ContactDto[]>("/admin/contacts"),
  update: (id: number, data: unknown) => apiFetch<ContactDto>(`/admin/contacts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(`/admin/contacts/${id}`, { method: "DELETE" }),
};

export const AdminGenres = catalog("/admin/genres");
export const AdminIndustries = catalog("/admin/industries");
export const AdminLanguages = catalog("/admin/languages");
export const AdminShowTimes = catalog("/admin/showtimes");

export type AdminShowInput = {
  movieId: number;
  cinemaId: number;
  showTimeId: number;
  showDate: string;
  seatCapacity: number;
  ticketPrice: number;
};

export const AdminShows = {
  list: () => apiFetch<ShowWithMovieName[]>("/admin/shows"),
  create: (data: AdminShowInput) => apiFetch<ShowWithMovieName>("/admin/shows", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<AdminShowInput>) =>
    apiFetch<ShowWithMovieName>(`/admin/shows/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(`/admin/shows/${id}`, { method: "DELETE" }),
};

export const AdminSeats = {
  list: () => apiFetch<SeatRow[]>("/admin/seats"),
  remove: (id: number) => apiFetch<void>(`/admin/seats/${id}`, { method: "DELETE" }),
};

export const AdminBookings = {
  list: () => apiFetch<BookingDto[]>("/admin/bookings"),
  updateStatus: (id: number, data: { paymentStatus?: string; paymentMethod?: string }) =>
    apiFetch<BookingDto>(`/admin/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(`/admin/bookings/${id}`, { method: "DELETE" }),
};

export const AdminSliders = {
  list: () => apiFetch<SliderDto[]>("/admin/sliders"),
  create: (form: FormData) => apiFetch<SliderDto>("/admin/sliders", { method: "POST", body: form }),
  update: (id: number, form: FormData) => apiFetch<SliderDto>(`/admin/sliders/${id}`, { method: "PUT", body: form }),
  remove: (id: number) => apiFetch<void>(`/admin/sliders/${id}`, { method: "DELETE" }),
};
