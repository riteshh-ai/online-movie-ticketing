import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { Layout } from "./components/Layout";
import { RequireAdmin } from "./components/RequireAdmin";
import { RequireCustomer } from "./components/RequireCustomer";
import { AboutPage } from "./pages/AboutPage";
import { BookingPage } from "./pages/BookingPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { ContactPage } from "./pages/ContactPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { NowShowingPage } from "./pages/NowShowingPage";
import { PaymentResultPage } from "./pages/PaymentResultPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { TermsPage } from "./pages/TermsPage";
import { AdminAdminsPage } from "./pages/admin/AdminAdminsPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminCatalogPage } from "./pages/admin/AdminCatalogPage";
import { AdminCinemasPage } from "./pages/admin/AdminCinemasPage";
import { AdminContactsPage } from "./pages/admin/AdminContactsPage";
import { AdminCustomersPage } from "./pages/admin/AdminCustomersPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminFeedbackPage } from "./pages/admin/AdminFeedbackPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminMoviesPage } from "./pages/admin/AdminMoviesPage";
import { AdminSeatsPage } from "./pages/admin/AdminSeatsPage";
import { AdminShowsPage } from "./pages/admin/AdminShowsPage";
import { AdminSlidersPage } from "./pages/admin/AdminSlidersPage";

export function App() {
  return (
    <Routes>
      {/* Public site — mirrors legacy site root */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/now-showing" element={<NowShowingPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
        <Route
          path="/booking/:showId"
          element={
            <RequireCustomer>
              <BookingPage />
            </RequireCustomer>
          }
        />
        <Route path="/payment/:outcome" element={<PaymentResultPage />} />
        <Route
          path="/profile"
          element={
            <RequireCustomer>
              <ProfilePage />
            </RequireCustomer>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin panel — mirrors legacy /Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/movies" element={<AdminMoviesPage />} />
        <Route path="/admin/cinemas" element={<AdminCinemasPage />} />
        <Route path="/admin/shows" element={<AdminShowsPage />} />
        <Route path="/admin/seats" element={<AdminSeatsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/contacts" element={<AdminContactsPage />} />
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
        <Route path="/admin/sliders" element={<AdminSlidersPage />} />
        <Route path="/admin/admins" element={<AdminAdminsPage />} />
        <Route path="/admin/catalog" element={<AdminCatalogPage />} />
      </Route>
    </Routes>
  );
}
