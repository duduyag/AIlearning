import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { AchievementDTO } from "@ai-explorers/shared";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const [user, all, unlocked] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: req.user!.id }, select: { language: true } }),
      prisma.achievement.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId: req.user!.id } }),
    ]);
    const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));
    const isHebrew = user.language === "HE";

    const dto: (AchievementDTO & { unlocked: boolean })[] = all.map((a) => ({
      id: a.id,
      key: a.key,
      name: isHebrew && a.nameHe ? a.nameHe : a.name,
      description: isHebrew && a.descriptionHe ? a.descriptionHe : a.description,
      icon: a.icon,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id)?.toISOString(),
    }));

    res.json(dto);
  })
);

export default router;
