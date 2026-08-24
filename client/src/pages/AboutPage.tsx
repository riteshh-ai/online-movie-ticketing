export function AboutPage() {
  return (
    <section style={{ background: "var(--bg-page-alt)", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 className="section-heading">About Us</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Welcome to <b>MyCineZone</b> — your one-stop destination for booking the latest movies effortlessly!
        </p>

        <p>
          <b>MyCineZone</b> was built with a simple mission — to make movie ticket booking fast, easy, and accessible
          for everyone. Whether it's a fun hangout with friends or a cozy movie night with your loved ones, we make
          sure your cinema experience starts smoothly, right from booking your seats.
        </p>

        <h4 style={{ color: "var(--color-primary)", marginTop: "2rem" }}>Our Mission</h4>
        <p>
          To make movie booking simpler and smarter — combining technology and entertainment to enhance every movie
          lover&rsquo;s experience.
        </p>

        <h4 style={{ color: "var(--color-primary)" }}>Our Vision</h4>
        <p>
          To become Nepal&rsquo;s most trusted, user-friendly, and exciting movie booking platform — connecting people
          to the joy of cinema.
        </p>

        <h4 style={{ color: "var(--color-primary)" }}>Why Choose Us?</h4>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li>🎬 Super easy and secure online booking</li>
          <li>🎟️ Real-time seat selection with instant confirmation</li>
          <li>💳 Safe and flexible payment options</li>
          <li>💬 Quick customer support for booking help</li>
          <li>🎁 Exclusive movie deals and offers</li>
        </ul>

        <h4 style={{ color: "var(--color-primary)" }}>Contact Us</h4>
        <p>
          Got questions or feedback? We&rsquo;d love to hear from you!
          <br />
          📧 <b>support@mycinezone.com</b>
          <br />
          📞 <b>+977-9813586194</b>
        </p>
      </div>
    </section>
  );
}
