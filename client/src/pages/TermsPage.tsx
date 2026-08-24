import { Link } from "react-router-dom";

export function TermsPage() {
  return (
    <section style={{ background: "var(--bg-page-alt)", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 className="section-heading">Terms &amp; Conditions</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Please read these terms and conditions carefully before booking tickets through our website.
        </p>

        <ol style={{ lineHeight: 1.8 }}>
          <li>
            <b>Ticket Purchase:</b> All ticket sales are final. Please review your booking details before confirming
            the payment.
          </li>
          <li>
            <b>Refund Policy:</b> Tickets once booked cannot be canceled, exchanged, or refunded unless a show is
            canceled by the theater.
          </li>
          <li>
            <b>Payment Security:</b> All online transactions are processed through secure payment gateways. We do not
            store your card information.
          </li>
          <li>
            <b>Show Timings:</b> The theater reserves the right to change movie timings due to technical or
            operational reasons.
          </li>
          <li>
            <b>Seat Selection:</b> Seat allocation is based on availability at the time of booking. Once confirmed,
            seats cannot be changed.
          </li>
          <li>
            <b>Entry Policy:</b> Please carry a valid ticket and government-issued ID for entry into the cinema hall.
          </li>
          <li>
            <b>Counter Payments:</b> Bookings paid at the counter must be settled before entry; unpaid bookings may
            be released.
          </li>
        </ol>

        <h4 style={{ color: "var(--color-primary)", marginTop: "2rem" }}>Child Policy</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Children under 3 years old may enter for free but are not entitled to a separate seat.</li>
          <li>For certain movies (especially with age ratings), entry for children may be restricted.</li>
          <li>Parents or guardians are responsible for supervising children at all times inside the cinema.</li>
        </ul>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link className="btn" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
