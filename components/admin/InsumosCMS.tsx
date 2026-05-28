'use client'

import { useState, useEffect } from 'react'
import { getInsumos, saveInsumo, deleteInsumo } from '@/lib/supabase'
import type { Insumo } from '@/lib/supabase'
import { Plus, Save, Trash2, Loader2, Check, Pencil, X } from 'lucide-react'

const UNITS = [
  { value: 'g',  label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'L',  label: 'Litros (L)' },
  { value: 'pz', label: 'Pieza (pz)' },
]

type FormState = { name: string; unit: string; pricePerUnit: number; notes: string }
const emptyForm = (): FormState => ({ name: '', unit: 'g', pricePerUnit: 0, notes: '' })

export function InsumosCMS() {
  const [insumos,  setInsumos]  = useState<Insumo[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding,   setAdding]   = useState(false)
  const [form,     setForm]     = useState<FormState>(emptyForm())
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    getInsumos().then((data) => { setInsumos(data); setLoading(false) })
  }, [])

  function openAdd() {
    setForm(emptyForm())
    setAdding(true)
    setEditingId(null)
  }

  function openEdit(insumo: Insumo) {
    setForm({ name: insumo.name, unit: insumo.unit, pricePerUnit: insumo.pricePerUnit, notes: insumo.notes ?? '' })
    setEditingId(insumo.id)
    setAdding(false)
  }

  function cancel() { setAdding(false); setEditingId(null) }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    const id      = editingId ?? `ins-${Date.now()}`
    const insumo: Insumo = { id, name: form.name.trim(), unit: form.unit, pricePerUnit: form.pricePerUnit, notes: form.notes || undefined }
    const result  = await saveInsumo(insumo)
    if (result.success) {
      setInsumos((prev) =>
        editingId
          ? prev.map((i) => (i.id === editingId ? insumo : i))
          : [...prev, insumo].sort((a, b) => a.name.localeCompare(b.name))
      )
      setSaved(true)
      setTimeout(() => { setSaved(false); cancel() }, 1200)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const result = await deleteInsumo(id)
    if (result.success) setInsumos((prev) => prev.filter((i) => i.id !== id))
  }

  const formVisible = adding || editingId !== null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
          {insumos.length} insumos
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl active:bg-orange-600"
        >
          <Plus size={13} /> Nuevo insumo
        </button>
      </div>

      {/* Add / Edit form */}
      {formVisible && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
            {editingId ? 'Editar insumo' : 'Nuevo insumo'}
          </p>

          <div>
            <label className="text-xs text-stone-500 font-semibold mb-1 block">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Mango deshidratado"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500 font-semibold mb-1 block">Unidad</label>
              <select
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-500 font-semibold mb-1 block">Precio / {form.unit}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.0001"
                  value={form.pricePerUnit || ''}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.0000"
                  className="w-full pl-7 pr-2 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || saved || !form.name.trim()}
              className={[
                'flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5',
                saved    ? 'bg-green-500 text-white'
                : saving ? 'bg-stone-200 text-stone-400'
                :          'bg-orange-500 text-white active:bg-orange-600',
              ].join(' ')}
            >
              {saved    ? <><Check size={14} /> ¡Guardado!</>
              : saving  ? <><Loader2 size={14} className="animate-spin" /> Guardando…</>
              :           <><Save   size={14} /> Guardar</>}
            </button>
            <button onClick={cancel} className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-500 text-sm font-bold">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {insumos.length === 0 ? (
        <div className="text-center py-12 text-stone-300">
          <p className="text-sm font-semibold">Sin insumos registrados</p>
          <p className="text-xs mt-1">Agrega materias primas y empaques para calcular costos automáticamente</p>
        </div>
      ) : (
        <div className="space-y-2">
          {insumos.map((insumo) => (
            <div key={insumo.id} className="bg-white rounded-2xl border border-stone-100 px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-900 text-sm">{insumo.name}</p>
                <p className="text-xs text-stone-400">
                  ${insumo.pricePerUnit.toFixed(4)} / {insumo.unit}
                  {insumo.unit === 'g' && (
                    <span className="text-stone-300"> · ${(insumo.pricePerUnit * 1000).toFixed(2)} / kg</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => openEdit(insumo)}
                className="p-2 rounded-xl bg-stone-100 text-stone-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => handleDelete(insumo.id)}
                className="p-2 rounded-xl bg-stone-100 text-stone-400 hover:bg-red-50 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
