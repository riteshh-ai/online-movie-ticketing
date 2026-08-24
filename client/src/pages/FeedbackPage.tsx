import { useState, type FormEvent } from "react";
import { ApiError, FeedbackApi } from "../api";

// Replaces legacy/feedback.php's form POST handler. `rating` is now a real
// 1-5 int (legacy sent free-text strings '1'/'3'/'4'/'5', with no '2').
export function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", rating: 5 });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await FeedbackApi.send(form);
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "", rating: 5 });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-narrow">
      <h1>Feedback</h1>
      {done && <div className="form-success">Thanks for your feedback!</div>}
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Rating</label>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={n === form.rating ? "selected" : ""}
                onClick={() => setForm({ ...form, rating: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="btn" disabled={submitting}>
          {submitting ? "Sending…" : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
