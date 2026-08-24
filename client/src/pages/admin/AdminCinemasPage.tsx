import type { CinemaDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminCinemas, ApiError } from "../../api";

const emptyForm = { name: "", location: "", city: "" };

// Replaces legacy/Admin/add|edit|view|deletecinema.php. Mutations are
// super-admin only server-side — a cinema-scoped admin visiting this page
// will get a 403 from the API on submit.
export function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<CinemaDto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminCinemas.list().then(setCinemas);
  }
  useEffect(refresh, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(c: CinemaDto) {
    setEditingId(c.id);
    setForm({ name: c.name, location: c.location, city: c.city });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) await AdminCinemas.update(editingId, form);
      else await AdminCinemas.create(form);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save cinema.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this cinema? This also removes its shows and bookings.")) return;
    try {
      await AdminCinemas.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete cinema.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Cinemas</h1>
        <button className="btn" onClick={startCreate}>
          + Add cinema
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
          <h3>{editingId ? "Edit cinema" : "New cinema"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Location</label>
              <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="field">
              <label>City</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
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
              <th>Name</th>
              <th>Location</th>
              <th>City</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>{c.city}</td>
                <td className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cinemas.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  No cinemas yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
