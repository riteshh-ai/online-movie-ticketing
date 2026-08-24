// Types/constants shared between client and server so the two never drift —
// the server can't import client code and vice versa, but both import this.

// Same fixed 4x10 "R{row}S{seat}" grid as legacy/booking.php's client-side
// JS (PROJECT_REFERENCE.md §9). Kept as a shared constant instead of
// duplicating the row/seat counts in both the picker UI and the server-side
// validation that now actually checks seat availability.
export const SEAT_ROWS = 4;
export const SEATS_PER_ROW = 10;

export function seatId(row: number, seat: number): string {
  return `R${row}S${seat}`;
}

export function allSeatIds(): string[] {
  const ids: string[] = [];
  for (let row = 1; row <= SEAT_ROWS; row++) {
    for (let seat = 1; seat <= SEATS_PER_ROW; seat++) {
      ids.push(seatId(row, seat));
    }
  }
  return ids;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentMethod = "COUNTER" | "ESEWA";
export type AdminRole = "SUPER_ADMIN" | "CINEMA_ADMIN";

export type MovieDto = {
  id: number;
  name: string;
  description: string | null;
  posterPath: string | null;
  landscapePath: string | null;
  releaseDate: string | null;
  duration: string | null;
  director: string | null;
  cast: string | null;
  ageRating: string | null;
  genre: string | null;
  industry: string | null;
  language: string | null;
  genreId: number | null;
  industryId: number | null;
  languageId: number | null;
};

export type ShowDto = {
  id: number;
  movieId: number;
  cinemaId: number;
  cinemaName: string;
  showDate: string;
  showTimeLabel: string;
  ticketPrice: string;
  seatCapacity: number;
};

export type BookingDto = {
  id: number;
  showId: number;
  movieName?: string;
  cinemaName?: string;
  showDate?: string;
  showTimeLabel?: string;
  ticketCount: number;
  seatNumbers: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  bookingDate: string;
};

export type CinemaDto = { id: number; name: string; location: string; city: string };
export type LookupDto = { id: number; name: string };
export type ShowTimeDto = { id: number; label: string };
export type ContactDto = { id: number; name: string; email: string; phone: string | null; message: string; createdAt: string };
export type FeedbackDto = { id: number; name: string; email: string | null; phone: string | null; message: string; rating: number; createdAt: string };
export type SliderDto = { id: number; imageUrl: string; altText: string | null };
export type AdminUserDto = { id: number; username: string; email: string; role: AdminRole; cinemaId: number | null; cinemaName?: string | null };
export type SeatMapDto = { seatIds: string[]; takenSeatIds: string[] };
export type CustomerDto = { id: number; fullName: string; email: string; phone: string | null; gender: string | null; createdAt: string };
export type DashboardStatsDto = { movieCount: number; cinemaCount: number; showCount: number; bookingCount: number; customerCount: number; revenue: string };
