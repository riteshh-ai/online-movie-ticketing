import { Link, NavLink, Outlet } from "react-router-dom";
import { AdminAuth } from "../api";
import { useAuth } from "../context/AuthContext";

const links: Array<[string, string]> = [
  ["/admin", "Dashboard"],
  ["/admin/movies", "Movies"],
  ["/admin/cinemas", "Cinemas"],
  ["/admin/shows", "Shows"],
  ["/admin/seats", "Seats"],
  ["/admin/bookings", "Bookings"],
  ["/admin/catalog", "Catalog"],
  ["/admin/sliders", "Sliders"],
  ["/admin/customers", "Customers"],
  ["/admin/contacts", "Contacts"],
  ["/admin/feedback", "Feedback"],
  ["/admin/admins", "Admins"],
];

// Ported from legacy/Admin/admin_header.php (black top navbar, "Admin Panel
// - {cinema}" branding) + admin_sidenavbar.php (black sidebar, maroon hover
// accent). Which links show is a UX nicety only — the SERVER re-checks
// role on every /api/admin/* route regardless (see server/src/middleware/auth.ts).
export function AdminLayout() {
  const { admin, setAdmin } = useAuth();

  async function handleLogout() {
    await AdminAuth.logout().catch(() => {});
    setAdmin(null);
    window.location.href = "/admin/login";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <nav className="admin-topnav">
        <Link to="/admin" className="brand">
          <img src="/logo.jpeg" alt="" />
          Admin Panel{admin?.cinemaName ? ` - ${admin.cinemaName}` : ""}
        </Link>
        <button className="btn btn-secondary btn-sm" style={{ color: "#fff", borderColor: "#fff" }} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <nav>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => (isActive ? "active" : "")}>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
