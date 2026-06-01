"use client";

import { useEffect, useState, useRef } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from "@/lib/products";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/AdminSidebar";
import { Product } from "@/types";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus, Eye, EyeOff, Star } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY: Omit<Product, "id" | "createdAt" | "createdBy"> = {
  name: "",
  description: "",
  price: null,
  images: [],
  category: "",
  available: true,
  featured: false,
};

export default function ProductsAdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [priceEnabled, setPriceEnabled] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({ ...EMPTY });
    setEditId(null);
    setPriceEnabled(false);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      images: p.images,
      category: p.category,
      available: p.available,
      featured: p.featured,
    });
    setPriceEnabled(p.price != null);
    setEditId(p.id);
    setShowForm(true);
  }

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !user) return;
    setUploading(true);
    try {
      const tempId = editId ?? `temp_${Date.now()}`;
      const urls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const url = await uploadProductImage(file, tempId);
        urls.push(url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast.success(`${urls.length} imagen(es) subida(s)`);
    } catch {
      toast.error("Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const data = {
        ...form,
        price: priceEnabled ? (form.price ?? 0) : null,
      };
      if (editId) {
        await updateProduct(editId, data);
        toast.success("Producto actualizado");
      } else {
        await createProduct(data, user.uid);
        toast.success("Producto creado");
      }
      setShowForm(false);
      load();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(p);
      toast.success("Producto eliminado");
      load();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function toggleAvailable(p: Product) {
    await updateProduct(p.id, { available: !p.available });
    load();
  }

  async function toggleFeatured(p: Product) {
    await updateProduct(p.id, { featured: !p.featured });
    load();
  }

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-silver-100">Productos</h1>
              <p className="text-silver-500 text-sm mt-1">{products.length} producto(s)</p>
            </div>
            <button onClick={openNew} className="btn-primary">
              <Plus size={18} />
              Agregar producto
            </button>
          </div>

          {/* Product list */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="text-silver-400 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center text-silver-500">
              <p className="font-display text-xl text-silver-300 mb-2">Sin productos</p>
              <p className="text-sm mb-6">Agrega tu primer producto para comenzar.</p>
              <button onClick={openNew} className="btn-primary mx-auto">
                <Plus size={16} /> Agregar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {products.map((p) => (
                <div key={p.id} className="card p-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-navy-950 shrink-0">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-silver-600">
                        <ImagePlus size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-silver-100 text-base">{p.name}</h3>
                      {p.featured && (
                        <span className="text-xs bg-navy-700 text-glow px-2 py-0.5 rounded-full">Destacado</span>
                      )}
                      {!p.available && (
                        <span className="text-xs bg-navy-700 text-silver-500 px-2 py-0.5 rounded-full">No disponible</span>
                      )}
                    </div>
                    {p.category && <p className="text-silver-500 text-xs">{p.category}</p>}
                    <p className="text-silver-400 text-sm mt-1">
                      {p.price != null ? `₡${p.price.toLocaleString("es-CR")}` : "Sin precio publicado"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleFeatured(p)}
                      title="Destacar"
                      className={`p-2 rounded-lg transition-colors ${p.featured ? "text-glow bg-navy-700" : "text-silver-500 hover:text-silver-300"}`}
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={() => toggleAvailable(p)}
                      title={p.available ? "Ocultar" : "Mostrar"}
                      className="p-2 rounded-lg text-silver-500 hover:text-silver-300 transition-colors"
                    >
                      {p.available ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-silver-500 hover:text-silver-300 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-2 rounded-lg text-silver-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-navy-800 border border-navy-700 rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-6 border-b border-navy-700">
              <h2 className="font-display text-silver-100 text-xl">
                {editId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-silver-500 hover:text-silver-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="label">Nombre *</label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </div>

              {/* Description */}
              <div>
                <label className="label">Descripción</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe el producto..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="label">Categoría</label>
                <input
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Ej: Accesorios, Decoración..."
                />
              </div>

              {/* Price toggle */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <label className="label mb-0">Precio</label>
                  <button
                    type="button"
                    onClick={() => setPriceEnabled(!priceEnabled)}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${
                      priceEnabled ? "bg-silver-300" : "bg-navy-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-navy-900 mt-0.5 transition-transform duration-200 ${
                        priceEnabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-silver-500 text-xs">
                    {priceEnabled ? "Visible en la galería" : "Oculto (consultar)"}
                  </span>
                </div>
                {priceEnabled && (
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="100"
                    value={form.price ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))
                    }
                    placeholder="Precio en colones (₡)"
                  />
                )}
              </div>

              {/* Images */}
              <div>
                <label className="label">Imágenes</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-navy-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-16 h-16 border border-dashed border-navy-600 rounded-lg flex items-center justify-center text-silver-500 hover:border-silver-500 hover:text-silver-300 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImages}
                />
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-silver-400 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                    className="accent-silver-300"
                  />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-silver-400 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="accent-silver-300"
                  />
                  Destacado
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? "Guardando..." : editId ? "Actualizar" : "Crear producto"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-4">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
