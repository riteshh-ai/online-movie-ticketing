import type { Prisma } from "@prisma/client";
import type { AdminUserDto, BookingDto, MovieDto, ShowDto } from "@mycinezone/shared";

type MovieWithRelations = Prisma.MovieGetPayload<{ include: { genre: true; industry: true; language: true } }>;

export function toMovieDto(m: MovieWithRelations): MovieDto {
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    posterPath: m.posterPath,
    landscapePath: m.landscapePath,
    releaseDate: m.releaseDate ? m.releaseDate.toISOString().slice(0, 10) : null,
    duration: m.duration,
    director: m.director,
    cast: m.cast,
    ageRating: m.ageRating,
    genre: m.genre?.name ?? null,
    industry: m.industry?.name ?? null,
    language: m.language?.name ?? null,
    genreId: m.genreId,
    industryId: m.industryId,
    languageId: m.languageId,
  };
}

export const movieInclude = { genre: true, industry: true, language: true } satisfies Prisma.MovieInclude;

type ShowWithRelations = Prisma.ShowGetPayload<{ include: { cinema: true; showTime: true } }>;

export function toShowDto(s: ShowWithRelations): ShowDto {
  return {
    id: s.id,
    movieId: s.movieId,
    cinemaId: s.cinemaId,
    cinemaName: s.cinema.name,
    showDate: s.showDate.toISOString().slice(0, 10),
    showTimeLabel: s.showTime.label,
    ticketPrice: s.ticketPrice.toString(),
    seatCapacity: s.seatCapacity,
  };
}

export const showInclude = { cinema: true, showTime: true } satisfies Prisma.ShowInclude;

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { show: { include: { movie: true; cinema: true; showTime: true } } };
}>;

export function toBookingDto(b: BookingWithRelations): BookingDto {
  return {
    id: b.id,
    showId: b.showId,
    movieName: b.show.movie.name,
    cinemaName: b.show.cinema.name,
    showDate: b.show.showDate.toISOString().slice(0, 10),
    showTimeLabel: b.show.showTime.label,
    ticketCount: b.ticketCount,
    seatNumbers: b.seatNumbers,
    totalAmount: b.totalAmount.toString(),
    paymentStatus: b.paymentStatus,
    paymentMethod: b.paymentMethod,
    bookingDate: b.bookingDate.toISOString(),
  };
}

export const bookingInclude = { show: { include: { movie: true, cinema: true, showTime: true } } } satisfies Prisma.BookingInclude;

type AdminWithCinema = Prisma.AdminUserGetPayload<{ include: { cinema: true } }>;

export function toAdminUserDto(a: AdminWithCinema): AdminUserDto {
  return {
    id: a.id,
    username: a.username,
    email: a.email,
    role: a.role,
    cinemaId: a.cinemaId,
    cinemaName: a.cinema?.name ?? null,
  };
}
