import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { toUserDTO } from "../lib/mappers";
import { getCourseForUser } from "../lib/curriculum";
import { DashboardStatsDTO } from "@ai-explorers/shared";

const router = Router();
router.use(requireAuth);

const languageSchema = z.object({ language: z.enum(["EN", "HE"]) });

router.patch(
  "/me/language",
  asyncHandler(async (req: AuthedRequest, res) => {
    const { language } = languageSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: { language } });
    res.json(toUserDTO(user));
  })
);

router.get(
  "/me/dashboard",
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.id;

    const [user, course, unlockedAchievements] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      getCourseForUser(userId),
      prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: "desc" } }),
    ]);

    const allLessons = course.flatMap((l) => l.units.flatMap((u) => u.lessons.map((lesson) => ({ ...lesson, unitName: u.name, levelName: l.name }))));
    const lessonsCompleted = allLessons.filter((l) => l.status === "COMPLETED").length;
    const currentLesson = allLessons.find((l) => l.status === "AVAILABLE") ?? null;

    const dto: DashboardStatsDTO = {
      totalXp: user.totalXp,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lessonsCompleted,
      totalLessons: allLessons.length,
      percentComplete: allLessons.length > 0 ? Math.round((lessonsCompleted / allLessons.length) * 100) : 0,
      currentLesson: currentLesson
        ? { id: currentLesson.id, key: currentLesson.key, title: currentLesson.title, unitName: currentLesson.unitName, levelName: currentLesson.levelName }
        : null,
      achievements: unlockedAchievements.map((ua) => ({
        id: ua.achievement.id,
        key: ua.achievement.key,
        name: user.language === "HE" && ua.achievement.nameHe ? ua.achievement.nameHe : ua.achievement.name,
        description: user.language === "HE" && ua.achievement.descriptionHe ? ua.achievement.descriptionHe : ua.achievement.description,
        icon: ua.achievement.icon,
        unlockedAt: ua.unlockedAt.toISOString(),
      })),
    };

    res.json(dto);
  })
);

export default router;
