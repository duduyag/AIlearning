import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { toUserDTO } from "../lib/mappers";

const router = Router();
router.use(requireAuth, requireAdmin);

// ---- Analytics ----
router.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    const [totalUsers, totalLessons, lessonsCompleted, avgXpAgg, tutorMessagesAgg] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.userLessonProgress.count({ where: { status: "COMPLETED" } }),
      prisma.user.aggregate({ _avg: { totalXp: true } }),
      prisma.user.aggregate({ _sum: { tutorMessagesSent: true } }),
    ]);

    res.json({
      totalUsers,
      totalLessons,
      lessonsCompleted,
      avgXp: Math.round(avgXpAgg._avg.totalXp ?? 0),
      totalTutorMessages: tutorMessagesAgg._sum.tutorMessagesSent ?? 0,
    });
  })
);

// ---- Levels ----
router.get(
  "/levels",
  asyncHandler(async (_req, res) => {
    const levels = await prisma.courseLevel.findMany({
      orderBy: { order: "asc" },
      include: { units: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
    });
    res.json(levels);
  })
);

const levelSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(0),
  minAge: z.number().int().min(5).max(18).default(7),
  maxAge: z.number().int().min(5).max(18).default(12),
  heroImageUrl: z.string().url().nullable().optional(),
});

router.post(
  "/levels",
  asyncHandler(async (req, res) => {
    const body = levelSchema.parse(req.body);
    const level = await prisma.courseLevel.create({ data: body });
    res.status(201).json(level);
  })
);

router.patch(
  "/levels/:id",
  asyncHandler(async (req, res) => {
    const body = levelSchema.partial().parse(req.body);
    const level = await prisma.courseLevel.update({ where: { id: req.params.id }, data: body });
    res.json(level);
  })
);

router.delete(
  "/levels/:id",
  asyncHandler(async (req, res) => {
    await prisma.courseLevel.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// ---- Units ----
const unitSchema = z.object({
  levelId: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(0),
});

router.post(
  "/units",
  asyncHandler(async (req, res) => {
    const body = unitSchema.parse(req.body);
    const unit = await prisma.unit.create({ data: body });
    res.status(201).json(unit);
  })
);

router.patch(
  "/units/:id",
  asyncHandler(async (req, res) => {
    const body = unitSchema.partial().parse(req.body);
    const unit = await prisma.unit.update({ where: { id: req.params.id }, data: body });
    res.json(unit);
  })
);

router.delete(
  "/units/:id",
  asyncHandler(async (req, res) => {
    await prisma.unit.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// ---- Lessons ----
const contentBlockSchema = z.union([
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("callout"), text: z.string() }),
  z.object({ type: z.literal("image"), url: z.string(), alt: z.string(), caption: z.string().optional() }),
]);

const lessonSchema = z.object({
  unitId: z.string().min(1),
  key: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().min(1).max(60).default(5),
  heroImageUrl: z.string().url().nullable().optional(),
  content: z.array(contentBlockSchema),
  tutorPromptSuggestions: z.array(z.string()).default([]),
});

router.get(
  "/lessons/:id",
  asyncHandler(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.id }, include: { quizQuestions: { orderBy: { order: "asc" } } } });
    if (!lesson) throw new ApiError(404, "Lesson not found");
    res.json(lesson);
  })
);

router.post(
  "/lessons",
  asyncHandler(async (req, res) => {
    const body = lessonSchema.parse(req.body);
    const lesson = await prisma.lesson.create({ data: body });
    res.status(201).json(lesson);
  })
);

router.patch(
  "/lessons/:id",
  asyncHandler(async (req, res) => {
    const body = lessonSchema.partial().parse(req.body);
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: body });
    res.json(lesson);
  })
);

router.delete(
  "/lessons/:id",
  asyncHandler(async (req, res) => {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// ---- Quiz questions ----
const quizQuestionSchema = z.object({
  lessonId: z.string().min(1),
  questionText: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

router.post(
  "/quiz-questions",
  asyncHandler(async (req, res) => {
    const body = quizQuestionSchema.parse(req.body);
    if (!body.options.includes(body.correctAnswer)) {
      throw new ApiError(400, "correctAnswer must be one of the provided options");
    }
    const question = await prisma.quizQuestion.create({ data: body });
    res.status(201).json(question);
  })
);

router.patch(
  "/quiz-questions/:id",
  asyncHandler(async (req, res) => {
    const body = quizQuestionSchema.partial().parse(req.body);
    if (body.options && body.correctAnswer && !body.options.includes(body.correctAnswer)) {
      throw new ApiError(400, "correctAnswer must be one of the provided options");
    }
    const question = await prisma.quizQuestion.update({ where: { id: req.params.id }, data: body });
    res.json(question);
  })
);

router.delete(
  "/quiz-questions/:id",
  asyncHandler(async (req, res) => {
    await prisma.quizQuestion.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// ---- Achievements ----
router.get(
  "/achievements",
  asyncHandler(async (_req, res) => {
    const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: "asc" } });
    res.json(achievements);
  })
);

const achievementSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  criteria: z.object({
    type: z.enum(["lessons_completed", "streak", "level_completed", "perfect_quizzes", "tutor_messages"]),
    value: z.number().int().min(1),
  }),
});

router.post(
  "/achievements",
  asyncHandler(async (req, res) => {
    const body = achievementSchema.parse(req.body);
    const achievement = await prisma.achievement.create({ data: body });
    res.status(201).json(achievement);
  })
);

router.patch(
  "/achievements/:id",
  asyncHandler(async (req, res) => {
    const body = achievementSchema.partial().parse(req.body);
    const achievement = await prisma.achievement.update({ where: { id: req.params.id }, data: body });
    res.json(achievement);
  })
);

router.delete(
  "/achievements/:id",
  asyncHandler(async (req, res) => {
    await prisma.achievement.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// ---- Users ----
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = 25;

    const where = search
      ? { OR: [{ username: { contains: search, mode: "insensitive" as const } }, { email: { contains: search, mode: "insensitive" as const } }] }
      : {};

    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.user.count({ where }),
    ]);

    res.json({ items: items.map(toUserDTO), total, page, pageSize });
  })
);

const roleSchema = z.object({ role: z.enum(["LEARNER", "ADMIN"]) });

router.patch(
  "/users/:id/role",
  asyncHandler(async (req, res) => {
    const { role } = roleSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
    res.json(toUserDTO(user));
  })
);

export default router;
