import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Image from "next/image";
import { Heart, Sparkles, Package, MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Header />

      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #1E3254 0%, #0D1B2A 55%, #070F1A 100%)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, #C8DEFF 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-up max-w-3xl">
          <Image
            src="/icons/icon-384.png"
            alt="Yawne Creations"
            width={120}
            height={120}
            className="rounded-full border-2 border-silver-400/30"
            style={{ boxShadow: "0 0 40px rgba(200, 222, 255, 0.2)" }}
          />

          <div>
            <h1 className="text-5xl md:text-7xl font-display text-silver-100 leading-tight mb-3">
              Yawne{" "}
              <span className="shimmer-text">Creations</span>
            </h1>
            <p className="text-silver-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Artesanías únicas, hechas a mano con amor. Cada pieza que compras
              ayuda a alimentar perritos callejeros en Tres Ríos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a href="#galeria" className="btn-primary">
              <Sparkles size={18} />
              Ver galería
            </a>
            <a
              href="https://wa.me/50683278331"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MessageCircle size={18} />
              Hacer un pedido
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-silver-500 text-xs">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-silver-500/50" />
          <span>Explorar</span>
        </div>
      </section>

      {/* Gallery */}
      <section id="galeria" className="py-24 px-4 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-silver-100 text-center mb-2">
          Galería de Productos
        </h2>
        <p className="text-silver-400 text-center mb-16 max-w-xl mx-auto">
          Cada pieza es irrepetible. Hecha a mano, con materiales cuidadosamente
          seleccionados y mucho cariño.
        </p>
        <GallerySection />
      </section>

      {/* About */}
      <section
        id="nosotros"
        className="py-24 px-4"
        style={{ background: "linear-gradient(180deg, #0D1B2A 0%, #070F1A 100%)" }}
      >
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-silver-400 text-sm uppercase tracking-widest mb-4">
              <Heart size={16} className="text-silver-300" />
              Nuestra historia
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-silver-100 mb-6">
              Nació del corazón de Mari Fer
            </h2>
            <p className="text-silver-400 leading-relaxed mb-4">
              Con tan solo 10 años, Mari Fer comenzó a crear piezas artesanales únicas para reunir fondos
              con dos propósitos: sus gastos personales y, lo que más le emociona, alimentar a los
              perritos callejeros de Tres Ríos.
            </p>
            <p className="text-silver-400 leading-relaxed mb-8">
              Cada producto que ves aquí fue diseñado y elaborado completamente a mano. No hay dos
              piezas iguales. Cuando compras en Yawne Creations, no solo llevas arte contigo — también
              pones comida en el plato de un amigo peludo.
            </p>
            <a
              href="https://wa.me/50683278331"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} />
              Conectar con nosotros
            </a>
          </div>

          {/* Stats / highlights */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Productos únicos", value: "100%", desc: "Hechos a mano" },
              { label: "Sin repetir", value: "1:1", desc: "Cada pieza es irrepetible" },
              { label: "Con propósito", value: "♡", desc: "Ayuda a perritos callejeros" },
              { label: "Ubicación", value: "CR", desc: "Tres Ríos, Costa Rica" },
            ].map((s) => (
              <div key={s.label} className="card p-5 flex flex-col gap-1">
                <span className="text-2xl font-display text-silver-300">{s.value}</span>
                <span className="text-silver-100 text-sm font-medium">{s.label}</span>
                <span className="text-silver-500 text-xs">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section id="envios" className="py-24 px-4 max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-silver-100 text-center mb-2">
          Envíos
        </h2>
        <p className="text-silver-400 text-center mb-16 max-w-xl mx-auto">
          Nos ubicamos en Tres Ríos. Coordinamos entrega con costo adicional.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <Package size={28} className="text-silver-300" />,
              title: "Correos de Costa Rica",
              desc: "Envío a todo el país. El cliente coordina y asume el costo del envío directamente con Correos CR.",
            },
            {
              icon: <MessageCircle size={28} className="text-silver-300" />,
              title: "Uber Flash",
              desc: "Para entregas express en el GAM. El cliente solicita y asume el costo de Uber Flash desde Tres Ríos.",
            },
          ].map((item) => (
            <div key={item.title} className="card p-8 flex gap-5">
              <div className="shrink-0 mt-1">{item.icon}</div>
              <div>
                <h3 className="font-display text-silver-100 text-xl mb-2">{item.title}</h3>
                <p className="text-silver-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-silver-500 text-sm mt-8">
          ¿Preguntas sobre un envío?{" "}
          <a
            href="https://wa.me/50683278331"
            target="_blank"
            rel="noopener noreferrer"
            className="text-silver-300 underline hover:text-silver-100"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </section>

      <Footer />
    </div>
  );
}
