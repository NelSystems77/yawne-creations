"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isExpired } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === "/admin/login") return;

    if (!user) {
      router.replace("/admin/login");
      return;
    }
    if (isExpired) {
      router.replace("/admin/login");
    }
  }, [user, loading, isExpired, router, pathname]);

  if (loading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 size={32} className="text-silver-400 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
