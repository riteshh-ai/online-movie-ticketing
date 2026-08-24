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

// Replaces legacy/Admin/admin_sidenavbar.php + admin_header.php + admin_footer.php.
// Which links are USEFUL vs. what the SERVER actually allows are two different
// things — every /api/admin/* route re-checks role server-side regardless of
// what's shown here (see server/src/middleware/auth.ts).
export function AdminLayout() {
  const { admin, setAdmin } = useAuth();

  async function handleLogout() {
    await AdminAuth.logout().catch(() => {});
    setAdmin(null);
    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="brand">
          MyCine<span>Zone</span>
        </Link>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            {admin?.role === "SUPER_ADMIN" ? "Super Admin" : "Cinema Admin"}
            {admin?.cinemaId ? ` · Cinema #${admin.cinemaId}` : ""}
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
