import type { BookingDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Bookings } from "../api";
import { useAuth } from "../context/AuthContext";

// Ported from legacy/profile.php's dark gradient page + glass panel with
// avatar/info boxes, extended with a booking history list (new — legacy
// didn't list bookings on this page).
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
      <div className="dark-page">
        <div className="glass-panel">
          <div className="avatar-circle">
            <i className="fa fa-user" />
          </div>
          <h2 style={{ textAlign: "center" }}>{customer?.fullName}</h2>
          <p style={{ textAlign: "center", color: "#999" }}>Customer ID: #{customer?.id}</p>

          <div className="info-box">
            <strong>
              <i className="fa fa-envelope" /> Email Address
            </strong>
            <p style={{ margin: 0, color: "#ccc" }}>{customer?.email}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="section-heading" style={{ marginTop: "2.5rem" }}>
          My Bookings
        </h2>
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
      </div>
    </>
  );
}
