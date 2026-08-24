import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, Auth } from "../api";
import { useAuth } from "../context/AuthContext";

// Ported from legacy/header.php's Login modal (pill inputs, darkcyan header)
// as a real page instead of a Bootstrap modal.
export function LoginPage() {
  const { setCustomer } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const customer = await Auth.login(email, password);
      setCustomer(customer);
      navigate(params.get("next") || "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>Log In</h1>
        </div>
        <div className="auth-card-body">
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>
          <p style={{ marginTop: "1rem", textAlign: "center" }}>
            No account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
