"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasMany = product.images.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + product.images.length) % product.images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % product.images.length);
  };
  const goTo = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i);
  };

  const waMessage = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}. ¿Está disponible?`
  );
  const waPriceMessage = encodeURIComponent(
    `Hola! Me gustaría saber el precio del producto: ${product.name}. ¿Me podrías indicar?`
  );

  return (
    <article className="card flex flex-col overflow-hidden group">
      {/* Image carousel — clicking navigates to detail */}
      <Link href={`/producto/${product.id}`} className="block relative aspect-square bg-navy-950 overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[imgIdx]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-silver-500 text-sm">
            Sin imagen
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy-900/90 text-silver-200 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Eye size={13} /> Ver detalles
          </span>
        </div>

        {hasMany && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-navy-900/80 text-silver-300 rounded-full p-1 hover:bg-navy-800 transition-colors z-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy-900/80 text-silver-300 rounded-full p-1 hover:bg-navy-800 transition-colors z-10"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goTo(i, e)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === imgIdx ? "bg-silver-300" : "bg-silver-500/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {product.featured && (
          <span className="absolute top-3 left-3 bg-silver-300/90 text-navy-900 text-xs font-semibold px-2 py-1 rounded-full z-10">
            Destacado
          </span>
        )}

        {!product.available && (
          <div className="absolute inset-0 bg-navy-900/70 flex items-center justify-center z-10">
            <span className="text-silver-400 font-semibold text-sm border border-silver-500 px-3 py-1 rounded-full">
              No disponible
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {product.category && (
          <span className="text-silver-500 text-xs uppercase tracking-widest">{product.category}</span>
        )}
        <Link href={`/producto/${product.id}`} className="hover:text-silver-300 transition-colors">
          <h3 className="font-display text-silver-100 text-lg leading-snug">{product.name}</h3>
        </Link>
        {product.description && (
          <p className="text-silver-400 text-sm leading-relaxed line-clamp-3">{product.description}</p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          {product.price != null ? (
            <span className="text-silver-300 font-semibold text-lg">
              ₡{product.price.toLocaleString("es-CR")}
            </span>
          ) : (
            <a
              href={`https://wa.me/50683278331?text=${waPriceMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ice-blue text-sm italic hover:text-silver-300 transition-colors underline underline-offset-2"
            >
              Consultar precio
            </a>
          )}

          {product.available && (
            <a
              href={`https://wa.me/50683278331?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4"
            >
              <MessageCircle size={16} />
              Pedir
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
