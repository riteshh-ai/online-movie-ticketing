import { allSeatIds, SEAT_ROWS, SEATS_PER_ROW, seatId, type BookingDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError, Bookings, Payments, Shows } from "../api";

type Show = Awaited<ReturnType<typeof Shows.get>>;

// Ported from legacy/booking.php's seat picker UI + POST handler: a
// checkbox-style seat grid under a "SCREEN" bar, then a payment-method
// choice. The 4x10 "R{row}S{seat}" seat grid is generated client-side same
// as legacy, but now checked against GET /api/shows/:showId/seats instead
// of no server-side conflict check at all. total_amount is always computed
// server-side from show.ticketPrice, never trusted from the client.
export function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [esewa, setEsewa] = useState<{ transactionUuid: string } | null>(null);

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    Promise.all([Shows.get(showId), Shows.seats(showId)])
      .then(([s, seats]) => {
        setShow(s);
        setTaken(new Set(seats.takenSeatIds));
      })
      .catch(() => setError("Could not load this show."))
      .finally(() => setLoading(false));
  }, [showId]);

  function toggleSeat(id: string) {
    if (taken.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleConfirm() {
    if (!show || selected.size === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await Bookings.create(show.id, Array.from(selected));
      setBooking(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create booking.");
      const seats = await Shows.seats(show.id);
      setTaken(new Set(seats.takenSeatIds));
      setSelected(new Set());
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCounter() {
    if (!booking) return;
    await Payments.payAtCounter(booking.id);
    navigate("/payment/counter", { state: { bookingId: booking.id } });
  }

  async function handleEsewaStart() {
    if (!booking) return;
    const res = await Payments.initiateEsewa(booking.id);
    setEsewa({ transactionUuid: res.transactionUuid });
  }

  async function handleEsewaOutcome(success: boolean) {
    if (!booking || !esewa) return;
    if (success) {
      await Payments.simulateSuccess(booking.id, esewa.transactionUuid);
      navigate("/payment/success", { state: { bookingId: booking.id } });
    } else {
      await Payments.simulateFailure(booking.id);
      navigate("/payment/failure", { state: { bookingId: booking.id } });
    }
  }

  if (loading) return <div className="container"><p className="empty">Loading…</p></div>;
  if (!show) return <div className="container"><p className="empty">Show not found.</p></div>;

  const total = Number(show.ticketPrice) * selected.size;

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2 className="section-heading">Book Your Ticket Now</h2>
      <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <b>{show.movieName}</b> — {show.cinemaName} · {show.showDate} · {show.showTimeLabel} · Rs. {show.ticketPrice}/seat
      </p>

      {error && <div className="form-error">{error}</div>}

      {!booking ? (
        <>
          <div style={{ margin: "1.5rem 0" }}>
            <div className="screen-bar">SCREEN</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="seat-grid">
                {Array.from({ length: SEAT_ROWS }, (_, r) => r + 1).map((row) => (
                  <div className="seat-row" key={row}>
                    {Array.from({ length: SEATS_PER_ROW }, (_, s) => s + 1).map((seat) => {
                      const id = seatId(row, seat);
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`seat${selected.has(id) ? " selected" : ""}`}
                          disabled={taken.has(id)}
                          onClick={() => toggleSeat(id)}
                          title={id}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: "0.75rem" }}>
              {allSeatIds().length - taken.size} of {allSeatIds().length} seats available · grey = taken, darkcyan = selected
            </p>
          </div>

          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div>{selected.size} seat(s) selected</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)" }}>Rs. {total}</div>
            </div>
            <button className="btn" disabled={selected.size === 0 || submitting} onClick={handleConfirm}>
              {submitting ? "Booking…" : "Confirm Booking"}
            </button>
          </div>
        </>
      ) : (
        <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ color: "var(--color-primary)" }}>Select Payment Method</h2>
          <p>
            Booking #{booking.id} · {booking.seatNumbers} · Total Rs. {booking.totalAmount}
          </p>

          {!esewa ? (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button className="btn" style={{ flex: 1, background: "#2ecc71" }} onClick={handleEsewaStart}>
                <i className="fa fa-mobile" /> Pay with eSewa
              </button>
              <button className="btn" style={{ flex: 1, background: "#3498db" }} onClick={handleCounter}>
                <i className="fa fa-money" /> Pay at Counter
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: "var(--text-muted)" }}>
                eSewa test gateway is simulate-only in this build — choose an outcome below.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn" style={{ background: "var(--color-success)" }} onClick={() => handleEsewaOutcome(true)}>
                  ✅ Simulate Success
                </button>
                <button className="btn btn-danger" onClick={() => handleEsewaOutcome(false)}>
                  ❌ Simulate Failure
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
