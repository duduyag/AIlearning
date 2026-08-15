import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Send, Sparkles, Trophy, CheckCircle2, XCircle, PartyPopper } from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";
import { AchievementDTO, LessonDetailDTO, QuizSubmitResultDTO } from "@ai-explorers/shared";
import { useT } from "../i18n/useT";
import { iconFor } from "../lib/icons";
import LoadingScreen from "../components/LoadingScreen";
import RobotMascot from "../components/illustrations/RobotMascot";
import { useThemeStore } from "../store/themeStore";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CONFETTI = [
  { emoji: "🎉", left: "8%", delay: 0, duration: 1.4, xDrift: -20 },
  { emoji: "✨", left: "22%", delay: 0.05, duration: 1.6, xDrift: 15 },
  { emoji: "⭐", left: "36%", delay: 0.1, duration: 1.3, xDrift: -10 },
  { emoji: "🎊", left: "50%", delay: 0.02, duration: 1.7, xDrift: 25 },
  { emoji: "🌟", left: "64%", delay: 0.15, duration: 1.5, xDrift: -15 },
  { emoji: "🎉", left: "78%", delay: 0.08, duration: 1.4, xDrift: 10 },
  { emoji: "✨", left: "14%", delay: 0.22, duration: 1.6, xDrift: 20 },
  { emoji: "🎊", left: "58%", delay: 0.28, duration: 1.3, xDrift: -25 },
  { emoji: "⭐", left: "32%", delay: 0.32, duration: 1.5, xDrift: 5 },
  { emoji: "🌟", left: "86%", delay: 0.18, duration: 1.4, xDrift: -5 },
];

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useT();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizSubmitResultDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [newAchievements, setNewAchievements] = useState<AchievementDTO[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Record<string, string[]>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const setLevelOrder = useThemeStore((s) => s.setLevelOrder);

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => (await api.get<LessonDetailDTO>(`/course/lessons/${id}`)).data,
    enabled: Boolean(id),
    retry: false,
  });

  useEffect(() => {
    setAnswers({});
    setQuizResult(null);
    setChatMessages([]);
    setNewAchievements([]);
    // A new lesson should always open at the top - carrying over the previous
    // lesson's scroll position (often deep in its quiz) hides the title and content.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  // Bring the pass/fail result into view as soon as it appears - the quiz answers
  // above it get taller (each one gains an explanation), which otherwise pushes the
  // message further down the page right as it appears and it can go unnoticed.
  useEffect(() => {
    if (quizResult) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [quizResult]);

  // Each course level gets its own page background, so crossing into a new level
  // (not just a new lesson within the same one) visibly feels like a new place.
  useEffect(() => {
    if (lesson?.levelOrder) setLevelOrder(lesson.levelOrder);
  }, [lesson?.levelOrder, setLevelOrder]);

  useEffect(() => {
    return () => setLevelOrder(1);
  }, [setLevelOrder]);

  // Re-shuffle answer order per lesson so the correct option isn't always in the same spot.
  useEffect(() => {
    if (!lesson) return;
    const map: Record<string, string[]> = {};
    for (const q of lesson.quiz) map[q.id] = shuffle(q.options);
    setShuffledOptions(map);
  }, [lesson]);

  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  async function handleSubmitQuiz() {
    if (!lesson) return;
    setSubmitting(true);
    try {
      const res = await api.post<QuizSubmitResultDTO>(`/lessons/${lesson.id}/quiz`, {
        answers: lesson.quiz.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? "" })),
      });
      setQuizResult(res.data);
      if (res.data.unlockedAchievements.length) setNewAchievements((prev) => [...prev, ...res.data.unlockedAchievements]);
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendChat(e: FormEvent) {
    e.preventDefault();
    if (!lesson || !chatInput.trim() || chatLoading) return;
    const message = chatInput.trim();
    const history = chatMessages;
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.post<{ reply: string; unlockedAchievements: AchievementDTO[] }>(`/lessons/${lesson.id}/tutor`, { message, history });
      setChatMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
      if (res.data.unlockedAchievements.length) setNewAchievements((prev) => [...prev, ...res.data.unlockedAchievements]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: apiErrorMessage(err, "I couldn't respond right now - try again soon!") }]);
    } finally {
      setChatLoading(false);
    }
  }

  if (isLoading) return <LoadingScreen label={t("common.loading")} />;

  if (error || !lesson) {
    return (
      <div className="glass-card mx-auto max-w-md p-8 text-center text-white">
        <p className="mb-4">{apiErrorMessage(error, "This lesson could not be loaded.")}</p>
        <button onClick={() => navigate("/course")} className="btn-primary mx-auto">
          {t("lesson.backToPath")}
        </button>
      </div>
    );
  }

  const allAnswered = lesson.quiz.every((q) => answers[q.id]);

  return (
    <div className="text-white">
      <button
        onClick={() => navigate("/course")}
        className="mb-6 flex items-center gap-1 text-sm text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("lesson.backToPath")}
      </button>

      {newAchievements.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 glass-card flex flex-wrap items-center gap-3 p-4">
          <PartyPopper className="h-5 w-5 flex-shrink-0 text-sunshine-400" aria-hidden="true" />
          <span className="text-sm font-700">{t("lesson.newAchievements")}</span>
          {newAchievements.map((a, i) => {
            const Icon = iconFor(a.icon);
            return (
              <span key={`${a.id}-${i}`} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">
                <Icon className="h-3.5 w-3.5 text-sunshine-400" aria-hidden="true" />
                {a.name}
              </span>
            );
          })}
        </motion.div>
      )}

      <motion.div key={id} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
        <p className="mb-1 text-xs font-700 uppercase tracking-wide text-white/50">
          {lesson.levelName} · {lesson.unitName}
        </p>
        <h1 className="mb-6 font-display text-3xl font-800">{lesson.title}</h1>

        {lesson.heroImageUrl && (
          <div className="mb-6 flex w-full items-center justify-center overflow-hidden rounded-3xl bg-white/5 shadow-glass">
            <img
              src={lesson.heroImageUrl}
              alt=""
              className="max-h-[360px] w-full object-contain"
            />
          </div>
        )}
      </motion.div>

      <div className="glass-card mb-6 flex flex-col gap-4 p-6 sm:p-8">
        {lesson.content.map((block, i) => {
          if (block.type === "text") return <p key={i} className="leading-relaxed text-white/90">{block.text}</p>;
          if (block.type === "callout")
            return (
              <div key={i} className="rounded-xl bg-accent-500/15 px-4 py-3 text-sm text-accent-100">
                💡 {block.text}
              </div>
            );
          if (block.type === "image")
            return (
              <div key={i} className="flex w-full items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                <img src={block.url} alt={block.alt} className="max-h-[300px] w-full object-contain" />
              </div>
            );
          return null;
        })}
      </div>

      {/* AI Tutor chat */}
      <div className="glass-card mb-6 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0">
            <RobotMascot />
          </div>
          <h2 className="font-display text-lg font-700">{t("lesson.askTutor")}</h2>
        </div>

        {chatMessages.length === 0 && lesson.tutorPromptSuggestions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-white/50">{t("lesson.tryAsking")}</span>
            {lesson.tutorPromptSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setChatInput(suggestion)}
                className="rounded-full glass-panel px-3 py-1 text-xs text-white/80 hover:bg-white/15"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {chatMessages.length > 0 && (
          <div ref={chatScrollRef} className="mb-4 flex max-h-80 flex-col gap-3 overflow-y-auto pe-1">
            {chatMessages.map((msg, i) => (
              <div key={i} className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={clsx(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === "user" ? "bg-brand-500/40 text-white" : "bg-white/10 text-white/90"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && <p className="text-xs text-white/50">{t("lesson.tutorThinking")}</p>}
          </div>
        )}

        <form onSubmit={handleSendChat} className="flex gap-2">
          <label htmlFor="tutor-chat-input" className="sr-only">
            {t("lesson.tutorPlaceholder")}
          </label>
          <input
            id="tutor-chat-input"
            className="input-field"
            placeholder={t("lesson.tutorPlaceholder")}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            maxLength={500}
          />
          <button type="submit" disabled={chatLoading || !chatInput.trim()} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50">
            <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            <span className="hidden sm:inline">{t("lesson.tutorSend")}</span>
          </button>
        </form>
      </div>

      {/* Quiz */}
      <div className="glass-card p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-300" aria-hidden="true" />
          <h2 className="font-display text-lg font-700">{t("lesson.quizTitle")}</h2>
        </div>

        <div className="flex flex-col gap-6">
          {lesson.quiz.map((q, qi) => {
            const questionResult = quizResult?.results.find((r) => r.questionId === q.id);
            const options = shuffledOptions[q.id] ?? q.options;
            return (
              <div key={q.id}>
                <p className="mb-3 text-center font-700">
                  {qi + 1}. {q.questionText}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((option) => {
                    const selected = answers[q.id] === option;
                    const isCorrectOption = questionResult && questionResult.correctAnswer === option;
                    const isWrongSelected = questionResult && selected && !questionResult.correct;
                    const stateClasses = isCorrectOption
                      ? "border-mint-400 bg-mint-500/30"
                      : isWrongSelected
                      ? "border-red-400 bg-red-500/30"
                      : selected
                      ? "border-brand-400 bg-brand-500/20"
                      : "border-white/15 bg-white/5 hover:bg-white/15";
                    return (
                      <button
                        key={option}
                        disabled={Boolean(quizResult)}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                        className={clsx(
                          "rounded-2xl border px-4 py-3 text-start font-700 transition text-white",
                          stateClasses,
                          quizResult && "cursor-default opacity-90"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {questionResult && (
                  <div className={clsx("mt-2 flex items-start gap-2 rounded-xl p-3 text-sm", questionResult.correct ? "bg-mint-500/10 text-mint-100" : "bg-red-500/10 text-red-100")}>
                    {questionResult.correct ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span>{questionResult.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!quizResult ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered || submitting}
            className="btn-primary mt-6 disabled:opacity-50"
          >
            {submitting ? t("lesson.submitting") : t("lesson.submit")}
          </button>
        ) : (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={clsx(
              "relative mt-6 overflow-hidden rounded-3xl p-6 text-center sm:p-8",
              quizResult.passed
                ? "bg-gradient-to-br from-mint-500/25 via-brand-500/20 to-accent-500/25 ring-2 ring-mint-400/60"
                : "bg-white/5 text-start"
            )}
          >
            {quizResult.passed && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {CONFETTI.map((c, i) => (
                  <motion.span
                    key={i}
                    className="absolute top-1/2 text-2xl"
                    style={{ left: c.left }}
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{ y: [-10, -70, 30], x: [0, c.xDrift], opacity: [1, 1, 0], scale: 1, rotate: c.xDrift * 4 }}
                    transition={{ duration: c.duration, delay: c.delay, ease: "easeOut" }}
                  >
                    {c.emoji}
                  </motion.span>
                ))}
              </div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.15 }}
              className={clsx("mb-2 flex items-center gap-3", quizResult.passed ? "justify-center" : "justify-start")}
            >
              <motion.div
                animate={quizResult.passed ? { y: [0, -8, 0] } : undefined}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className={clsx(quizResult.passed ? "h-12 w-12" : "h-5 w-5", "text-sunshine-400")} aria-hidden="true" />
              </motion.div>
              <p className={clsx("font-display font-800", quizResult.passed ? "text-3xl" : "text-lg font-700")}>
                {quizResult.passed ? t("lesson.passed") : t("lesson.tryAgain")}
              </p>
            </motion.div>

            {quizResult.passed && <p className="mb-1 text-lg text-white/90">{t("lesson.passedSubtitle")}</p>}

            <p className={clsx(quizResult.passed ? "text-base text-white/80" : "text-sm text-white/70")}>
              {t("lesson.scoreLabel", { score: quizResult.score, total: quizResult.totalQuestions })}
              {quizResult.xpEarned > 0 && ` · ${t("lesson.xpEarned", { xp: quizResult.xpEarned })}`}
            </p>

            <div className={clsx("mt-4 flex flex-wrap gap-3", quizResult.passed ? "justify-center" : "justify-start")}>
              {!quizResult.passed && (
                <button
                  onClick={() => {
                    setQuizResult(null);
                    setAnswers({});
                    if (lesson) {
                      const map: Record<string, string[]> = {};
                      for (const q of lesson.quiz) map[q.id] = shuffle(q.options);
                      setShuffledOptions(map);
                    }
                  }}
                  className="btn-secondary"
                >
                  {t("lesson.tryAgain")}
                </button>
              )}
              {quizResult.passed && quizResult.courseComplete && (
                <p className="font-display text-lg font-700 text-sunshine-400">{t("lesson.courseComplete")}</p>
              )}
              {quizResult.passed && !quizResult.courseComplete && quizResult.nextLessonId && (
                <button onClick={() => navigate(`/lessons/${quizResult.nextLessonId}`)} className="btn-primary">
                  {t("lesson.nextLesson")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                </button>
              )}
              <button onClick={() => navigate("/course")} className="btn-secondary">
                {t("lesson.backToPathBtn")}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
