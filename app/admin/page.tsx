'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePOS }    from '@/store/usePOS'
import { formatPrice } from '@/lib/utils'
import type { POSSaleRecord, PaymentMethod } from '@/types'
import {
  LogOut, TrendingUp, ShoppingBag, Users,
  Clock, Banknote, Smartphone, ArrowLeft,
} from 'lucide-react'

type Tab = 'hoy' | 'ventas' | 'comisiones'

// ── Helpers ────────────────────────────────────────────────────────────────────
function sameDay(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr)
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth()    === ref.getMonth()    &&
    d.getDate()     === ref.getDate()
  )
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function fmtTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit',
  })
}

function payIcon(method: PaymentMethod) {
  return method === 'efectivo'
    ? <Banknote size={14} className="text-green-500" />
    : <Smartphone size={14} className="text-blue-500" />
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: {
  label:   string
  value:   string
  sub?:    string
  accent?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-orange-500 text-white' : 'bg-white border border-stone-100'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-orange-100' : 'text-stone-400'}`}>
        {label}
      </p>
      <p className={`text-2xl font-black mt-1 ${accent ? 'text-white' : 'text-stone-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${accent ? 'text-orange-100' : 'text-stone-400'}`}>{sub}</p>}
    </div>
  )
}

// ── Sale Row ───────────────────────────────────────────────────────────────────
function SaleRow({ sale }: { sale: POSSaleRecord }) {
  const [open, setOpen] = useState(false)
  const shortName = (n: string) =>
    n.replace(' Deshidratado', '').replace(' Deshidratada', '').replace(' 50g', '')

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-900 text-sm">{formatPrice(sale.total)}</span>
            <span className="flex items-center gap-1 text-xs text-stone-400">
              {payIcon(sale.paymentMethod)}
              {sale.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}
            </span>
            {sale.commission > 0 && (
              <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                Comisión {formatPrice(sale.commission)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-stone-400">{sale.userName}</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-400">{fmtTime(sale.createdAt)}</span>
          </div>
        </div>
        <span className="text-stone-300 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-stone-50 px-4 py-3 space-y-1.5 bg-stone-50/50">
          {sale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-stone-600">{item.quantity}× {shortName(item.productName)}</span>
              <span className="font-medium text-stone-800">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          {sale.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold border-t border-stone-100 pt-1.5">
              <span>🎉 Descuento 3×2</span>
              <span>−{formatPrice(sale.discount)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Hoy Tab ────────────────────────────────────────────────────────────────────
function HoyTab({ sales }: { sales: POSSaleRecord[] }) {
  const today    = useMemo(() => new Date(), [])
  const todaySales = useMemo(
    () => sales.filter((s) => sameDay(s.createdAt, today)),
    [sales, today]
  )

  const totalHoy       = todaySales.reduce((a, s) => a + s.total, 0)
  const comisionHoy    = todaySales.reduce((a, s) => a + s.commission, 0)
  const efectivoHoy    = todaySales.filter((s) => s.paymentMethod === 'efectivo').reduce((a, s) => a + s.total, 0)
  const transferenciaHoy = todaySales.filter((s) => s.paymentMethod === 'transferencia').reduce((a, s) => a + s.total, 0)

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total hoy"     value={formatPrice(totalHoy)}    sub={`${todaySales.length} ventas`} accent />
        <StatCard label="Comisión"      value={formatPrice(comisionHoy)} sub="colaboradora" />
        <StatCard label="Efectivo"      value={formatPrice(efectivoHoy)} />
        <StatCard label="Transferencia" value={formatPrice(transferenciaHoy)} />
      </div>

      {/* Sales list */}
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
          Ventas del día
        </p>
        {todaySales.length === 0 ? (
          <div className="text-center py-10 text-stone-300">
            <ShoppingBag size={36} className="mx-auto mb-2" />
            <p className="text-sm">Sin ventas hoy todavía</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todaySales.map((sale) => <SaleRow key={sale.id} sale={sale} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Ventas Tab ─────────────────────────────────────────────────────────────────
function VentasTab({ sales }: { sales: POSSaleRecord[] }) {
  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, POSSaleRecord[]>()
    for (const sale of sales) {
      const key = fmtDate(sale.createdAt)
      const arr = map.get(key) ?? []
      arr.push(sale)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [sales])

  if (sales.length === 0) {
    return (
      <div className="text-center py-16 text-stone-300">
        <TrendingUp size={40} className="mx-auto mb-3" />
        <p className="text-sm">Sin ventas registradas</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {grouped.map(([date, daySales]) => {
        const dayTotal = daySales.reduce((a, s) => a + s.total, 0)
        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">{date}</p>
              <p className="text-sm font-black text-stone-900">{formatPrice(dayTotal)}</p>
            </div>
            <div className="space-y-2">
              {daySales.map((sale) => <SaleRow key={sale.id} sale={sale} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Comisiones Tab ─────────────────────────────────────────────────────────────
function ComisionesTab({ sales }: { sales: POSSaleRecord[] }) {
  const colabSales  = useMemo(() => sales.filter((s) => s.userRole === 'collaborator'), [sales])
  const ownerSales  = useMemo(() => sales.filter((s) => s.userRole === 'owner'), [sales])

  const totalColab      = colabSales.reduce((a, s) => a + s.total, 0)
  const totalComision   = colabSales.reduce((a, s) => a + s.commission, 0)
  const totalOwner      = ownerSales.reduce((a, s) => a + s.total, 0)
  const grandTotal      = totalColab + totalOwner

  const today           = useMemo(() => new Date(), [])
  const colabHoy        = colabSales.filter((s) => sameDay(s.createdAt, today))
  const comisionHoy     = colabHoy.reduce((a, s) => a + s.commission, 0)

  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
        <h3 className="font-black text-stone-900">Resumen total</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Ventas totales',        value: formatPrice(grandTotal),    bold: true  },
            { label: 'Ventas de colaboradora', value: formatPrice(totalColab),   bold: false },
            { label: 'Ventas directas (Axel)', value: formatPrice(totalOwner),   bold: false },
            { label: 'Comisión acumulada',      value: formatPrice(totalComision), bold: true, accent: true },
            { label: 'Comisión hoy',            value: formatPrice(comisionHoy),   bold: false },
          ].map(({ label, value, bold, accent }) => (
            <div key={label} className="flex justify-between">
              <span className={accent ? 'text-green-700 font-semibold' : 'text-stone-500'}>{label}</span>
              <span className={bold ? (accent ? 'font-black text-green-700' : 'font-black text-stone-900') : 'font-medium text-stone-700'}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborator sales */}
      {colabSales.length > 0 && (
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">
            Ventas de colaboradora ({colabSales.length})
          </p>
          <div className="space-y-2">
            {colabSales.map((sale) => <SaleRow key={sale.id} sale={sale} />)}
          </div>
        </div>
      )}

      {colabSales.length === 0 && (
        <div className="text-center py-10 text-stone-300">
          <Users size={36} className="mx-auto mb-2" />
          <p className="text-sm">Sin ventas de colaboradora aún</p>
        </div>
      )}
    </div>
  )
}

// ── PIN Gate (re-uses same numpad pattern as POS) ──────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const { login, logout } = usePOS()
  const [pin,   setPin]   = useState('')
  const [shake, setShake] = useState(false)
  const [msg,   setMsg]   = useState('')

  function pressDigit(d: string) {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    if (next.length === 4) {
      const ok = login(next)
      if (!ok) {
        setMsg('PIN incorrecto')
        setShake(true)
        setTimeout(() => { setPin(''); setShake(false); setMsg('') }, 700)
      }
      // Role check handled in parent useEffect
    }
  }

  function backspace() { setPin((p) => p.slice(0, -1)) }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 gap-8 select-none">
      <div className="text-center">
        <div className="text-5xl mb-3">🌴</div>
        <h1 className="text-2xl font-black text-stone-900">Panel Admin</h1>
        <p className="text-sm text-stone-400 mt-1 font-medium">Solo acceso de administrador</p>
      </div>

      <div className={`flex gap-5 ${shake ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}`}>
        {[0,1,2,3].map((i) => (
          <div
            key={i}
            className={[
              'w-4 h-4 rounded-full border-2 transition-all duration-150',
              i < pin.length
                ? shake ? 'bg-red-400 border-red-400 scale-110' : 'bg-orange-500 border-orange-500 scale-110'
                : 'border-stone-300',
            ].join(' ')}
          />
        ))}
      </div>

      {msg && <p className="text-red-500 text-sm font-medium -mt-4">{msg}</p>}

      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {keys.map((key, idx) => (
          <button
            key={idx}
            onClick={() => key === '⌫' ? backspace() : key !== '' ? pressDigit(key) : undefined}
            disabled={key === ''}
            className={[
              'h-16 rounded-2xl text-xl font-bold transition-all duration-100 active:scale-95',
              key === '' ? 'invisible' : '',
              key === '⌫'
                ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                : 'bg-white border border-stone-200 text-stone-900 hover:bg-orange-50 hover:border-orange-300 shadow-sm',
            ].join(' ')}
          >
            {key}
          </button>
        ))}
      </div>

      <a
        href="/pos"
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft size={14} /> Ir al POS
      </a>
    </div>
  )
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [mounted,   setMounted]   = useState(false)
  const [authed,    setAuthed]    = useState(false)
  const [tab,       setTab]       = useState<Tab>('hoy')
  const [accessErr, setAccessErr] = useState(false)

  const { currentUser, logout, recentSales } = usePOS()

  useEffect(() => { setMounted(true) }, [])

  // Watch currentUser after login attempt
  useEffect(() => {
    if (!mounted) return
    if (currentUser?.role === 'owner') {
      setAuthed(true)
      setAccessErr(false)
    } else if (currentUser) {
      // Collaborator tried to access admin
      setAccessErr(true)
      logout()
      setTimeout(() => setAccessErr(false), 1500)
    }
  }, [mounted, currentUser, logout])

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  if (!mounted) return null

  const tabs: { key: Tab; label: string; icon: typeof TrendingUp }[] = [
    { key: 'hoy',       label: 'Hoy',         icon: Clock        },
    { key: 'ventas',    label: 'Ventas',       icon: ShoppingBag  },
    { key: 'comisiones',label: 'Comisiones',   icon: Users        },
  ]

  return (
    <div className="fixed inset-0 z-[200] bg-stone-50 flex flex-col overflow-hidden">

      {/* ── PIN Gate ──────────────────────────────────────────────────────── */}
      {!authed && (
        <>
          {accessErr && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow z-10">
              Sin acceso de administrador
            </div>
          )}
          <PinGate onUnlock={() => setAuthed(true)} />
        </>
      )}

      {/* ── Dashboard ─────────────────────────────────────────────────────── */}
      {authed && (
        <>
          {/* Top bar */}
          <div className="bg-white border-b border-stone-100 flex items-center justify-between px-4 py-3 flex-shrink-0">
            <div>
              <p className="font-black text-stone-900 text-sm">Panel Admin</p>
              <p className="text-xs text-stone-400">{recentSales.length} ventas registradas</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/pos"
                className="p-2.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                title="Ir al POS"
              >
                <ArrowLeft size={18} />
              </a>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-stone-100 flex flex-shrink-0">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={[
                  'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-bold transition-colors',
                  tab === key
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-stone-400 hover:text-stone-600',
                ].join(' ')}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {tab === 'hoy'        && <HoyTab        sales={recentSales} />}
            {tab === 'ventas'     && <VentasTab      sales={recentSales} />}
            {tab === 'comisiones' && <ComisionesTab  sales={recentSales} />}
          </div>
        </>
      )}
    </div>
  )
}
