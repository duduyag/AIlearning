import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { CURRICULUM, LevelSeed } from "./curriculum";
import { CURRICULUM_HE } from "./curriculum.he";

const prisma = new PrismaClient();

const imagesPath = path.join(__dirname, "lessonImages.json");
const IMAGES: Record<string, string> = fs.existsSync(imagesPath) ? JSON.parse(fs.readFileSync(imagesPath, "utf-8")) : {};

function imageUrl(key: string | null): string | null {
  if (!key) return null;
  return IMAGES[key] ?? null;
}

function findLevelHe(key: string): LevelSeed | undefined {
  return CURRICULUM_HE.find((l) => l.key === key);
}

const ACHIEVEMENTS = [
  { key: "first_lesson", name: "First Steps", nameHe: "צעדים ראשונים", description: "Complete your very first lesson.", descriptionHe: "השלימו את השיעור הראשון שלכם.", icon: "footprints", criteria: { type: "lessons_completed", value: 1 } },
  { key: "streak_3", name: "3-Day Learner", nameHe: "לומד/ת 3 ימים", description: "Learn 3 days in a row.", descriptionHe: "למדו 3 ימים ברצף.", icon: "flame", criteria: { type: "streak", value: 3 } },
  { key: "streak_7", name: "Week of Wonder", nameHe: "שבוע של פלאים", description: "Learn 7 days in a row.", descriptionHe: "למדו 7 ימים ברצף.", icon: "flame", criteria: { type: "streak", value: 7 } },
  { key: "beginner_grad", name: "AI Beginner Graduate", nameHe: "בוגר/ת מסלול המתחילים", description: "Complete every lesson in the Beginner level.", descriptionHe: "השלימו את כל השיעורים ברמת המתחילים.", icon: "star", criteria: { type: "level_completed", value: 1 } },
  { key: "intermediate_grad", name: "AI Pro", nameHe: "מומחה/ית AI", description: "Complete every lesson in the Intermediate level.", descriptionHe: "השלימו את כל השיעורים ברמת הביניים.", icon: "trending-up", criteria: { type: "level_completed", value: 2 } },
  { key: "advanced_grad", name: "AI Explorer Graduate", nameHe: "בוגר/ת חוקר/ת AI", description: "Complete every lesson in the whole course.", descriptionHe: "השלימו את כל השיעורים בקורס כולו.", icon: "crown", criteria: { type: "level_completed", value: 3 } },
  { key: "sharp_mind", name: "Sharp Mind", nameHe: "מוח חד", description: "Score 100% on 5 quizzes.", descriptionHe: "קבלו 100% ב-5 חידונים.", icon: "brain", criteria: { type: "perfect_quizzes", value: 5 } },
  { key: "curious_questioner", name: "Curious Questioner", nameHe: "שואל/ת סקרן/ית", description: "Ask the AI tutor a question.", descriptionHe: "שאלו את מורה ה-AI שאלה.", icon: "message-circle", criteria: { type: "tutor_messages", value: 1 } },
];

async function main() {
  for (const level of CURRICULUM) {
    const levelHe = findLevelHe(level.key);

    const dbLevel = await prisma.courseLevel.upsert({
      where: { key: level.key },
      update: {
        name: level.name,
        nameHe: levelHe?.name ?? "",
        description: level.description,
        descriptionHe: levelHe?.description ?? "",
        order: level.order,
        minAge: level.minAge,
        maxAge: level.maxAge,
        heroImageUrl: imageUrl(level.imageKey),
      },
      create: {
        key: level.key,
        name: level.name,
        nameHe: levelHe?.name ?? "",
        description: level.description,
        descriptionHe: levelHe?.description ?? "",
        order: level.order,
        minAge: level.minAge,
        maxAge: level.maxAge,
        heroImageUrl: imageUrl(level.imageKey),
      },
    });

    for (const unit of level.units) {
      const unitHe = levelHe?.units.find((u) => u.key === unit.key);

      const dbUnit = await prisma.unit.upsert({
        where: { levelId_key: { levelId: dbLevel.id, key: unit.key } },
        update: {
          name: unit.name,
          nameHe: unitHe?.name ?? "",
          description: unit.description,
          descriptionHe: unitHe?.description ?? "",
          order: unit.order,
        },
        create: {
          levelId: dbLevel.id,
          key: unit.key,
          name: unit.name,
          nameHe: unitHe?.name ?? "",
          description: unit.description,
          descriptionHe: unitHe?.description ?? "",
          order: unit.order,
        },
      });

      for (const lesson of unit.lessons) {
        const lessonHe = unitHe?.lessons.find((l) => l.key === lesson.key);

        const resolvedContent = lesson.content.map((block) =>
          block.type === "image" ? { type: "image", url: imageUrl(block.imageKey) ?? "", alt: block.alt } : block
        );
        const resolvedContentHe = (lessonHe?.content ?? []).map((block) =>
          block.type === "image" ? { type: "image", url: imageUrl(block.imageKey) ?? "", alt: block.alt } : block
        );

        const dbLesson = await prisma.lesson.upsert({
          where: { unitId_key: { unitId: dbUnit.id, key: lesson.key } },
          update: {
            title: lesson.title,
            titleHe: lessonHe?.title ?? "",
            order: lesson.order,
            estimatedMinutes: lesson.estimatedMinutes,
            heroImageUrl: imageUrl(lesson.imageKey),
            content: resolvedContent,
            contentHe: resolvedContentHe,
            tutorPromptSuggestions: lesson.tutorPromptSuggestions,
            tutorPromptSuggestionsHe: lessonHe?.tutorPromptSuggestions ?? [],
          },
          create: {
            unitId: dbUnit.id,
            key: lesson.key,
            title: lesson.title,
            titleHe: lessonHe?.title ?? "",
            order: lesson.order,
            estimatedMinutes: lesson.estimatedMinutes,
            heroImageUrl: imageUrl(lesson.imageKey),
            content: resolvedContent,
            contentHe: resolvedContentHe,
            tutorPromptSuggestions: lesson.tutorPromptSuggestions,
            tutorPromptSuggestionsHe: lessonHe?.tutorPromptSuggestions ?? [],
          },
        });

        await prisma.quizQuestion.deleteMany({ where: { lessonId: dbLesson.id } });
        for (let i = 0; i < lesson.quiz.length; i++) {
          const q = lesson.quiz[i];
          const qHe = lessonHe?.quiz[i];
          await prisma.quizQuestion.create({
            data: {
              lessonId: dbLesson.id,
              questionText: q.questionText,
              questionTextHe: qHe?.questionText ?? "",
              options: q.options,
              optionsHe: qHe?.options ?? [],
              correctAnswer: q.correctAnswer,
              correctAnswerHe: qHe?.correctAnswer ?? "",
              explanation: q.explanation,
              explanationHe: qHe?.explanation ?? "",
              order: i,
            },
          });
        }
      }
    }
  }

  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: achievement,
      create: achievement,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aiexplorers.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: "admin",
      passwordHash,
      displayName: "Admin",
      role: "ADMIN",
      ageGroup: 12,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword} (change this immediately in production)`);
  if (Object.keys(IMAGES).length === 0) {
    console.warn("No lessonImages.json found - lessons were seeded without hero images. Re-run seed after adding it.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
