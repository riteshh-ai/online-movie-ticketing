import type { FeedbackDto } from "@mycinezone/shared";
import { useEffect, useState } from "react";
import { AdminFeedbackApi, ApiError } from "../../api";

// Replaces legacy/Admin/add|edit|view|deletefeedback.php. Super-admin only.
export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    AdminFeedbackApi.list()
      .then(setFeedback)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load feedback."));
  }
  useEffect(refresh, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this feedback entry?")) return;
    try {
      await AdminFeedbackApi.remove(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete feedback.");
    }
  }

  return (
    <>
      <h1>Feedback</h1>
      {error && <div className="form-error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Message</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{"★".repeat(f.rating)}</td>
                <td style={{ maxWidth: 360 }}>{f.message}</td>
                <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                <td className="row-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {feedback.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  No feedback yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
