import type { AdminUserDto, CinemaDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminAdmins, AdminCinemas, ApiError } from "../../api";

const emptyForm = { username: "", email: "", password: "", role: "CINEMA_ADMIN" as "SUPER_ADMIN" | "CINEMA_ADMIN", cinemaId: "" };

// Replaces legacy/Admin/add|edit|view|deleteadmin.php. Super-admin only.
export function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUserDto[]>([]);
  const [cinemas, setCinemas] = useState<CinemaDto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminAdmins.list()
      .then(setAdmins)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load admins."));
  }
  useEffect(() => {
    refresh();
    AdminCinemas.list().then(setCinemas);
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(a: AdminUserDto) {
    setEditingId(a.id);
    setForm({ username: a.username, email: a.email, password: "", role: a.role, cinemaId: a.cinemaId ? String(a.cinemaId) : "" });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      username: form.username,
      email: form.email,
      role: form.role,
      cinemaId: form.role === "CINEMA_ADMIN" && form.cinemaId ? Number(form.cinemaId) : undefined,
      ...(form.password ? { password: form.password } : {}),
    };
    try {
      if (editingId) await AdminAdmins.update(editingId, payload);
      else await AdminAdmins.create(payload);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save admin.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this admin account?")) return;
    try {
      await AdminAdmins.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete admin.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Cinema Admins</h1>
        <button className="btn" onClick={startCreate}>
          + Add admin
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
          <h3>{editingId ? "Edit admin" : "New admin"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })}>
                <option value="CINEMA_ADMIN">Cinema Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            {form.role === "CINEMA_ADMIN" && (
              <div className="field">
                <label>Cinema</label>
                <select value={form.cinemaId} onChange={(e) => setForm({ ...form, cinemaId: e.target.value })}>
                  <option value="">Select…</option>
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="field">
              <label>{editingId ? "New password (leave blank to keep current)" : "Password"}</label>
              <input
                type="password"
                required={!editingId}
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
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
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Cinema</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.username}</td>
                <td>{a.email}</td>
                <td>{a.role === "SUPER_ADMIN" ? "Super Admin" : "Cinema Admin"}</td>
                <td>{a.cinemaName ?? "—"}</td>
                <td className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(a)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No admins yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
