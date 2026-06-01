"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { LayoutGrid, Package, Users, LogOut, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Productos", icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRecord } = useAuth();

  async function handleLogout() {
    await signOut(auth);
    toast.success("Sesión cerrada");
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-navy-950 border-r border-navy-700 min-h-screen flex flex-col">
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
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-navy-800 text-silver-100 border border-navy-700"
                  : "text-silver-400 hover:bg-navy-800 hover:text-silver-200"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        {userRecord?.role === "superadmin" && (
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
              pathname === "/admin/users"
                ? "bg-navy-800 text-silver-100 border border-navy-700"
                : "text-silver-400 hover:bg-navy-800 hover:text-silver-200"
            }`}
          >
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
  );
}
