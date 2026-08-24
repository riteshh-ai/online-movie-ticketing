import { useState, type FormEvent } from "react";
import { ApiError, ContactApi } from "../api";

// Ported from legacy/contact.php's two-column layout: a dark info panel
// (phone/email/socials) beside a form with pill-shaped inputs.
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
    <div className="container">
      <h2 className="section-heading">Contact Us</h2>
      <p style={{ textAlign: "center", color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 2rem" }}>
        We&rsquo;d love to talk about how we can work together. Send us a message below and we&rsquo;ll respond as
        soon as possible.
      </p>

      <div className="contact-grid">
        <div className="contact-info-panel">
          <h2>Contact Information</h2>
          <p style={{ color: "#ccc" }}>Our Team will get back to you within 24 hours</p>
          <p>
            <i className="fa fa-phone" /> &nbsp;01-4316254
          </p>
          <p>
            <i className="fa fa-envelope" /> &nbsp;support@mycinezone.com
          </p>
          <p>
            <i className="fa fa-map-marker" /> &nbsp;Kathmandu, Nepal
          </p>
          <h2 style={{ marginTop: "2rem" }}>Join Us</h2>
          <div className="socials">
            <a href="#" aria-label="Facebook">
              <i className="fa fa-facebook-square" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa fa-twitter-square" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa fa-instagram" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa fa-linkedin-square" />
            </a>
          </div>
        </div>

        <div>
          {done && <div className="form-success">Thanks — we&rsquo;ll get back to you soon.</div>}
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Your Name</label>
              <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="phone">Number (optional)</label>
              <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="btn" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
