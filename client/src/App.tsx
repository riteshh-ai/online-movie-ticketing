import { Route, Routes } from "react-router-dom";
import { RequireAdmin } from "./components/RequireAdmin";
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
      <Route path="/" element={<HomePage />} />
      <Route path="/now-showing" element={<NowShowingPage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />
      <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
      <Route path="/booking/:showId" element={<BookingPage />} />
      <Route path="/payment/:outcome" element={<PaymentResultPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin panel — mirrors legacy /Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
      <Route path="/admin/movies" element={<RequireAdmin><AdminMoviesPage /></RequireAdmin>} />
      <Route path="/admin/cinemas" element={<RequireAdmin><AdminCinemasPage /></RequireAdmin>} />
      <Route path="/admin/shows" element={<RequireAdmin><AdminShowsPage /></RequireAdmin>} />
      <Route path="/admin/seats" element={<RequireAdmin><AdminSeatsPage /></RequireAdmin>} />
      <Route path="/admin/bookings" element={<RequireAdmin><AdminBookingsPage /></RequireAdmin>} />
      <Route path="/admin/customers" element={<RequireAdmin><AdminCustomersPage /></RequireAdmin>} />
      <Route path="/admin/contacts" element={<RequireAdmin><AdminContactsPage /></RequireAdmin>} />
      <Route path="/admin/feedback" element={<RequireAdmin><AdminFeedbackPage /></RequireAdmin>} />
      <Route path="/admin/sliders" element={<RequireAdmin><AdminSlidersPage /></RequireAdmin>} />
      <Route path="/admin/admins" element={<RequireAdmin><AdminAdminsPage /></RequireAdmin>} />
      <Route path="/admin/catalog" element={<RequireAdmin><AdminCatalogPage /></RequireAdmin>} />
    </Routes>
  );
}
