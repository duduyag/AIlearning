import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";
import { iconFor } from "../lib/icons";

interface AdminAchievement {
  id: string;
  key: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  criteria: { type: string; value: number };
}

type FormState = {
  key: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  criteriaType: string;
  criteriaValue: number;
};

const CRITERIA_TYPES = ["lessons_completed", "streak", "level_completed", "perfect_quizzes", "tutor_messages"];

const EMPTY_FORM: FormState = {
  key: "",
  name: "",
  nameHe: "",
  description: "",
  descriptionHe: "",
  icon: "star",
  criteriaType: "lessons_completed",
  criteriaValue: 1,
};

export default function AdminAchievements() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AdminAchievement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const { data: achievements } = useQuery({
    queryKey: ["admin-achievements"],
    queryFn: async () => (await api.get<AdminAchievement[]>("/admin/achievements")).data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        key: form.key,
        name: form.name,
        nameHe: form.nameHe,
        description: form.description,
        descriptionHe: form.descriptionHe,
        icon: form.icon,
        criteria: { type: form.criteriaType, value: form.criteriaValue },
      };
      if (editing) return api.patch(`/admin/achievements/${editing.id}`, payload);
      return api.post("/admin/achievements", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-achievements"] });
      closeForm();
    },
    onError: (err) => setError(apiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/achievements/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-achievements"] }),
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(a: AdminAchievement) {
    setEditing(a);
    setForm({
      key: a.key,
      name: a.name,
      nameHe: a.nameHe,
      description: a.description,
      descriptionHe: a.descriptionHe,
      icon: a.icon,
      criteriaType: a.criteria.type,
      criteriaValue: a.criteria.value,
    });
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="btn-primary !px-4 !py-2 text-sm">
          <Plus className="h-4 w-4" /> New achievement
        </button>
      </div>

      {showForm && (
        <div className="glass-card mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-700">{editing ? "Edit" : "Create"} achievement</h3>
            <button onClick={closeForm} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Key (unique)">
              <input className="input-field" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
            </Field>
            <Field label="Icon (lucide key)">
              <input className="input-field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </Field>
            <Field label="Name (EN)">
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Name (HE)">
              <input className="input-field" dir="rtl" value={form.nameHe} onChange={(e) => setForm({ ...form, nameHe: e.target.value })} />
            </Field>
            <Field label="Description (EN)">
              <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Description (HE)">
              <input className="input-field" dir="rtl" value={form.descriptionHe} onChange={(e) => setForm({ ...form, descriptionHe: e.target.value })} />
            </Field>
            <Field label="Unlock condition">
              <select className="input-field" value={form.criteriaType} onChange={(e) => setForm({ ...form, criteriaType: e.target.value })}>
                {CRITERIA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Threshold value">
              <input
                type="number"
                min={1}
                className="input-field"
                value={form.criteriaValue}
                onChange={(e) => setForm({ ...form, criteriaValue: Number(e.target.value) })}
              />
            </Field>
          </div>
          {error && <p className="mt-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary mt-4">
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((a) => {
          const Icon = iconFor(a.icon);
          return (
            <div key={a.id} className="glass-card flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-700">{a.name}</p>
                <p className="text-sm text-white/60">{a.description}</p>
                <p className="mt-1 text-xs text-white/40">
                  {a.criteria.type.replace(/_/g, " ")} ≥ {a.criteria.value}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 hover:bg-white/10">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => deleteMutation.mutate(a.id)} className="rounded-lg p-1.5 hover:bg-white/10">
                  <Trash2 className="h-4 w-4 text-red-300" />
                </button>
              </div>
            </div>
          );
        })}
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
