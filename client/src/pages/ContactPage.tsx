import { useState, type FormEvent } from "react";
import { ApiError, ContactApi } from "../api";

// Replaces legacy/contact.php's form POST handler.
export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await ContactApi.send(form);
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-narrow">
      <h1>Contact Us</h1>
      {done && <div className="form-success">Thanks — we'll get back to you soon.</div>}
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="btn" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
