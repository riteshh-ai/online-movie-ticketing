import { PageStub } from "../components/PageStub";

// Replaces legacy/booking.php's seat picker UI. The 4x10 "R{row}S{seat}"
// seat grid is generated client-side same as legacy, but now checked against
// GET /api/shows/:showId/seats instead of no server-side conflict check at
// all — see server/src/routes/shows.routes.ts.
export function BookingPage() {
  return <PageStub title="Book Tickets" note="Replaces legacy/booking.php." />;
}
