import { PageStub } from "../components/PageStub";

export function ProfilePage() {
  return <PageStub title="My Profile" note="Replaces legacy/profile.php — now also lists the customer's own bookings via GET /api/bookings/me." />;
}
