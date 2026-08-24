import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Auth } from "../api";
import { useAuth } from "../context/AuthContext";
import { Footer } from "./Footer";

function useCloseOnOutsideClick(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

// Public site chrome — ported from legacy/header.php: dark blurred navbar,
// "Movies" dropdown (Coming Soon / Now Showing), navbar search, and a
// login/register vs. profile-dropdown swap. Login/Register are real pages
// here instead of Bootstrap modals — no jQuery/Bootstrap JS in a React SPA.
export function Layout() {
  const { customer, setCustomer } = useAuth();
  const navigate = useNavigate();
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const moviesRef = useCloseOnOutsideClick(() => setMoviesOpen(false));
  const profileRef = useCloseOnOutsideClick(() => setProfileOpen(false));

  async function handleLogout() {
    setProfileOpen(false);
    await Auth.logout().catch(() => {});
    setCustomer(null);
    navigate("/");
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <header className="site-header">
        <div className="container bar">
          <Link to="/" className="brand">
            <img src="/logo.jpeg" alt="" />
            MyCineZone
          </Link>
          <nav className="site-nav">
            <Link to="/">Home</Link>
            <div ref={moviesRef} className="nav-dropdown">
              <button type="button" className="nav-link" onClick={() => setMoviesOpen((o) => !o)}>
                Movies <i className="fa fa-caret-down" />
              </button>
              {moviesOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/now-showing" onClick={() => setMoviesOpen(false)}>
                    Now Showing
                  </Link>
                  <Link to="/coming-soon" onClick={() => setMoviesOpen(false)}>
                    Coming Soon
                  </Link>
                </div>
              )}
            </div>
            <Link to="/now-showing">Book Ticket</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <form className="nav-search" onSubmit={handleSearch}>
            <input placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit" aria-label="Search">
              <i className="fa fa-search" />
            </button>
          </form>
          <div className="header-actions">
            {customer ? (
              <div ref={profileRef} className="nav-dropdown">
                <button type="button" className="nav-link" onClick={() => setProfileOpen((o) => !o)}>
                  <i className="fa fa-user-circle" /> {customer.fullName.slice(0, 12)}
                </button>
                {profileOpen && (
                  <div className="nav-dropdown-menu right">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}>
                      <i className="fa fa-user" /> My Profile
                    </Link>
                    <button type="button" onClick={handleLogout} style={{ color: "#ff6b6b" }}>
                      <i className="fa fa-sign-out" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <Footer />

      <Link to="/feedback" className="feedback-floating-btn" title="Send Feedback">
        <i className="fa fa-comment" />
      </Link>
    </>
  );
}
