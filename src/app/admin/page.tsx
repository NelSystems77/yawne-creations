"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/AdminSidebar";
import { Package, Eye, Sparkles, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { userRecord } = useAuth();
  const [stats, setStats] = useState({ total: 0, available: 0, featured: 0 });

  useEffect(() => {
    getProducts().then((products) => {
      setStats({
        total: products.length,
        available: products.filter((p) => p.available).length,
        featured: products.filter((p) => p.featured).length,
      });
    });
  }, []);

  const expiresAt = userRecord?.expiresAt?.toDate();

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl text-silver-100 mb-1">Dashboard</h1>
            <p className="text-silver-500 text-sm">
              Bienvenido de vuelta,{" "}
              <span className="text-silver-300">{userRecord?.email}</span>
            </p>
            {expiresAt && (
              <p className="text-silver-500 text-xs mt-2">
                Tu acceso vence el{" "}
                <span className="text-silver-300">
                  {expiresAt.toLocaleDateString("es-CR", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: "Total productos", value: stats.total, icon: Package, color: "text-silver-300" },
              { label: "Disponibles", value: stats.available, icon: Eye, color: "text-silver-300" },
              { label: "Destacados", value: stats.featured, icon: Sparkles, color: "text-glow" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-6 flex items-center gap-4">
                <div className="p-3 bg-navy-700 rounded-xl">
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-silver-500 text-xs">{label}</p>
                  <p className="font-display text-2xl text-silver-100">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card p-6">
            <div className="flex items-center gap-2 text-silver-400 text-sm mb-4">
              <BarChart3 size={16} />
              Acciones rápidas
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/admin/products" className="btn-primary text-sm py-2 px-4">
                <Package size={16} />
                Gestionar productos
              </a>
              <a href="/admin/products?new=1" className="btn-outline text-sm py-2 px-4">
                <Sparkles size={16} />
                Agregar producto
              </a>
              {userRecord?.role === "superadmin" && (
                <a href="/admin/users" className="btn-outline text-sm py-2 px-4">
                  Gestionar administradores
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
