import type { BookingDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { AdminBookings, ApiError } from "../../api";

// Replaces legacy/Admin/view|edit|deletebooking.php.
export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminBookings.list().then(setBookings);
  }
  useEffect(refresh, []);

  async function markPaid(id: number) {
    try {
      await AdminBookings.updateStatus(id, { paymentStatus: "COMPLETED" });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update booking.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this booking? Its seats will be released.")) return;
    try {
      await AdminBookings.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete booking.");
    }
  }

  return (
    <>
      <h1>Bookings</h1>
      {error && <div className="form-error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Movie</th>
              <th>Cinema</th>
              <th>Show</th>
              <th>Seats</th>
              <th>Total</th>
              <th>Method</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
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
                <td className="row-actions">
                  {b.paymentStatus === "PENDING" && (
                    <button className="btn btn-secondary btn-sm" onClick={() => markPaid(b.id)}>
                      Mark paid
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={9} className="empty">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
