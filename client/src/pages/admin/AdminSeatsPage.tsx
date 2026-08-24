import { useEffect, useState } from "react";
import { AdminSeats, ApiError } from "../../api";

type SeatRow = Awaited<ReturnType<typeof AdminSeats.list>>[number];

// Replaces legacy/Admin/view|edit|deleteseat_reserved.php. A SeatReservation
// row existing simply means that seat is taken — no inverted boolean flag to
// get backwards (legacy had one, see server/src/routes/admin/seats.routes.ts).
export function AdminSeatsPage() {
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminSeats.list().then(setSeats);
  }
  useEffect(refresh, []);

  async function handleRelease(id: number) {
    if (!window.confirm("Release this seat? It will become bookable again.")) return;
    try {
      await AdminSeats.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not release seat.");
    }
  }

  return (
    <>
      <h1>Reserved Seats</h1>
      {error && <div className="form-error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Movie</th>
              <th>Cinema</th>
              <th>Seat</th>
              <th>Customer</th>
              <th>Reserved at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {seats.map((s) => (
              <tr key={s.id}>
                <td>{s.movieName}</td>
                <td>{s.cinemaName}</td>
                <td>{s.seatNumber}</td>
                <td>{s.customerName}</td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => handleRelease(s.id)}>
                    Release
                  </button>
                </td>
              </tr>
            ))}
            {seats.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No reserved seats.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
