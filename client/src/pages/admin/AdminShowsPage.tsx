import type { CinemaDto, LookupDto, MovieDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminCinemas, AdminMovies, AdminShowTimes, AdminShows, ApiError, type AdminShowInput } from "../../api";

type ShowRow = Awaited<ReturnType<typeof AdminShows.list>>[number];

const emptyForm = { movieId: "", cinemaId: "", showTimeId: "", showDate: "", seatCapacity: "40", ticketPrice: "" };

// Replaces legacy/Admin/add|edit|view|deleteshow.php. Server-side scoping
// (adminCinemaScope) restricts a cinema-admin to their own cinema's shows —
// this page just reflects whatever the API returns/accepts.
export function AdminShowsPage() {
  const [shows, setShows] = useState<ShowRow[]>([]);
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [cinemas, setCinemas] = useState<CinemaDto[]>([]);
  const [showTimes, setShowTimes] = useState<LookupDto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminShows.list().then(setShows);
  }

  useEffect(() => {
    refresh();
    AdminMovies.list().then(setMovies);
    AdminCinemas.list().then(setCinemas);
    AdminShowTimes.list().then(setShowTimes);
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, cinemaId: cinemas[0] ? String(cinemas[0].id) : "" });
    setShowForm(true);
  }

  function startEdit(s: ShowRow) {
    setEditingId(s.id);
    setForm({
      movieId: String(s.movieId),
      cinemaId: String(s.cinemaId),
      showTimeId: showTimes.find((t) => t.name === s.showTimeLabel)?.id.toString() ?? "",
      showDate: s.showDate,
      seatCapacity: String(s.seatCapacity),
      ticketPrice: s.ticketPrice,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const data: AdminShowInput = {
      movieId: Number(form.movieId),
      cinemaId: Number(form.cinemaId),
      showTimeId: Number(form.showTimeId),
      showDate: form.showDate,
      seatCapacity: Number(form.seatCapacity),
      ticketPrice: Number(form.ticketPrice),
    };
    try {
      if (editingId) await AdminShows.update(editingId, data);
      else await AdminShows.create(data);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save show.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this show? This also removes its bookings.")) return;
    try {
      await AdminShows.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete show.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Shows</h1>
        <button className="btn" onClick={startCreate}>
          + Add show
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>{editingId ? "Edit show" : "New show"}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 1rem" }}>
              <div className="field">
                <label>Movie</label>
                <select required value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })}>
                  <option value="">Select…</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Cinema</label>
                <select required value={form.cinemaId} onChange={(e) => setForm({ ...form, cinemaId: e.target.value })}>
                  <option value="">Select…</option>
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Showtime</label>
                <select required value={form.showTimeId} onChange={(e) => setForm({ ...form, showTimeId: e.target.value })}>
                  <option value="">Select…</option>
                  {showTimes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Date</label>
                <input type="date" required value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} />
              </div>
              <div className="field">
                <label>Seat capacity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.seatCapacity}
                  onChange={(e) => setForm({ ...form, seatCapacity: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Ticket price (Rs.)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={form.ticketPrice}
                  onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                />
              </div>
            </div>
            <div className="row-actions">
              <button className="btn">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Movie</th>
              <th>Cinema</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shows.map((s) => (
              <tr key={s.id}>
                <td>{s.movieName}</td>
                <td>{s.cinemaName}</td>
                <td>{s.showDate}</td>
                <td>{s.showTimeLabel}</td>
                <td>Rs. {s.ticketPrice}</td>
                <td>{s.seatCapacity}</td>
                <td className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(s)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {shows.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  No shows yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
