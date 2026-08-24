import { Link } from "react-router-dom";

// Ported from legacy/footer.php's 3-column footer (brand+tagline / quick
// links / contact info) and bottom copyright bar.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>
              MyCine<span>Zone</span>
            </h3>
            <p>Your ultimate movie experience starts here — book, watch, and enjoy the latest blockbusters with ease.</p>
          </div>
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/now-showing">Now Showing</Link>
              </li>
              <li>
                <Link to="/coming-soon">Coming Soon</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>For Booking</h5>
            <p>
              For Marketing &amp; Enquiries:
              <br />
              <span style={{ color: "var(--color-primary-bright)" }}>mycinezone@gmail.com</span>
            </p>
            <p>
              For Complaints &amp; Support:
              <br />
              <span style={{ color: "var(--color-primary-bright)" }}>support@mycinezone.com</span>
            </p>
            <p>
              Phone: <span style={{ color: "var(--color-primary-bright)" }}>01-5556789</span>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 MyCineZone | Kathmandu, Nepal | <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
