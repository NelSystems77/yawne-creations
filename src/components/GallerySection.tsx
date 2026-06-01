"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

export default function GallerySection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");

  useEffect(() => {
    getProducts()
      .then((p) => setProducts(p.filter((x) => x.available !== false || x.available === undefined)))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["todos", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const visible =
    filter === "todos" ? products : products.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="text-silver-400 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-silver-500">
        <p className="text-lg font-display text-silver-300 mb-2">Próximamente</p>
        <p className="text-sm">Estamos preparando los productos. ¡Vuelve pronto!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 capitalize ${
                filter === cat
                  ? "bg-silver-300 text-navy-900 font-semibold"
                  : "border border-navy-700 text-silver-400 hover:border-silver-500 hover:text-silver-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
