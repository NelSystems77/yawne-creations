"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/AdminSidebar";
import { Package, Eye, Sparkles, BarChart3, Users } from "lucide-react";

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

  const statCards = [
    { label: "Total productos", value: stats.total, icon: Package, accent: "text-silver-300", bg: "bg-navy-700" },
    { label: "Disponibles",     value: stats.available, icon: Eye,      accent: "text-ice-blue",   bg: "bg-navy-700" },
    { label: "Destacados",      value: stats.featured,  icon: Sparkles, accent: "text-glow",       bg: "bg-navy-700" },
  ];

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <AdminSidebar />

      <main className="flex-1 pt-14 px-4 pb-6 sm:px-6 lg:p-8 lg:pt-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-6 lg:mb-10">
            <h1 className="font-display text-2xl sm:text-3xl text-silver-100 mb-1">Dashboard</h1>
            <p className="text-silver-500 text-sm">
              Bienvenido de vuelta,{" "}
              <span className="text-silver-300 break-all">{userRecord?.email}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6 lg:mb-10">
            {statCards.map(({ label, value, icon: Icon, accent, bg }) => (
              <div key={label} className="card p-4 sm:p-6 flex items-center gap-4">
                <div className={`p-2.5 sm:p-3 ${bg} rounded-xl shrink-0`}>
                  <Icon size={20} className={accent} />
                </div>
                <div className="min-w-0">
                  <p className="text-silver-500 text-xs truncate">{label}</p>
                  <p className="font-display text-2xl sm:text-3xl text-silver-100 leading-none mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-2 text-silver-400 text-sm mb-4">
              <BarChart3 size={16} />
              Acciones rápidas
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <a href="/admin/products" className="btn-primary text-sm py-2.5 px-4 justify-center sm:justify-start">
                <Package size={16} />
                Gestionar productos
              </a>
              <a href="/admin/products?new=1" className="btn-outline text-sm py-2.5 px-4 justify-center sm:justify-start">
                <Sparkles size={16} />
                Agregar producto
              </a>
              {userRecord?.role === "superadmin" && (
                <a href="/admin/users" className="btn-outline text-sm py-2.5 px-4 justify-center sm:justify-start">
                  <Users size={16} />
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
