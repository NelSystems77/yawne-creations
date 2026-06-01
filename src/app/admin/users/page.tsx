"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdmins, createAdmin, updateAdminExpiry, deleteAdmin } from "@/lib/users";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/AdminSidebar";
import { UserRecord, AdminExpiry } from "@/types";
import { Plus, Trash2, RefreshCw, X, Loader2, ShieldCheck, Shield } from "lucide-react";
import toast from "react-hot-toast";

const EXPIRY_LABELS: Record<AdminExpiry, string> = {
  "1m": "1 mes",
  "3m": "3 meses",
  "6m": "6 meses",
  "12m": "12 meses",
};

export default function UsersAdminPage() {
  const { userRecord } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState<AdminExpiry>("1m");

  useEffect(() => {
    if (userRecord && userRecord.role !== "superadmin") {
      router.replace("/admin");
    }
  }, [userRecord, router]);

  const load = () =>
    getAdmins()
      .then(setUsers)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!userRecord) return;
    setSaving(true);
    try {
      await createAdmin(email, password, expiry, userRecord.uid);
      toast.success("Administrador creado");
      setShowForm(false);
      setEmail("");
      setPassword("");
      setExpiry("1m");
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear administrador";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleRenew(uid: string) {
    try {
      await updateAdminExpiry(uid, "1m");
      toast.success("Acceso renovado por 1 mes");
      load();
    } catch {
      toast.error("Error al renovar");
    }
  }

  async function handleDelete(u: UserRecord) {
    if (!confirm(`¿Eliminar administrador ${u.email}?`)) return;
    try {
      await deleteAdmin(u.uid);
      toast.success("Administrador eliminado");
      load();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  function formatDate(ts: UserRecord["expiresAt"]) {
    if (!ts) return "Sin vencimiento";
    const d = ts.toDate();
    const expired = d < new Date();
    return (
      <span className={expired ? "text-red-400" : "text-silver-300"}>
        {d.toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" })}
        {expired && " (vencido)"}
      </span>
    );
  }

  if (userRecord?.role !== "superadmin") return null;

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-silver-100">Administradores</h1>
              <p className="text-silver-500 text-sm mt-1">{users.length} usuario(s) registrado(s)</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={18} />
              Nuevo admin
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="text-silver-400 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div key={u.uid} className="card p-5 flex items-center gap-4">
                  {/* Role icon */}
                  <div className="shrink-0">
                    {u.role === "superadmin" ? (
                      <ShieldCheck size={22} className="text-glow" />
                    ) : (
                      <Shield size={22} className="text-silver-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-silver-100 text-sm font-medium truncate">{u.email}</p>
                    <p className="text-silver-500 text-xs capitalize">{u.role}</p>
                  </div>

                  {/* Expiry */}
                  <div className="text-xs text-silver-500 text-right shrink-0">
                    <p className="text-silver-500 mb-0.5">Vence</p>
                    {formatDate(u.expiresAt)}
                  </div>

                  {/* Actions — skip superadmin */}
                  {u.role !== "superadmin" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRenew(u.uid)}
                        title="Renovar 1 mes"
                        className="p-2 rounded-lg text-silver-500 hover:text-silver-300 transition-colors"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-2 rounded-lg text-silver-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create admin modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-navy-700 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-navy-700">
              <h2 className="font-display text-silver-100 text-xl">Nuevo administrador</h2>
              <button onClick={() => setShowForm(false)} className="text-silver-500 hover:text-silver-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
              <div>
                <label className="label">Correo electrónico *</label>
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                />
              </div>

              <div>
                <label className="label">Contraseña *</label>
                <input
                  type="password"
                  className="input"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="label">Duración del acceso</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(EXPIRY_LABELS) as [AdminExpiry, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setExpiry(val)}
                      className={`py-2 px-4 rounded-lg text-sm border transition-all ${
                        expiry === val
                          ? "bg-silver-300 text-navy-900 border-silver-300 font-semibold"
                          : "border-navy-700 text-silver-400 hover:border-silver-500 hover:text-silver-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 justify-center disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Creando..." : "Crear administrador"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-4">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
