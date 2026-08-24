import type { ContactDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { AdminContactsApi, ApiError } from "../../api";

// Replaces legacy/Admin/view|edit|deletecontact.php. Super-admin only — same
// "hidden from sidebar, not actually access-controlled" gap fixed here as
// on customers/feedback.
export function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminContactsApi.list()
      .then(setContacts)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load messages."));
  }
  useEffect(refresh, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await AdminContactsApi.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete message.");
    }
  }

  return (
    <>
      <h1>Contact Messages</h1>
      {error && <div className="form-error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td style={{ maxWidth: 320 }}>{c.message}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No messages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
