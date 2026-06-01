"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Truck,
  Package,
  AlertCircle,
} from "lucide-react";
import { getProduct } from "@/lib/products";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    getProduct(id).then((p) => {
      if (!p) setNotFound(true);
      else setProduct(p);
      setLoading(false);
    });
  }, [id]);

  const prev = () =>
    setActiveImg((i) => (i - 1 + (product?.images.length ?? 1)) % (product?.images.length ?? 1));
  const next = () =>
    setActiveImg((i) => (i + 1) % (product?.images.length ?? 1));

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
          <p className="text-silver-400 text-sm">Cargando producto…</p>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-6">
          <Package size={48} className="text-silver-400" />
          <h1 className="font-display text-silver-100 text-2xl">Producto no encontrado</h1>
          <p className="text-silver-400 text-sm max-w-xs">
            El producto que buscas no existe o ya no está disponible.
          </p>
          <Link
            href="/#galeria"
            className="btn-primary"
          >
            <ArrowLeft size={16} />
            Ver todos los productos
          </Link>
        </div>
      </main>
    );
  }

  const waMessage = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`
  );
  const waPriceMessage = encodeURIComponent(
    `Hola! Me gustaría saber el precio del producto: ${product.name}. ¿Me podrías indicar?`
  );

  return (
    <main className="min-h-screen bg-navy-900">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          href="/#galeria"
          className="inline-flex items-center gap-2 text-silver-400 hover:text-silver-200 transition-colors text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a la galería
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Left: image gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-navy-950 border border-navy-700">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[activeImg]}
                  alt={`${product.name} — imagen ${activeImg + 1}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-silver-500">
                  Sin imagen
                </div>
              )}

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-navy-900/80 backdrop-blur-sm text-silver-300 rounded-full p-2 hover:bg-navy-800 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-navy-900/80 backdrop-blur-sm text-silver-300 rounded-full p-2 hover:bg-navy-800 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-navy-900/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-silver-400">
                    {activeImg + 1} / {product.images.length}
                  </div>
                </>
              )}

              {!product.available && (
                <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center">
                  <span className="text-silver-300 font-semibold border border-silver-500 px-4 py-2 rounded-full bg-navy-900/80 backdrop-blur-sm">
                    No disponible
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImg
                        ? "border-silver-300 scale-105"
                        : "border-navy-700 hover:border-navy-600 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Miniatura ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: product info ── */}
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <span className="text-ice-blue text-xs uppercase tracking-widest font-medium border border-navy-700 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
              {product.featured && (
                <span className="flex items-center gap-1 bg-silver-300/10 text-silver-300 text-xs font-semibold px-3 py-1 rounded-full border border-silver-300/30">
                  <Star size={11} fill="currentColor" />
                  Destacado
                </span>
              )}
              {!product.available && (
                <span className="flex items-center gap-1 text-xs text-silver-500 border border-navy-700 px-3 py-1 rounded-full">
                  <AlertCircle size={11} />
                  No disponible
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-silver-100 text-3xl sm:text-4xl leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="py-4 border-y border-navy-700">
              {product.price != null ? (
                <p className="text-silver-300 text-3xl font-bold">
                  ₡{product.price.toLocaleString("es-CR")}
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-silver-400 text-sm">Precio a consultar</p>
                  <a
                    href={`https://wa.me/50683278331?text=${waPriceMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ice-blue text-base font-medium hover:text-silver-300 transition-colors underline underline-offset-4"
                  >
                    Preguntar precio por WhatsApp →
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="flex flex-col gap-2">
                <h2 className="text-silver-300 text-sm font-semibold uppercase tracking-wider">Descripción</h2>
                <p className="text-silver-400 text-base leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Handmade note */}
            <div className="flex items-start gap-3 bg-navy-800 rounded-xl p-4 border border-navy-700">
              <span className="text-xl mt-0.5">🤝</span>
              <p className="text-silver-400 text-sm leading-relaxed">
                Producto <span className="text-silver-200 font-medium">100% hecho a mano</span> por Mari Fer.
                Cada pieza es única y puede presentar pequeñas variaciones que la hacen especial.
              </p>
            </div>

            {/* CTA */}
            {product.available ? (
              <a
                href={`https://wa.me/50683278331?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center py-4 text-base"
              >
                <MessageCircle size={20} />
                Pedir por WhatsApp
              </a>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-silver-500 text-sm text-center">
                  Este producto no está disponible por ahora.
                </p>
                <a
                  href={`https://wa.me/50683278331?text=${encodeURIComponent(`Hola! Me interesa el producto: ${product.name}. ¿Cuándo estará disponible?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-center py-3 text-sm"
                >
                  <MessageCircle size={16} />
                  Preguntar disponibilidad
                </a>
              </div>
            )}

            {/* Shipping info */}
            <div className="flex flex-col gap-2 text-sm text-silver-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-ice-blue flex-shrink-0" />
                <span>Tres Ríos, Costa Rica</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-ice-blue flex-shrink-0" />
                <span>Envíos por Correos de Costa Rica o Uber Flash (costo adicional)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
