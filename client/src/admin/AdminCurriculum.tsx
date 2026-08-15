import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X } from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";

interface AdminQuizQuestion {
  id: string;
  questionText: string;
  questionTextHe: string;
  options: string[];
  optionsHe: string[];
  correctAnswer: string;
  correctAnswerHe: string;
  explanation: string;
  explanationHe: string;
  order: number;
}

interface AdminLesson {
  id: string;
  unitId: string;
  key: string;
  title: string;
  titleHe: string;
  order: number;
  estimatedMinutes: number;
  heroImageUrl: string | null;
  content: unknown;
  contentHe: unknown;
  tutorPromptSuggestions: string[];
  tutorPromptSuggestionsHe: string[];
  quizQuestions?: AdminQuizQuestion[];
}

interface AdminUnit {
  id: string;
  levelId: string;
  key: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  order: number;
  lessons: AdminLesson[];
}

interface AdminLevel {
  id: string;
  key: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  order: number;
  minAge: number;
  maxAge: number;
  heroImageUrl: string | null;
  units: AdminUnit[];
}

export default function AdminCurriculum() {
  const queryClient = useQueryClient();
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const { data: levels } = useQuery({
    queryKey: ["admin-levels"],
    queryFn: async () => (await api.get<AdminLevel[]>("/admin/levels")).data,
  });

  const { data: lessonDetail } = useQuery({
    queryKey: ["admin-lesson", selectedLessonId],
    queryFn: async () => (await api.get<AdminLesson>(`/admin/lessons/${selectedLessonId}`)).data,
    enabled: Boolean(selectedLessonId),
  });

  function toggleLevel(id: string) {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleUnit(id: string) {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card p-4">
        <h2 className="mb-3 font-display text-lg font-700">Curriculum Tree</h2>
        <div className="flex flex-col gap-2">
          {levels?.map((level) => (
            <div key={level.id}>
              <button
                onClick={() => toggleLevel(level.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start hover:bg-white/10"
              >
                {expandedLevels.has(level.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-700">
                  {level.order}. {level.name}
                </span>
              </button>
              {expandedLevels.has(level.id) && (
                <div className="ms-6 flex flex-col gap-1">
                  {level.units.map((unit) => (
                    <div key={unit.id}>
                      <button
                        onClick={() => toggleUnit(unit.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-white/10"
                      >
                        {expandedUnits.has(unit.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        <span className="text-white/80">{unit.name}</span>
                      </button>
                      {expandedUnits.has(unit.id) && (
                        <div className="ms-6 flex flex-col gap-1">
                          {unit.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLessonId(lesson.id)}
                              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-white/10 ${
                                selectedLessonId === lesson.id ? "bg-white/15 text-white" : "text-white/60"
                              }`}
                            >
                              <Pencil className="h-3 w-3" />
                              {lesson.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        {lessonDetail ? (
          <LessonEditor
            lesson={lessonDetail}
            onSaved={() => {
              queryClient.invalidateQueries({ queryKey: ["admin-levels"] });
              queryClient.invalidateQueries({ queryKey: ["admin-lesson", selectedLessonId] });
            }}
          />
        ) : (
          <div className="glass-card p-8 text-center text-white/50">Select a lesson from the tree to edit it.</div>
        )}
      </div>
    </div>
  );
}

function LessonEditor({ lesson, onSaved }: { lesson: AdminLesson; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: lesson.title,
    titleHe: lesson.titleHe,
    estimatedMinutes: lesson.estimatedMinutes,
    heroImageUrl: lesson.heroImageUrl ?? "",
    content: JSON.stringify(lesson.content, null, 2),
    contentHe: JSON.stringify(lesson.contentHe, null, 2),
    tutorPromptSuggestions: lesson.tutorPromptSuggestions.join("\n"),
    tutorPromptSuggestionsHe: lesson.tutorPromptSuggestionsHe.join("\n"),
  });
  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let content, contentHe;
      try {
        content = JSON.parse(form.content);
        contentHe = JSON.parse(form.contentHe);
      } catch {
        throw new Error("Content fields must be valid JSON arrays of blocks");
      }
      return api.patch(`/admin/lessons/${lesson.id}`, {
        title: form.title,
        titleHe: form.titleHe,
        estimatedMinutes: Number(form.estimatedMinutes),
        heroImageUrl: form.heroImageUrl || null,
        content,
        contentHe,
        tutorPromptSuggestions: form.tutorPromptSuggestions.split("\n").filter(Boolean),
        tutorPromptSuggestionsHe: form.tutorPromptSuggestionsHe.split("\n").filter(Boolean),
      });
    },
    onSuccess: () => {
      setError(null);
      onSaved();
    },
    onError: (err) => setError(err instanceof Error ? err.message : apiErrorMessage(err)),
  });

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 font-display text-lg font-700">Edit Lesson</h2>
      <div className="grid gap-3">
        <Field label="Title (EN)">
          <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Title (HE)">
          <input className="input-field" value={form.titleHe} onChange={(e) => setForm({ ...form, titleHe: e.target.value })} dir="rtl" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Estimated minutes">
            <input
              type="number"
              className="input-field"
              value={form.estimatedMinutes}
              onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })}
            />
          </Field>
          <Field label="Hero image URL">
            <input className="input-field" value={form.heroImageUrl} onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} />
          </Field>
        </div>
        <Field label="Content blocks JSON (EN)">
          <textarea
            className="input-field font-mono text-xs"
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </Field>
        <Field label="Content blocks JSON (HE)">
          <textarea
            className="input-field font-mono text-xs"
            rows={8}
            dir="rtl"
            value={form.contentHe}
            onChange={(e) => setForm({ ...form, contentHe: e.target.value })}
          />
        </Field>
        <Field label="Tutor prompt suggestions (EN, one per line)">
          <textarea
            className="input-field"
            rows={2}
            value={form.tutorPromptSuggestions}
            onChange={(e) => setForm({ ...form, tutorPromptSuggestions: e.target.value })}
          />
        </Field>
        <Field label="Tutor prompt suggestions (HE, one per line)">
          <textarea
            className="input-field"
            rows={2}
            dir="rtl"
            value={form.tutorPromptSuggestionsHe}
            onChange={(e) => setForm({ ...form, tutorPromptSuggestionsHe: e.target.value })}
          />
        </Field>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}
      <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary mt-4">
        {saveMutation.isPending ? "Saving..." : "Save lesson"}
      </button>

      <QuizEditor lessonId={lesson.id} questions={lesson.quizQuestions ?? []} onChanged={onSaved} />
    </div>
  );
}

function QuizEditor({ lessonId, questions, onChanged }: { lessonId: string; questions: AdminQuizQuestion[]; onChanged: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminQuizQuestion | null>(null);
  const [form, setForm] = useState({
    questionText: "",
    questionTextHe: "",
    options: ["", "", "", ""],
    optionsHe: ["", "", "", ""],
    correctAnswer: "",
    correctAnswerHe: "",
    explanation: "",
    explanationHe: "",
  });
  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { lessonId, ...form, options: form.options, optionsHe: form.optionsHe.filter(Boolean) };
      if (editing) return api.patch(`/admin/quiz-questions/${editing.id}`, payload);
      return api.post("/admin/quiz-questions", payload);
    },
    onSuccess: () => {
      setError(null);
      setShowForm(false);
      onChanged();
    },
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/quiz-questions/${id}`),
    onSuccess: onChanged,
  });

  function openCreate() {
    setEditing(null);
    setForm({ questionText: "", questionTextHe: "", options: ["", "", "", ""], optionsHe: ["", "", "", ""], correctAnswer: "", correctAnswerHe: "", explanation: "", explanationHe: "" });
    setError(null);
    setShowForm(true);
  }

  function openEdit(q: AdminQuizQuestion) {
    setEditing(q);
    setForm({
      questionText: q.questionText,
      questionTextHe: q.questionTextHe,
      options: [...q.options],
      optionsHe: q.optionsHe.length ? [...q.optionsHe] : ["", "", "", ""],
      correctAnswer: q.correctAnswer,
      correctAnswerHe: q.correctAnswerHe,
      explanation: q.explanation,
      explanationHe: q.explanationHe,
    });
    setError(null);
    setShowForm(true);
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-700">Quiz Questions</h3>
        <button onClick={openCreate} className="btn-primary !px-3 !py-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl bg-white/5 p-4">
          <div className="mb-2 flex justify-end">
            <button onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 text-white/60" />
            </button>
          </div>
          <div className="grid gap-2">
            <Field label="Question (EN)">
              <input className="input-field" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} />
            </Field>
            <Field label="Question (HE)">
              <input className="input-field" dir="rtl" value={form.questionTextHe} onChange={(e) => setForm({ ...form, questionTextHe: e.target.value })} />
            </Field>
            {form.options.map((opt, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  className="input-field"
                  placeholder={`Option ${i + 1} (EN)`}
                  value={opt}
                  onChange={(e) => {
                    const options = [...form.options];
                    options[i] = e.target.value;
                    setForm({ ...form, options });
                  }}
                />
                <input
                  className="input-field"
                  dir="rtl"
                  placeholder={`Option ${i + 1} (HE)`}
                  value={form.optionsHe[i]}
                  onChange={(e) => {
                    const optionsHe = [...form.optionsHe];
                    optionsHe[i] = e.target.value;
                    setForm({ ...form, optionsHe });
                  }}
                />
              </div>
            ))}
            <Field label="Correct answer (EN, must match an option)">
              <input className="input-field" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
            </Field>
            <Field label="Correct answer (HE)">
              <input className="input-field" dir="rtl" value={form.correctAnswerHe} onChange={(e) => setForm({ ...form, correctAnswerHe: e.target.value })} />
            </Field>
            <Field label="Explanation (EN)">
              <input className="input-field" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            </Field>
            <Field label="Explanation (HE)">
              <input className="input-field" dir="rtl" value={form.explanationHe} onChange={(e) => setForm({ ...form, explanationHe: e.target.value })} />
            </Field>
          </div>
          {error && <p className="mt-2 rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-200">{error}</p>}
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary mt-3 !py-2 text-sm">
            {saveMutation.isPending ? "Saving..." : "Save question"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
            <span className="truncate">{q.questionText}</span>
            <div className="flex flex-shrink-0 gap-1">
              <button onClick={() => openEdit(q)} className="rounded-lg p-1.5 hover:bg-white/10">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => deleteMutation.mutate(q.id)} className="rounded-lg p-1.5 hover:bg-white/10">
                <Trash2 className="h-3.5 w-3.5 text-red-300" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-700 text-white/60">{label}</span>
      {children}
    </label>
  );
}
