import { Router } from "express";
import { adminRouter } from "./admin/index.js";
import { authRouter } from "./auth.routes.js";
import { bookingsRouter } from "./bookings.routes.js";
import { cinemasRouter } from "./cinemas.routes.js";
import { contactRouter } from "./contact.routes.js";
import { feedbackRouter } from "./feedback.routes.js";
import { moviesRouter } from "./movies.routes.js";
import { paymentsRouter } from "./payments.routes.js";
import { showsRouter } from "./shows.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));

apiRouter.use("/auth", authRouter);
apiRouter.use("/movies", moviesRouter);
apiRouter.use("/shows", showsRouter);
apiRouter.use("/cinemas", cinemasRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/feedback", feedbackRouter);
apiRouter.use("/admin", adminRouter);
