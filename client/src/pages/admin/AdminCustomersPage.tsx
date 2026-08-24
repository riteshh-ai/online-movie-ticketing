import type { CustomerDto } from "@mycinezone/shared";
import { useEffect, useState, type FormEvent } from "react";
import { AdminCustomers, ApiError } from "../../api";

const emptyForm = { fullName: "", email: "", phone: "", gender: "", password: "" };

// Replaces legacy/Admin/add|edit|view|deletecustomer.php. Super-admin only —
// legacy had no server-side check here at all (PROJECT_REFERENCE.md §10.6).
export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminCustomers.list()
      .then(setCustomers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load customers."));
  }
  useEffect(refresh, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(c: CustomerDto) {
    setEditingId(c.id);
    setForm({ fullName: c.fullName, email: c.email, phone: c.phone ?? "", gender: c.gender ?? "", password: "" });
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        const { password, ...rest } = form;
        await AdminCustomers.update(editingId, password ? form : rest);
      } else {
        await AdminCustomers.create(form);
      }
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save customer.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this customer? This also removes their bookings.")) return;
    try {
      await AdminCustomers.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete customer.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Customers</h1>
        <button className="btn" onClick={startCreate}>
          + Add customer
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
          <h3>{editingId ? "Edit customer" : "New customer"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field">
              <label>Gender</label>
              <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            </div>
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
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
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
