import { useState, type FormEvent } from "react";
import { ApiError, FeedbackApi } from "../api";

const RATINGS = [
  { value: 5, label: "⭐ Excellent" },
  { value: 4, label: "😊 Good" },
  { value: 3, label: "😐 Average" },
  { value: 2, label: "😞 Poor" },
  { value: 1, label: "😡 Terrible" },
];

// Ported from legacy/feedback.php's dark glass-panel form with glowing
// emoji rating buttons. `rating` is a real 1-5 int here (legacy sent
// free-text strings '1'/'3'/'4'/'5', with no '2' — closed that gap).
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
    <div className="dark-page">
      <div className="glass-panel">
        <div style={{ textAlign: "center", borderBottom: "2px solid var(--color-primary)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
          <h1 style={{ textShadow: "0 0 10px rgba(0,255,255,0.5)" }}>Feedback Form</h1>
          <p style={{ color: "#aaa", margin: "0.5rem 0 0" }}>We&rsquo;d love to hear from you! Share your experience with us.</p>
        </div>

        <div className="info-box">
          <i className="fa fa-info-circle" /> Your feedback helps us improve our services and provide you with a
          better movie booking experience.
        </div>

        {done && <div className="form-success">Thank you! Your feedback has been submitted successfully.</div>}
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full Name *</label>
            <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="email">Email Address (optional)</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone Number (optional)</label>
            <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>How would you rate your experience? *</label>
            <div className="rating-picker">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={form.rating === r.value ? "selected" : ""}
                  onClick={() => setForm({ ...form, rating: r.value })}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Your Feedback *</label>
            <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button className="btn" disabled={submitting} style={{ width: "100%" }}>
            <i className="fa fa-paper-plane" /> {submitting ? "Sending…" : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
