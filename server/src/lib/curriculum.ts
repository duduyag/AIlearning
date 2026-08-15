import { prisma } from "./prisma";
import {
  CourseLevelDTO,
  Language,
  LessonContentBlock,
  LessonDetailDTO,
  LessonStatus,
  LessonSummaryDTO,
  QuizQuestionDTO,
} from "@ai-explorers/shared";

/** Fetches the full curriculum tree (levels -> units -> lessons) in a single, stable global order. */
async function getFullCurriculum() {
  return prisma.courseLevel.findMany({
    orderBy: { order: "asc" },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
}

/** Flattens the curriculum into one linear sequence, which defines unlock order. */
function flattenLessons(levels: Awaited<ReturnType<typeof getFullCurriculum>>) {
  const flat: { id: string; unitId: string }[] = [];
  for (const level of levels) {
    for (const unit of level.units) {
      for (const lesson of unit.lessons) {
        flat.push({ id: lesson.id, unitId: unit.id });
      }
    }
  }
  return flat;
}

async function getCompletedLessonIdSet(userId: string): Promise<Set<string>> {
  const rows = await prisma.userLessonProgress.findMany({
    where: { userId, status: "COMPLETED" },
    select: { lessonId: true },
  });
  return new Set(rows.map((r) => r.lessonId));
}

function computeStatus(index: number, lessonId: string, completed: Set<string>, flat: { id: string }[]): LessonStatus {
  if (completed.has(lessonId)) return "COMPLETED";
  if (index === 0) return "AVAILABLE";
  const prev = flat[index - 1];
  return completed.has(prev.id) ? "AVAILABLE" : "LOCKED";
}

async function getUserLanguage(userId: string): Promise<Language> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { language: true } });
  return user.language;
}

function pick(en: string, he: string, language: Language): string {
  return language === "HE" && he ? he : en;
}

export async function getCourseForUser(userId: string): Promise<CourseLevelDTO[]> {
  const [language, levels, completed, bestScores] = await Promise.all([
    getUserLanguage(userId),
    getFullCurriculum(),
    getCompletedLessonIdSet(userId),
    prisma.userLessonProgress.findMany({ where: { userId }, select: { lessonId: true, bestScore: true } }),
  ]);
  const flat = flattenLessons(levels);
  const scoreMap = new Map(bestScores.map((b) => [b.lessonId, b.bestScore]));

  return levels.map((level) => ({
    id: level.id,
    key: level.key,
    name: pick(level.name, level.nameHe, language),
    description: pick(level.description, level.descriptionHe, language),
    order: level.order,
    minAge: level.minAge,
    maxAge: level.maxAge,
    heroImageUrl: level.heroImageUrl,
    units: level.units.map((unit) => ({
      id: unit.id,
      key: unit.key,
      name: pick(unit.name, unit.nameHe, language),
      description: pick(unit.description, unit.descriptionHe, language),
      order: unit.order,
      lessons: unit.lessons.map((lesson): LessonSummaryDTO => {
        const index = flat.findIndex((f) => f.id === lesson.id);
        return {
          id: lesson.id,
          key: lesson.key,
          title: pick(lesson.title, lesson.titleHe, language),
          order: lesson.order,
          heroImageUrl: lesson.heroImageUrl,
          estimatedMinutes: lesson.estimatedMinutes,
          status: computeStatus(index, lesson.id, completed, flat),
          quizBestScore: scoreMap.get(lesson.id) ?? null,
        };
      }),
    })),
  }));
}

export class LessonLockedError extends Error {
  constructor() {
    super("This lesson is still locked");
  }
}

export async function getLessonDetailForUser(userId: string, lessonId: string): Promise<LessonDetailDTO | null> {
  const [language, levels] = await Promise.all([getUserLanguage(userId), getFullCurriculum()]);
  const flat = flattenLessons(levels);
  const index = flat.findIndex((f) => f.id === lessonId);
  if (index === -1) return null;

  const completed = await getCompletedLessonIdSet(userId);
  const status = computeStatus(index, lessonId, completed, flat);

  let lessonRecord: (typeof levels)[number]["units"][number]["lessons"][number] | undefined;
  let unitName = "";
  let levelName = "";
  let levelOrder = 1;
  for (const level of levels) {
    for (const unit of level.units) {
      const found = unit.lessons.find((l) => l.id === lessonId);
      if (found) {
        lessonRecord = found;
        unitName = pick(unit.name, unit.nameHe, language);
        levelName = pick(level.name, level.nameHe, language);
        levelOrder = level.order;
      }
    }
  }
  if (!lessonRecord) return null;

  if (status === "LOCKED") {
    throw new LessonLockedError();
  }

  const [quizQuestions, progress] = await Promise.all([
    prisma.quizQuestion.findMany({ where: { lessonId }, orderBy: { order: "asc" } }),
    prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }),
  ]);

  const quiz: QuizQuestionDTO[] = quizQuestions.map((q) => ({
    id: q.id,
    questionText: pick(q.questionText, q.questionTextHe, language),
    options: (language === "HE" && (q.optionsHe as unknown as string[]).length ? q.optionsHe : q.options) as unknown as string[],
  }));

  const contentHe = lessonRecord.contentHe as unknown as LessonContentBlock[];
  const content = language === "HE" && contentHe.length ? contentHe : (lessonRecord.content as unknown as LessonContentBlock[]);

  const tutorHe = lessonRecord.tutorPromptSuggestionsHe as unknown as string[];
  const tutorPromptSuggestions =
    language === "HE" && tutorHe.length ? tutorHe : (lessonRecord.tutorPromptSuggestions as unknown as string[]);

  return {
    id: lessonRecord.id,
    unitId: lessonRecord.unitId,
    unitName,
    levelName,
    levelOrder,
    key: lessonRecord.key,
    title: pick(lessonRecord.title, lessonRecord.titleHe, language),
    heroImageUrl: lessonRecord.heroImageUrl,
    estimatedMinutes: lessonRecord.estimatedMinutes,
    content,
    quiz,
    tutorPromptSuggestions,
    status,
    quizBestScore: progress?.bestScore ?? null,
    nextLessonId: flat[index + 1]?.id ?? null,
    prevLessonId: flat[index - 1]?.id ?? null,
  };
}

export async function getNextLessonId(afterLessonId: string): Promise<string | null> {
  const levels = await getFullCurriculum();
  const flat = flattenLessons(levels);
  const index = flat.findIndex((f) => f.id === afterLessonId);
  if (index === -1) return null;
  return flat[index + 1]?.id ?? null;
}

export async function isLastLesson(lessonId: string): Promise<boolean> {
  const levels = await getFullCurriculum();
  const flat = flattenLessons(levels);
  return flat.length > 0 && flat[flat.length - 1].id === lessonId;
}

export async function totalLessonCount(): Promise<number> {
  return prisma.lesson.count();
}
