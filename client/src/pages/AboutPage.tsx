export function AboutPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1>About MyCineZone</h1>
      <p>
        MyCineZone is a movie ticket booking platform — browse now-showing and coming-soon movies, pick your seats on a
        live seat map, and pay at the counter or with eSewa.
      </p>
      <p>
        This build is a migration of an original PHP/MySQL app to a TypeScript monorepo (Express API + React SPA), kept
        on the same MySQL engine underneath.
      </p>
    </div>
  );
}
