import { prisma } from "./prisma";
import { AchievementDTO } from "@ai-explorers/shared";

interface Criteria {
  type: "lessons_completed" | "streak" | "level_completed" | "perfect_quizzes" | "tutor_messages";
  value: number; // for level_completed, this is the CourseLevel's `order`
}

export async function checkAndUnlockAchievements(userId: string): Promise<AchievementDTO[]> {
  const [user, allAchievements, alreadyUnlocked] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ]);

  const unlockedIds = new Set(alreadyUnlocked.map((u) => u.achievementId));
  const locked = allAchievements.filter((a) => !unlockedIds.has(a.id));
  if (locked.length === 0) return [];

  const [lessonsCompleted, perfectQuizzes, completedLessonIds] = await Promise.all([
    prisma.userLessonProgress.count({ where: { userId, status: "COMPLETED" } }),
    prisma.userLessonProgress.count({ where: { userId, bestScore: 100 } }),
    prisma.userLessonProgress.findMany({ where: { userId, status: "COMPLETED" }, select: { lessonId: true } }),
  ]);

  const completedSet = new Set(completedLessonIds.map((c) => c.lessonId));

  const newlyUnlocked: typeof locked = [];
  for (const achievement of locked) {
    const criteria = achievement.criteria as unknown as Criteria;

    if (criteria.type === "lessons_completed" && lessonsCompleted >= criteria.value) {
      newlyUnlocked.push(achievement);
    } else if (criteria.type === "streak" && user.longestStreak >= criteria.value) {
      newlyUnlocked.push(achievement);
    } else if (criteria.type === "perfect_quizzes" && perfectQuizzes >= criteria.value) {
      newlyUnlocked.push(achievement);
    } else if (criteria.type === "tutor_messages" && user.tutorMessagesSent >= criteria.value) {
      newlyUnlocked.push(achievement);
    } else if (criteria.type === "level_completed") {
      const level = await prisma.courseLevel.findFirst({
        where: { order: criteria.value },
        include: { units: { include: { lessons: { select: { id: true } } } } },
      });
      if (level) {
        const levelLessonIds = level.units.flatMap((u) => u.lessons.map((l) => l.id));
        if (levelLessonIds.length > 0 && levelLessonIds.every((id) => completedSet.has(id))) {
          newlyUnlocked.push(achievement);
        }
      }
    }
  }

  if (newlyUnlocked.length === 0) return [];

  await prisma.userAchievement.createMany({
    data: newlyUnlocked.map((a) => ({ userId, achievementId: a.id })),
    skipDuplicates: true,
  });

  const isHebrew = user.language === "HE";
  return newlyUnlocked.map((a) => ({
    id: a.id,
    key: a.key,
    name: isHebrew && a.nameHe ? a.nameHe : a.name,
    description: isHebrew && a.descriptionHe ? a.descriptionHe : a.description,
    icon: a.icon,
    unlockedAt: new Date().toISOString(),
  }));
}
