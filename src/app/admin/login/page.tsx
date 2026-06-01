"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import { LogIn, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));

      if (!snap.exists()) {
        await auth.signOut();
        toast.error("Usuario no autorizado.");
        return;
      }

      const data = snap.data();
      if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
        await auth.signOut();
        toast.error("Tu acceso ha vencido. Contacta al administrador.");
        return;
      }

      router.push("/admin");
    } catch {
      toast.error("Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #1E3254 0%, #0D1B2A 55%, #070F1A 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <Image
            src="/icons/icon-192.png"
            alt="Yawne Creations"
            width={72}
            height={72}
            className="rounded-full border border-silver-400/30"
            style={{ boxShadow: "0 0 30px rgba(200,222,255,0.15)" }}
          />
          <div className="text-center">
            <h1 className="font-display text-2xl text-silver-100">Panel de Administración</h1>
            <p className="text-silver-500 text-sm mt-1">Yawne Creations</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="card p-8 flex flex-col gap-5">
          <div>
            <label className="label">Correo electrónico</label>
            <input
              type="email"
              className="input"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="input pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300 transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={18} />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-silver-500 text-xs mt-6">
          ← <a href="/" className="hover:text-silver-300 transition-colors">Volver a la tienda</a>
        </p>
      </div>
    </div>
  );
}
