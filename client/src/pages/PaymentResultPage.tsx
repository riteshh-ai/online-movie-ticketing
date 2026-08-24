import type { BookingDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Bookings } from "../api";

// Ported from legacy/payment_success.php, payment_failure.php, payment_counter.php.
export function PaymentResultPage() {
  const { outcome } = useParams();
  const location = useLocation();
  const bookingId = (location.state as { bookingId?: number } | null)?.bookingId;
  const [booking, setBooking] = useState<BookingDto | null>(null);

  useEffect(() => {
    if (bookingId) Bookings.get(bookingId).then(setBooking).catch(() => {});
  }, [bookingId]);

  const isSuccess = outcome === "success" || outcome === "counter";

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card" style={{ textAlign: "center", marginTop: "2rem" }}>
        <i
          className={`fa ${isSuccess ? "fa-check-circle" : "fa-times-circle"}`}
          style={{ fontSize: 60, color: isSuccess ? "var(--color-success)" : "var(--color-danger)" }}
        />
        <h1 style={{ color: isSuccess ? "var(--color-success)" : "var(--color-danger)", marginTop: "0.75rem" }}>
          {outcome === "success" && "Payment Successful!"}
          {outcome === "counter" && "Booking Confirmed — Pay at Counter"}
          {outcome === "failure" && "Payment Failed"}
          {!outcome && "Payment"}
        </h1>

        {outcome === "counter" && <p>Please complete your payment at the cinema counter when you arrive.</p>}
        {outcome === "failure" && <p>Your transaction could not be verified. You can try again from your booking.</p>}

        {booking ? (
          <div style={{ background: "#f8f9fa", borderRadius: "var(--radius-sm)", padding: "1.25rem", margin: "1.25rem 0", textAlign: "left" }}>
            <p>
              <b>Booking ID:</b> #{booking.id}
            </p>
            <p>
              <b>Movie:</b> {booking.movieName}
            </p>
            <p>
              <b>Cinema:</b> {booking.cinemaName}
            </p>
            <p>
              <b>Show:</b> {booking.showDate} · {booking.showTimeLabel}
            </p>
            <p>
              <b>Seats:</b> {booking.seatNumbers}
            </p>
            <p>
              <b>Total:</b> Rs. {booking.totalAmount}
            </p>
            <p style={{ margin: 0 }}>
              <b>Status:</b> {booking.paymentStatus}
            </p>
          </div>
        ) : (
          <p className="empty">Booking details not available in this session.</p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link className="btn" to="/">
            Home
          </Link>
          <Link className="btn btn-secondary" to="/profile">
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
