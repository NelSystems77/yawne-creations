import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-700 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image src="/icons/icon-192.png" alt="Yawne Creations" width={40} height={40} className="rounded-full" />
            <span className="font-display text-xl text-silver-100">Yawne Creations</span>
          </div>
          <p className="text-silver-500 text-sm leading-relaxed">
            Artesanías únicas hechas con amor. Cada pieza cuenta una historia y apoya una causa: alimentar a los perritos callejeros de Tres Ríos.
          </p>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-silver-200 text-lg">Información</h3>
          <div className="flex flex-col gap-3 text-silver-500 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-silver-400 mt-0.5 shrink-0" />
              <span>Tres Ríos, Costa Rica</span>
            </div>
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="text-silver-400 mt-0.5 shrink-0" />
              <a href="https://wa.me/50683278331" target="_blank" rel="noopener noreferrer"
                className="hover:text-silver-300 transition-colors">
                +506 8327-8331
              </a>
            </div>
            <div className="flex items-start gap-2" id="envios">
              <Package size={16} className="text-silver-400 mt-0.5 shrink-0" />
              <span>Envíos por Correos de Costa Rica o Uber Flash — el cliente gestiona y asume el costo adicional</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-silver-200 text-lg">Navegación</h3>
          <div className="flex flex-col gap-2 text-silver-500 text-sm">
            <Link href="/#galeria" className="hover:text-silver-300 transition-colors">Galería de productos</Link>
            <Link href="/#nosotros" className="hover:text-silver-300 transition-colors">Nuestra historia</Link>
            <a href="https://wa.me/50683278331" target="_blank" rel="noopener noreferrer"
              className="hover:text-silver-300 transition-colors">
              Hacer un pedido
            </a>
            <Link href="/admin/login" className="hover:text-silver-300 transition-colors">
              Panel de administración
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-700 px-4 py-6 text-center text-silver-500 text-xs">
        © {new Date().getFullYear()} Yawne Creations · Hecho con amor por Mari Fer · Tres Ríos, Costa Rica
      </div>
    </footer>
  );
}
