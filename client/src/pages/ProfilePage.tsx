import type { BookingDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Bookings } from "../api";
import { useAuth } from "../context/AuthContext";

// Replaces legacy/profile.php, extended with a booking history list (new —
// legacy/profile.php didn't list bookings).
export function ProfilePage() {
  const { customer } = useAuth();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Bookings.mine()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>My Profile</h1>
      <div className="card" style={{ marginBottom: "2rem", maxWidth: 420 }}>
        <p>
          <b>Name:</b> {customer?.fullName}
        </p>
        <p>
          <b>Email:</b> {customer?.email}
        </p>
      </div>

      <h2 className="section-title">My Bookings</h2>
      {loading ? (
        <p className="empty">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="empty">No bookings yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Cinema</th>
                <th>Show</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.movieName}</td>
                  <td>{b.cinemaName}</td>
                  <td>
                    {b.showDate} · {b.showTimeLabel}
                  </td>
                  <td>{b.seatNumbers}</td>
                  <td>Rs. {b.totalAmount}</td>
                  <td>{b.paymentMethod}</td>
                  <td>
                    <span className={`badge badge-${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
