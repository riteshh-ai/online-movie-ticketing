import { PageStub } from "../components/PageStub";

// Legacy had no dedicated login page — it was a Bootstrap modal embedded in
// every page via header.php. Split out into a real route here since the SPA
// has client-side routing; can still be opened as a modal from the navbar later.
export function LoginPage() {
  return <PageStub title="Log In" note="Replaces the login modal in legacy/header.php." />;
}
