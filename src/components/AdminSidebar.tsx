"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { LayoutGrid, Package, Users, LogOut, ExternalLink, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Productos", icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRecord } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    toast.success("Sesión cerrada");
    router.push("/admin/login");
  }

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
      pathname === href
        ? "bg-navy-800 text-silver-100 border border-navy-700"
        : "text-silver-400 hover:bg-navy-800 hover:text-silver-200"
    }`;

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-navy-950 border-b border-navy-700 flex items-center gap-3 px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg text-silver-400 hover:text-silver-200 hover:bg-navy-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <Image src="/icons/icon-96.png" alt="Yawne" width={26} height={26} className="rounded-full" />
        <span className="font-display text-silver-100 text-sm">Yawne Creations</span>
      </div>

      {/* ── Overlay backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          w-72 lg:w-64 shrink-0
          bg-navy-950 border-r border-navy-700
          flex flex-col lg:min-h-screen
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 text-silver-500 hover:text-silver-300 transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>

        {/* Brand */}
        <div className="p-6 border-b border-navy-700 flex items-center gap-3">
          <Image src="/icons/icon-96.png" alt="Yawne" width={36} height={36} className="rounded-full" />
          <div>
            <p className="font-display text-silver-100 text-sm">Yawne Creations</p>
            <p className="text-silver-500 text-xs capitalize">{userRecord?.role ?? "admin"}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={linkClass(href)}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
          {userRecord?.role === "superadmin" && (
            <Link href="/admin/users" onClick={() => setOpen(false)} className={linkClass("/admin/users")}>
              <Users size={18} />
              Administradores
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-navy-700 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-silver-500 hover:text-silver-300 transition-colors"
          >
            <ExternalLink size={16} />
            Ver tienda
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-silver-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
          <p className="text-silver-600 text-xs px-4 truncate">{userRecord?.email}</p>
        </div>
      </aside>
    </>
  );
}
