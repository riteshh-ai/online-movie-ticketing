import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Auth } from "../api";

// Public site chrome — replaces legacy/header.php + footer.php, minus the
// login/register modals (those are real pages here: /login, /register).
export function Layout() {
  const { customer, setCustomer } = useAuth();

  async function handleLogout() {
    await Auth.logout().catch(() => {});
    setCustomer(null);
  }

  return (
    <>
      <header className="site-header">
        <div className="container bar">
          <Link to="/" className="brand">
            MyCine<span>Zone</span>
          </Link>
          <nav className="site-nav">
            <Link to="/now-showing">Now Showing</Link>
            <Link to="/coming-soon">Coming Soon</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="header-actions">
            {customer ? (
              <>
                <Link to="/profile">{customer.fullName}</Link>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register" className="btn btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          MyCineZone — migrated from a PHP/MySQL app to Node/Express + React. ·{" "}
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </>
  );
}
