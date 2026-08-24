import type { DashboardStatsDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { AdminDashboard } from "../../api";

// Replaces legacy/Admin/dashboard.php's stat cards.
export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);

  useEffect(() => {
    AdminDashboard.stats().then(setStats);
  }, []);

  const cards: Array<[string, string | number]> = stats
    ? [
        ["Movies", stats.movieCount],
        ["Cinemas", stats.cinemaCount],
        ["Shows", stats.showCount],
        ["Bookings", stats.bookingCount],
        ["Customers", stats.customerCount],
        ["Revenue (Rs.)", stats.revenue],
      ]
    : [];

  return (
    <>
      <h1>Dashboard</h1>
      {!stats ? (
        <p className="empty">Loading…</p>
      ) : (
        <div className="stat-cards">
          {cards.map(([label, value]) => (
            <div className="card stat-card" key={label}>
              <div className="value">{value}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
