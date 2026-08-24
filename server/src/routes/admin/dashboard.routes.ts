import type { DashboardStatsDto } from "@mycinezone/shared";
import { Router } from "express";
import { adminCinemaScope } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../utils/prisma.js";

// Replaces legacy/Admin/dashboard.php's stat cards. Booking count/revenue
// stay cinema-filtered for scoped admins via adminCinemaScope() (see
// middleware/auth.ts), same restriction legacy applied.
export const adminDashboardRouter = Router();

adminDashboardRouter.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const cinemaId = adminCinemaScope(req);
    const showWhere = cinemaId ? { cinemaId } : {};
    const bookingWhere = cinemaId ? { show: { cinemaId } } : {};

    const [movieCount, cinemaCount, showCount, bookingCount, customerCount, revenue] = await Promise.all([
      prisma.movie.count(),
      prisma.cinema.count(),
      prisma.show.count({ where: showWhere }),
      prisma.booking.count({ where: bookingWhere }),
      prisma.customer.count(),
      prisma.booking.aggregate({ where: { ...bookingWhere, paymentStatus: "COMPLETED" }, _sum: { totalAmount: true } }),
    ]);

    const body: DashboardStatsDto = {
      movieCount,
      cinemaCount,
      showCount,
      bookingCount,
      customerCount,
      revenue: (revenue._sum.totalAmount ?? 0).toString(),
    };
    res.json(body);
  }),
);
