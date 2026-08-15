// Shared types used by both the Express API and the React client.
// Keep this file framework-agnostic (no Prisma / DOM types).

export type Role = "LEARNER" | "ADMIN";
export type Language = "EN" | "HE";
export type LessonStatus = "LOCKED" | "AVAILABLE" | "COMPLETED";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  language: Language;
  ageGroup: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface LessonSummaryDTO {
  id: string;
  key: string;
  title: string;
  order: number;
  heroImageUrl: string | null;
  estimatedMinutes: number;
  status: LessonStatus;
  quizBestScore: number | null;
}

export interface UnitDTO {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  lessons: LessonSummaryDTO[];
}

export interface CourseLevelDTO {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  minAge: number;
  maxAge: number;
  heroImageUrl: string | null;
  units: UnitDTO[];
}

export type LessonContentBlock =
  | { type: "text"; text: string }
  | { type: "callout"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string };

export interface QuizQuestionDTO {
  id: string;
  questionText: string;
  options: string[];
}

export interface QuizQuestionRevealDTO extends QuizQuestionDTO {
  correctAnswer: string;
  explanation: string;
}

export interface LessonDetailDTO {
  id: string;
  unitId: string;
  unitName: string;
  levelName: string;
  levelOrder: number;
  key: string;
  title: string;
  heroImageUrl: string | null;
  estimatedMinutes: number;
  content: LessonContentBlock[];
  quiz: QuizQuestionDTO[];
  tutorPromptSuggestions: string[];
  status: LessonStatus;
  quizBestScore: number | null;
  nextLessonId: string | null;
  prevLessonId: string | null;
}

export interface QuizSubmitRequest {
  answers: { questionId: string; answer: string }[];
}

export interface QuizSubmitResultDTO {
  score: number;
  totalQuestions: number;
  passed: boolean;
  xpEarned: number;
  unlockedAchievements: AchievementDTO[];
  results: { questionId: string; correct: boolean; correctAnswer: string; explanation: string }[];
  nextLessonId: string | null;
  courseComplete: boolean;
}

export interface AchievementDTO {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface TutorChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TutorAskRequest {
  message: string;
  history?: TutorChatMessage[];
}

export interface TutorAskResponse {
  reply: string;
  unlockedAchievements: AchievementDTO[];
}

export interface DashboardStatsDTO {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  percentComplete: number;
  currentLesson: { id: string; key: string; title: string; unitName: string; levelName: string } | null;
  achievements: AchievementDTO[];
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}

export const AGE_MIN = 7;
export const AGE_MAX = 12;
export const QUIZ_PASS_THRESHOLD = 0.6; // 60% correct required to complete a lesson
