import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuth, ApiError } from "../../api";
import { useAuth } from "../../context/AuthContext";

// Replaces legacy/Admin/index.php's login form + handler, including the
// hardcoded super-admin credential check — the super-admin is now a real
// AdminUser row bootstrapped by prisma/seed (see migration.md "Auth").
export function AdminLoginPage() {
  const { setAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const admin = await AdminAuth.login(email, password);
      setAdmin(admin);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ background: "var(--bg-page-alt)" }}>
      <div className="container">
        <div className="auth-card" style={{ marginTop: "4rem" }}>
          <div className="auth-card-header" style={{ background: "#000" }}>
            <h1>Admin Login</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}
