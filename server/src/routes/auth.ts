import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { toUserDTO } from "../lib/mappers";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { env } from "../lib/env";
import { AuthResponse } from "@ai-explorers/shared";

const router = Router();

const REFRESH_COOKIE = "aie_refresh";
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(8).max(72),
  displayName: z.string().min(1).max(40),
  ageGroup: z.number().int().min(7).max(12).default(9),
  language: z.enum(["EN", "HE"]).default("EN"),
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const body = signupSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: body.email }, { username: body.username }] },
    });
    if (existing) {
      throw new ApiError(409, "An account with that email or username already exists");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        passwordHash,
        displayName: body.displayName,
        ageGroup: body.ageGroup,
        language: body.language,
      },
    });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

    const response: AuthResponse = { user: toUserDTO(user), accessToken };
    res.status(201).json(response);
  })
);

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: body.emailOrUsername }, { username: body.emailOrUsername }] },
    });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

    const response: AuthResponse = { user: toUserDTO(user), accessToken };
    res.json(response);
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new ApiError(401, "No refresh token");

    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new ApiError(401, "User no longer exists");

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const response: AuthResponse = { user: toUserDTO(user), accessToken };
    res.json(response);
  })
);

router.post("/logout", (_req, res) => {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.status(204).send();
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new ApiError(404, "User not found");
    res.json(toUserDTO(user));
  })
);

export default router;
