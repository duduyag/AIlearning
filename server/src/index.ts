import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./lib/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRouter from "./routes/auth";
import courseRouter from "./routes/course";
import lessonsRouter from "./routes/lessons";
import usersRouter from "./routes/users";
import achievementsRouter from "./routes/achievements";
import adminRouter from "./routes/admin";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
const tutorLimiter = rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/course", apiLimiter, courseRouter);
app.use("/api/lessons", tutorLimiter, lessonsRouter);
app.use("/api/users", apiLimiter, usersRouter);
app.use("/api/achievements", apiLimiter, achievementsRouter);
app.use("/api/admin", apiLimiter, adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`AI Explorers API listening on http://localhost:${env.PORT}`);
});
