import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { attachPrincipal } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(attachPrincipal);

// Uploaded movie posters/banners/slider images — replaces legacy's Images/
// (and inconsistently-cased images/) directories served directly by Apache.
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
