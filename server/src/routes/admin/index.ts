import { Router } from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { adminAdminsRouter } from "./admins.routes.js";
import { adminAuthRouter } from "./auth.routes.js";
import { adminBookingsRouter } from "./bookings.routes.js";
import { adminCatalogRouter } from "./catalog.routes.js";
import { adminCinemasRouter } from "./cinemas.routes.js";
import { adminContactsRouter } from "./contacts.routes.js";
import { adminCustomersRouter } from "./customers.routes.js";
import { adminDashboardRouter } from "./dashboard.routes.js";
import { adminFeedbackRouter } from "./feedback.routes.js";
import { adminMoviesRouter } from "./movies.routes.js";
import { adminSeatsRouter } from "./seats.routes.js";
import { adminShowsRouter } from "./shows.routes.js";
import { adminSlidersRouter } from "./sliders.routes.js";

export const adminRouter = Router();

// Login/logout must stay unauthenticated — everything else under /api/admin
// requires a valid admin session token, checked centrally here rather than
// per-page like legacy did (PROJECT_REFERENCE.md §10.6).
adminRouter.use("/auth", adminAuthRouter);

adminRouter.use(requireAdmin);
adminRouter.use("/dashboard", adminDashboardRouter);
adminRouter.use("/movies", adminMoviesRouter);
adminRouter.use("/cinemas", adminCinemasRouter);
adminRouter.use("/shows", adminShowsRouter);
adminRouter.use("/seats", adminSeatsRouter);
adminRouter.use("/bookings", adminBookingsRouter);
adminRouter.use("/customers", adminCustomersRouter);
adminRouter.use("/contacts", adminContactsRouter);
adminRouter.use("/feedback", adminFeedbackRouter);
adminRouter.use("/sliders", adminSlidersRouter);
adminRouter.use("/admins", adminAdminsRouter);
adminRouter.use(adminCatalogRouter); // mounts /genres, /industries, /languages, /showtimes directly
