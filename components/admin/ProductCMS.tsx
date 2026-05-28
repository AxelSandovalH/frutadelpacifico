'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { products } from '@/lib/data'
import { getProductSettings, saveProductSetting, uploadProductImage, getInsumos } from '@/lib/supabase'
import type { Insumo, RecipeItem } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { X, Upload, Save, Loader2, Check, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'

type Override = {
  price?:       number
  inStock?:     boolean
  imageUrl?:    string
  description?: string
  cost?:        number
  recipe?:      RecipeItem[]
}

type Merged = Product & { _ov?: Override }

export function ProductCMS() {
  const [overrides,      setOverrides]      = useState<Record<string, Override>>({})
  const [insumos,        setInsumos]        = useState<Insumo[]>([])
  const [loading,        setLoading]        = useState(true)
  const [editing,        setEditing]        = useState<Merged | null>(null)
  const [editState,      setEditState]      = useState<Override>({})
  const [saving,         setSaving]         = useState(false)
  const [saved,          setSaved]          = useState(false)
  const [saveError,      setSaveError]      = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [addingInsumo,   setAddingInsumo]   = useState(false)
  const [newItem,        setNewItem]        = useState<{ insumoId: string; quantity: string }>({ insumoId: '', quantity: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([getProductSettings(), getInsumos()]).then(([settings, ins]) => {
      setOverrides(settings as Record<string, Override>)
      setInsumos(ins)
      setLoading(false)
    })
  }, [])

  function calcRecipeCost(recipe: RecipeItem[]): number {
    return recipe.reduce((sum, item) => {
      const insumo = insumos.find((i) => i.id === item.insumoId)
      return sum + (insumo ? item.quantity * insumo.pricePerUnit : 0)
    }, 0)
  }

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
      cost:        ov.cost,
      recipe:      ov.recipe      ?? [],
    })
    setAddingInsumo(false)
    setNewItem({ insumoId: '', quantity: '' })
    setSaved(false)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setSaveError(false)

    const recipe = editState.recipe ?? []
    const stateToSave: Override = {
      ...editState,
      cost: recipe.length > 0 ? calcRecipeCost(recipe) : editState.cost,
    }

    const result = await saveProductSetting(editing.id, stateToSave)
    if (result.success) {
      setOverrides((prev) => ({ ...prev, [editing.id]: { ...stateToSave } }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 3000)
      console.error('[ProductCMS] save failed:', result.error)
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
    if (fileRef.current) fileRef.current.value = ''
  }

  function addRecipeItem() {
    const qty = parseFloat(newItem.quantity)
    if (!newItem.insumoId || !qty || qty <= 0) return
    setEditState((s) => ({
      ...s,
      recipe: [
        ...(s.recipe ?? []).filter((r) => r.insumoId !== newItem.insumoId),
        { insumoId: newItem.insumoId, quantity: qty },
      ],
    }))
    setNewItem({ insumoId: '', quantity: '' })
    setAddingInsumo(false)
  }

  function removeRecipeItem(insumoId: string) {
    setEditState((s) => ({ ...s, recipe: (s.recipe ?? []).filter((r) => r.insumoId !== insumoId) }))
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
  const recipe         = editState.recipe ?? []
  const recipeCost     = calcRecipeCost(recipe)
  const editPrice      = editState.price ?? 0

  return (
    <>
      {/* ── Product grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {merged.map((p) => {
          const cost   = overrides[p.id]?.cost
          const margin = cost && cost > 0 ? ((p.price - cost) / p.price) * 100 : null
          const mColor = margin == null ? '' : margin >= 40 ? 'text-green-600' : margin >= 20 ? 'text-amber-500' : 'text-red-500'
          return (
            <button
              key={p.id}
              onClick={() => openEdit(p)}
              className="relative bg-white rounded-2xl border border-stone-100 p-3 text-left transition-all active:scale-[0.97] hover:border-orange-200"
            >
              {p._ov && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-400 rounded-full" />}

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
              {margin != null && (
                <p className={`text-[11px] font-bold mt-0.5 ${mColor}`}>{margin.toFixed(0)}% margen</p>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Edit bottom sheet ── */}
      {editing && (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)} />

          <div className="relative bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-stone-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{editing.emoji}</span>
                <h3 className="font-black text-stone-900">{editing.shortName}</h3>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-stone-100">
                <X size={18} className="text-stone-500" />
              </button>
            </div>

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
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 block">Precio de venta</label>
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

              {/* ── Recipe / cost section ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Receta de costo</label>
                  {!addingInsumo && insumos.length > 0 && (
                    <button
                      onClick={() => setAddingInsumo(true)}
                      className="flex items-center gap-1 text-xs font-bold text-orange-500"
                    >
                      <Plus size={12} /> Agregar
                    </button>
                  )}
                </div>

                {/* Recipe items */}
                {recipe.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {recipe.map((item) => {
                      const insumo = insumos.find((i) => i.id === item.insumoId)
                      if (!insumo) return null
                      const lineCost = item.quantity * insumo.pricePerUnit
                      return (
                        <div key={item.insumoId} className="flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">{insumo.name}</p>
                            <p className="text-[10px] text-stone-400">{item.quantity} {insumo.unit}</p>
                          </div>
                          <p className="text-xs font-bold text-stone-600 shrink-0">{formatPrice(lineCost)}</p>
                          <button onClick={() => removeRecipeItem(item.insumoId)} className="p-1 text-stone-300 hover:text-red-400 shrink-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Recipe total */}
                {recipe.length > 0 && (
                  <div className="bg-stone-100 rounded-xl px-3 py-2.5 flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-stone-500">Costo total</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-stone-900">{formatPrice(recipeCost)}</p>
                      {editPrice > 0 && (() => {
                        const margin = ((editPrice - recipeCost) / editPrice) * 100
                        const c = margin >= 40 ? 'text-green-600' : margin >= 20 ? 'text-amber-500' : 'text-red-500'
                        return (
                          <p className={`text-[10px] font-bold ${c}`}>
                            {margin.toFixed(1)}% margen · {formatPrice(editPrice - recipeCost)} ganancia
                          </p>
                        )
                      })()}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {recipe.length === 0 && !addingInsumo && (
                  <div className="text-center py-3 text-stone-300 border border-dashed border-stone-200 rounded-xl">
                    <p className="text-xs">Sin receta</p>
                    {insumos.length === 0
                      ? <p className="text-[10px] mt-0.5">Primero agrega insumos en el tab "Insumos"</p>
                      : <button onClick={() => setAddingInsumo(true)} className="text-[10px] text-orange-500 font-bold mt-0.5">+ Agregar primer insumo</button>
                    }
                  </div>
                )}

                {/* Add insumo inline form */}
                {addingInsumo && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                    <select
                      value={newItem.insumoId}
                      onChange={(e) => setNewItem((n) => ({ ...n, insumoId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Seleccionar insumo…</option>
                      {insumos
                        .filter((i) => !recipe.find((r) => r.insumoId === i.id))
                        .map((i) => (
                          <option key={i.id} value={i.id}>{i.name} (/{i.unit})</option>
                        ))
                      }
                    </select>

                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem((n) => ({ ...n, quantity: e.target.value }))}
                        placeholder="Cantidad"
                        className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      {newItem.insumoId && (
                        <span className="text-xs text-stone-400 font-semibold shrink-0">
                          {insumos.find((i) => i.id === newItem.insumoId)?.unit}
                        </span>
                      )}
                    </div>

                    {newItem.insumoId && newItem.quantity && parseFloat(newItem.quantity) > 0 && (() => {
                      const insumo = insumos.find((i) => i.id === newItem.insumoId)!
                      const cost   = parseFloat(newItem.quantity) * insumo.pricePerUnit
                      return <p className="text-xs text-stone-500">Costo: <strong>{formatPrice(cost)}</strong></p>
                    })()}

                    <div className="flex gap-2">
                      <button
                        onClick={addRecipeItem}
                        disabled={!newItem.insumoId || !newItem.quantity || parseFloat(newItem.quantity) <= 0}
                        className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold disabled:opacity-40 active:bg-orange-600"
                      >
                        + Agregar a receta
                      </button>
                      <button
                        onClick={() => { setAddingInsumo(false); setNewItem({ insumoId: '', quantity: '' }) }}
                        className="px-3 py-2 rounded-lg bg-stone-100 text-stone-500 text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual cost fallback (shown only when no recipe) */}
              {recipe.length === 0 && (
                <div>
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 block">
                    Costo manual (sin receta)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">$</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={editState.cost ?? ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        setEditState((s) => ({ ...s, cost: isNaN(val) ? undefined : val }))
                      }}
                      placeholder="0"
                      className="w-full pl-9 pr-4 py-4 rounded-xl border border-stone-200 text-2xl font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    />
                  </div>
                  {editState.cost && editState.cost > 0 && editPrice > 0 && (() => {
                    const profit = editPrice - editState.cost
                    const margin = (profit / editPrice) * 100
                    const markup = (profit / editState.cost) * 100
                    const c = margin >= 40 ? 'text-green-600' : margin >= 20 ? 'text-amber-500' : 'text-red-500'
                    return (
                      <div className="mt-3 bg-stone-50 rounded-2xl px-4 py-3 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide">Ganancia</p>
                          <p className="text-base font-black text-stone-900">{formatPrice(profit)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide">Margen</p>
                          <p className={`text-base font-black ${c}`}>{margin.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide">Markup</p>
                          <p className="text-base font-black text-stone-900">{markup.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

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
                  saved      ? 'bg-green-500 text-white'
                  : saveError ? 'bg-red-500 text-white'
                  : saving    ? 'bg-stone-200 text-stone-400'
                  : 'bg-orange-500 text-white active:bg-orange-600 shadow-lg shadow-orange-200',
                ].join(' ')}
              >
                {saved
                  ? <span className="flex items-center justify-center gap-2"><Check size={18} /> ¡Guardado!</span>
                  : saveError
                    ? <span className="flex items-center justify-center gap-2"><X size={18} /> Error al guardar</span>
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
