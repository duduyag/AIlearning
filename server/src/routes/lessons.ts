import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { getLessonDetailForUser, getNextLessonId, isLastLesson, LessonLockedError } from "../lib/curriculum";
import { nextStreakState } from "../lib/streak";
import { checkAndUnlockAchievements } from "../lib/achievements";
import { askTutor } from "../ai";
import { QuizSubmitRequest, QuizSubmitResultDTO, QUIZ_PASS_THRESHOLD, TutorAskRequest, TutorAskResponse } from "@ai-explorers/shared";

const router = Router();
router.use(requireAuth);

const submitSchema = z.object({
  answers: z.array(z.object({ questionId: z.string(), answer: z.string() })).min(1),
});

router.post(
  "/:id/quiz",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.id;
    const lessonId = req.params.id;
    const body: QuizSubmitRequest = submitSchema.parse(req.body);

    let lesson;
    try {
      lesson = await getLessonDetailForUser(userId, lessonId);
    } catch (err) {
      if (err instanceof LessonLockedError) throw new ApiError(403, err.message);
      throw err;
    }
    if (!lesson) throw new ApiError(404, "Lesson not found");

    const questions = await prisma.quizQuestion.findMany({ where: { lessonId } });
    if (questions.length === 0) throw new ApiError(400, "This lesson has no quiz");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const isHebrew = user.language === "HE";

    // The learner answers using whichever language the question was displayed in,
    // so grade against that same language's correct-answer text.
    const results = questions.map((q) => {
      const submitted = body.answers.find((a) => a.questionId === q.id);
      const correctAnswerForLanguage = isHebrew && q.correctAnswerHe ? q.correctAnswerHe : q.correctAnswer;
      const explanationForLanguage = isHebrew && q.explanationHe ? q.explanationHe : q.explanation;
      const correct = (submitted?.answer.trim().toLowerCase() ?? "") === correctAnswerForLanguage.trim().toLowerCase();
      return { questionId: q.id, correct, correctAnswer: correctAnswerForLanguage, explanation: explanationForLanguage };
    });

    const correctCount = results.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage / 100 >= QUIZ_PASS_THRESHOLD;

    const existingProgress = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
    const wasAlreadyCompleted = existingProgress?.status === "COMPLETED";

    const xpEarned = correctCount * 10 + (passed && !wasAlreadyCompleted ? 30 : 0);

    const streakUpdate =
      passed && !wasAlreadyCompleted
        ? nextStreakState(user.lastActiveDate, user.currentStreak, user.longestStreak)
        : { currentStreak: user.currentStreak, longestStreak: user.longestStreak, lastActiveDate: user.lastActiveDate };

    await Promise.all([
      prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {
          attempts: { increment: 1 },
          bestScore: Math.max(existingProgress?.bestScore ?? 0, percentage),
          status: passed ? "COMPLETED" : "IN_PROGRESS",
          completedAt: passed && !wasAlreadyCompleted ? new Date() : existingProgress?.completedAt,
        },
        create: {
          userId,
          lessonId,
          attempts: 1,
          bestScore: percentage,
          status: passed ? "COMPLETED" : "IN_PROGRESS",
          completedAt: passed ? new Date() : null,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: { increment: xpEarned },
          currentStreak: streakUpdate.currentStreak,
          longestStreak: streakUpdate.longestStreak,
          lastActiveDate: streakUpdate.lastActiveDate,
        },
      }),
    ]);

    const unlockedAchievements = await checkAndUnlockAchievements(userId);
    const nextLessonId = passed ? await getNextLessonId(lessonId) : null;
    const courseComplete = passed && (await isLastLesson(lessonId));

    const result: QuizSubmitResultDTO = {
      score: correctCount,
      totalQuestions: questions.length,
      passed,
      xpEarned,
      unlockedAchievements,
      results,
      nextLessonId,
      courseComplete,
    };

    res.json(result);
  })
);

const askSchema = z.object({
  message: z.string().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

router.post(
  "/:id/tutor",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.id;
    const lessonId = req.params.id;
    const body: TutorAskRequest = askSchema.parse(req.body);

    let lesson;
    try {
      lesson = await getLessonDetailForUser(userId, lessonId);
    } catch (err) {
      if (err instanceof LessonLockedError) throw new ApiError(403, err.message);
      throw err;
    }
    if (!lesson) throw new ApiError(404, "Lesson not found");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const lessonContext = lesson.content
      .filter((b) => b.type === "text" || b.type === "callout")
      .map((b) => ("text" in b ? b.text : ""))
      .join(" ")
      .slice(0, 1200);

    const { reply } = await askTutor({
      lessonTitle: lesson.title,
      lessonContext,
      history: (body.history ?? []).slice(-10),
      message: body.message,
      ageGroup: user.ageGroup,
      language: user.language,
    });

    await prisma.user.update({ where: { id: userId }, data: { tutorMessagesSent: { increment: 1 } } });
    const unlockedAchievements = await checkAndUnlockAchievements(userId);

    const response: TutorAskResponse & { unlockedAchievements: typeof unlockedAchievements } = {
      reply,
      unlockedAchievements,
    };
    res.json(response);
  })
);

export default router;
