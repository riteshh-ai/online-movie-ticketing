import { useParams } from "react-router-dom";
import { PageStub } from "../components/PageStub";

// Replaces legacy's three separate pages — payment_success.php,
// payment_failure.php, payment_counter.php — as one route parameterized by
// outcome. Still simulate-only eSewa per migration.md decisions; see
// server/src/routes/payments.routes.ts.
export function PaymentResultPage() {
  const { outcome } = useParams<{ outcome: "success" | "failure" | "counter" }>();
  return <PageStub title={`Payment: ${outcome}`} note="Replaces legacy/payment_success.php, payment_failure.php, payment_counter.php." />;
}
