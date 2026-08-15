import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { api } from "../lib/api";
import { UserDTO } from "@ai-explorers/shared";
import { useAuthStore } from "../store/authStore";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: async () =>
      (await api.get<{ items: UserDTO[]; total: number; page: number; pageSize: number }>("/admin/users", { params: { search, page } }))
        .data,
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "LEARNER" | "ADMIN" }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <input
        className="input-field mb-4 !w-auto"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data?.items.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-700">{u.displayName}</td>
                <td className="px-4 py-3 text-white/60">@{u.username}</td>
                <td className="px-4 py-3 text-white/60">{u.email}</td>
                <td className="px-4 py-3 text-white/60">{u.totalXp}</td>
                <td className="px-4 py-3">
                  <span className={u.role === "ADMIN" ? "text-accent-300" : "text-white/50"}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => roleMutation.mutate({ id: u.id, role: u.role === "ADMIN" ? "LEARNER" : "ADMIN" })}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-white/10"
                    >
                      {u.role === "ADMIN" ? (
                        <>
                          <ShieldOff className="h-3.5 w-3.5" /> Revoke admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> Make admin
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/60">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg px-3 py-1 hover:bg-white/10 disabled:opacity-30">
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg px-3 py-1 hover:bg-white/10 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
