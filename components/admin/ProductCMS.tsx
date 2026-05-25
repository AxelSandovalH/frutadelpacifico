'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { products } from '@/lib/data'
import { getProductSettings, saveProductSetting, uploadProductImage } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { X, Upload, Save, Loader2, Check, Eye, EyeOff } from 'lucide-react'

type Override = {
  price?:       number
  inStock?:     boolean
  imageUrl?:    string
  description?: string
}

type Merged = Product & { _ov?: Override }

export function ProductCMS() {
  const [overrides,       setOverrides]       = useState<Record<string, Override>>({})
  const [loading,         setLoading]         = useState(true)
  const [editing,         setEditing]         = useState<Merged | null>(null)
  const [editState,       setEditState]       = useState<Override>({})
  const [saving,          setSaving]          = useState(false)
  const [saved,           setSaved]           = useState(false)
  const [imageUploading,  setImageUploading]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getProductSettings().then((data) => {
      setOverrides(data as Record<string, Override>)
      setLoading(false)
    })
  }, [])

  function merge(p: Product): Merged {
    const ov = overrides[p.id]
    if (!ov) return p
    return {
      ...p,
      price:       ov.price       ?? p.price,
      inStock:     ov.inStock     ?? p.inStock,
      image:       ov.imageUrl    ?? p.image,
      description: ov.description ?? p.description,
      _ov: ov,
    }
  }

  function openEdit(p: Merged) {
    const ov = overrides[p.id] ?? {}
    setEditing(p)
    setEditState({
      price:       ov.price       ?? p.price,
      inStock:     ov.inStock     ?? p.inStock,
      imageUrl:    ov.imageUrl    ?? p.image,
      description: ov.description ?? p.description,
    })
    setSaved(false)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    const result = await saveProductSetting(editing.id, editState)
    if (result.success) {
      setOverrides((prev) => ({ ...prev, [editing.id]: { ...editState } }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editing || !e.target.files?.[0]) return
    const file = e.target.files[0]
    setImageUploading(true)
    const url = await uploadProductImage(editing.id, file)
    if (url) setEditState((s) => ({ ...s, imageUrl: url }))
    setImageUploading(false)
    // reset input so same file can be selected again
    if (fileRef.current) fileRef.current.value = ''
  }

  const merged = products.map(merge)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </div>
    )
  }

  const currentInStock = editState.inStock ?? editing?.inStock ?? true
  const currentImage   = editState.imageUrl ?? editing?.image ?? ''

  return (
    <>
      {/* ── Product grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {merged.map((p) => (
          <button
            key={p.id}
            onClick={() => openEdit(p)}
            className="relative bg-white rounded-2xl border border-stone-100 p-3 text-left transition-all active:scale-[0.97] hover:border-orange-200"
          >
            {/* Dot: has override */}
            {p._ov && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-400 rounded-full" />
            )}

            {/* Thumbnail */}
            <div className="relative h-20 rounded-xl overflow-hidden bg-amber-50 mb-2.5">
              <Image src={p.image} alt={p.shortName} fill className="object-cover" sizes="120px" />
              {!p.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-[10px] font-black bg-red-500 px-2 py-0.5 rounded-full">SIN STOCK</span>
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-stone-900 leading-tight truncate">{p.shortName}</p>
            <p className="text-sm font-black text-orange-500 mt-0.5">{formatPrice(p.price)}</p>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${p.inStock ? 'text-green-600' : 'text-red-400'}`}>
              {p.inStock ? <Eye size={11} /> : <EyeOff size={11} />}
              {p.inStock ? 'En venta' : 'Oculto'}
            </div>
          </button>
        ))}
      </div>

      {/* ── Edit bottom sheet ── */}
      {editing && (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-stone-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{editing.emoji}</span>
                <h3 className="font-black text-stone-900">{editing.shortName}</h3>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-stone-100">
                <X size={18} className="text-stone-500" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

              {/* Image */}
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Imagen</p>
                <div className="relative h-44 rounded-2xl overflow-hidden bg-amber-50">
                  {currentImage && (
                    <Image src={currentImage} alt={editing.name} fill className="object-cover" sizes="400px" />
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={imageUploading}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 hover:bg-black/40 text-white transition-colors"
                  >
                    {imageUploading
                      ? <Loader2 size={26} className="animate-spin" />
                      : <><Upload size={26} /><span className="text-sm font-bold">Cambiar foto</span></>
                    }
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 block">Precio</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={editState.price ?? ''}
                    onChange={(e) => setEditState((s) => ({ ...s, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-9 pr-4 py-4 rounded-xl border border-stone-200 text-2xl font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* In stock */}
              <button
                onClick={() => setEditState((s) => ({ ...s, inStock: !currentInStock }))}
                className="w-full flex items-center justify-between bg-stone-50 rounded-2xl px-5 py-4"
              >
                <div className="text-left">
                  <p className="font-bold text-stone-900">En venta</p>
                  <p className="text-xs text-stone-400 mt-0.5">Visible en el catálogo del sitio</p>
                </div>
                <div className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${currentInStock ? 'bg-green-500' : 'bg-stone-300'}`}>
                  <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${currentInStock ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </button>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 block">Descripción corta</label>
                <textarea
                  value={editState.description ?? ''}
                  onChange={(e) => setEditState((s) => ({ ...s, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={[
                  'w-full py-4 rounded-2xl font-black text-base transition-all',
                  saved   ? 'bg-green-500 text-white'
                  : saving ? 'bg-stone-200 text-stone-400'
                  : 'bg-orange-500 text-white active:bg-orange-600 shadow-lg shadow-orange-200',
                ].join(' ')}
              >
                {saved
                  ? <span className="flex items-center justify-center gap-2"><Check size={18} /> ¡Guardado!</span>
                  : saving
                    ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Guardando…</span>
                    : <span className="flex items-center justify-center gap-2"><Save size={18} /> Guardar cambios</span>
                }
              </button>

              <div className="pb-6" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
