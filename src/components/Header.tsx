"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icons/icon-192.png"
            alt="Yawne Creations"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-display text-xl text-silver-100 tracking-wide">
            Yawne <span className="text-silver-400">Creations</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#galeria" className="text-silver-400 hover:text-silver-100 transition-colors text-sm">
            Galería
          </Link>
          <Link href="/#nosotros" className="text-silver-400 hover:text-silver-100 transition-colors text-sm">
            Nosotros
          </Link>
          <Link href="/#envios" className="text-silver-400 hover:text-silver-100 transition-colors text-sm">
            Envíos
          </Link>
          <a
            href="https://wa.me/50683278331"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2 px-4"
          >
            Contactar
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-silver-300 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-navy-950 border-t border-navy-700 px-4 py-6 flex flex-col gap-5">
          <Link href="/#galeria" onClick={() => setOpen(false)} className="text-silver-300 text-base">Galería</Link>
          <Link href="/#nosotros" onClick={() => setOpen(false)} className="text-silver-300 text-base">Nosotros</Link>
          <Link href="/#envios" onClick={() => setOpen(false)} className="text-silver-300 text-base">Envíos</Link>
          <a
            href="https://wa.me/50683278331"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm w-fit"
          >
            Contactar por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
