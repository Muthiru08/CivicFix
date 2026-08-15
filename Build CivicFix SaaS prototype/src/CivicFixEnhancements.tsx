import React, { useEffect, useMemo, useState } from "react"

type Tab = "rent" | "tenants" | "qr" | "maintenance" | "exports"

type RentRow = {
  unit: string
  tenant: string
  phone: string
  rent: number
  paid: number
  dueDate: string
  lastPayment?: string
  status: "Paid" | "Partial" | "Due"
}

type TenantHistory = {
  id: string
  tenant: string
  unit: string
  property: string
  moveIn: string
  moveOut: string | null
  phone: string
  status: "Current" | "Former"
}

type QrRecord = {
  id: string
  label: string
  property: string
  unit: string
  location: string
  active: boolean
}

type MaintenanceRecord = {
  id: string
  issue: string
  property: string
  unit: string
  tenant: string
  urgency: "Emergency" | "High" | "Normal" | "Low"
  status: "Requested" | "Assigned" | "In Progress" | "Completed" | "Verified"
  fundi: string
  evidence: string[]
  createdAt: string
}

const initialRent: RentRow[] = [
  { unit: "B-204", tenant: "Kevin Mwangi", phone: "+254712345678", rent: 35000, paid: 35000, dueDate: "2026-08-05", lastPayment: "MPESA QAB7K2L91", status: "Paid" },
  { unit: "B-205", tenant: "Faith Wanjiku", phone: "+254722456789", rent: 35000, paid: 20000, dueDate: "2026-08-05", lastPayment: "MPESA QAB8P4T12", status: "Partial" },
  { unit: "C-101", tenant: "Brian Otieno", phone: "+254733567890", rent: 42000, paid: 0, dueDate: "2026-08-05", status: "Due" },
  { unit: "A-112", tenant: "Mercy Njeri", phone: "+254744678901", rent: 30000, paid: 30000, dueDate: "2026-08-05", lastPayment: "MPESA QAC3R9V55", status: "Paid" },
]

const initialTenants: TenantHistory[] = [
  { id: "t-1", tenant: "Kevin Mwangi", unit: "B-204", property: "Blue Bells Apartments", moveIn: "2025-02-01", moveOut: null, phone: "+254712345678", status: "Current" },
  { id: "t-2", tenant: "Anne Wambui", unit: "B-204", property: "Blue Bells Apartments", moveIn: "2022-01-10", moveOut: "2025-01-20", phone: "+254701111222", status: "Former" },
  { id: "t-3", tenant: "Daniel Kariuki", unit: "B-204", property: "Blue Bells Apartments", moveIn: "2019-03-02", moveOut: "2021-12-18", phone: "+254702333444", status: "Former" },
  { id: "t-4", tenant: "Faith Wanjiku", unit: "B-205", property: "Blue Bells Apartments", moveIn: "2024-07-01", moveOut: null, phone: "+254722456789", status: "Current" },
]

const initialQr: QrRecord[] = [
  { id: "QR-BB-B204", label: "Blue Bells · B-204", property: "Blue Bells Apartments", unit: "B-204", location: "Kitchen", active: true },
  { id: "QR-BB-ENT", label: "Blue Bells · Main Entrance", property: "Blue Bells Apartments", unit: "Common Area", location: "Main Entrance", active: true },
  { id: "QR-BB-LIFT", label: "Blue Bells · Lift Lobby", property: "Blue Bells Apartments", unit: "Common Area", location: "Lift Lobby", active: true },
]

const initialMaintenance: MaintenanceRecord[] = [
  { id: "CF-1042", issue: "Kitchen sink leaking", property: "Blue Bells Apartments", unit: "B-204", tenant: "Kevin Mwangi", urgency: "High", status: "Assigned", fundi: "John · Plumber", evidence: ["reported-photo.jpg"], createdAt: "2026-08-15 10:32" },
  { id: "CF-1041", issue: "Corridor light not working", property: "Blue Bells Apartments", unit: "Common Area", tenant: "Caretaker", urgency: "Normal", status: "In Progress", fundi: "Moses · Electrician", evidence: ["issue.jpg", "before.jpg"], createdAt: "2026-08-15 09:18" },
]

function money(n: number) {
  return `KES ${n.toLocaleString()}`
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.map(csvCell).join(","), ...rows.map(row => headers.map(h => csvCell(row[h])).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function StatusPill({ status }: { status: string }) {
  const cls = status === "Paid" || status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "Due" || status === "Emergency" ? "bg-red-50 text-red-700 border-red-200" : status === "Partial" || status === "High" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-200"
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${cls}`}>{status}</span>
}

function MiniQr({ value }: { value: string }) {
  const bits = useMemo(() => {
    let seed = 0
    for (const ch of value) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
    return Array.from({ length: 121 }, (_, i) => {
      seed = (seed * 1664525 + 1013904223 + i) >>> 0
      return (seed & 1) === 1
    })
  }, [value])
  const finder = (x: number, y: number, px: number, py: number) => {
    const dx = x - px
    const dy = y - py
    return dx >= 0 && dx < 7 && dy >= 0 && dy < 7 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
  }
  return (
    <div className="grid grid-cols-11 gap-0 rounded bg-white p-1 border border-slate-200 shadow-inner" aria-label={`QR preview for ${value}`}>
      {bits.map((on, i) => {
        const x = i % 11
        const y = Math.floor(i / 11)
        const cell = finder(x, y, 0, 0) || finder(x, y, 4, 0) || finder(x, y, 0, 4)
        return <span key={i} className={`h-2.5 w-2.5 ${cell || on ? "bg-slate-900" : "bg-white"}`} />
      })}
    </div>
  )
}

export default function CivicFixEnhancements() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("rent")
  const [rent, setRent] = useState<RentRow[]>(() => readLocal("civicfix.rent", initialRent))
  const [tenants, setTenants] = useState<TenantHistory[]>(() => readLocal("civicfix.tenants", initialTenants))
  const [qrs, setQrs] = useState<QrRecord[]>(() => readLocal("civicfix.qrs", initialQr))
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => readLocal("civicfix.maintenance", initialMaintenance))
  const [notice, setNotice] = useState("")
  const [mpesaText, setMpesaText] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("B-205")
  const [newQr, setNewQr] = useState({ unit: "", location: "" })
  const [newIssue, setNewIssue] = useState({ issue: "", unit: "", tenant: "", urgency: "Normal" as MaintenanceRecord["urgency"] })

  useEffect(() => localStorage.setItem("civicfix.rent", JSON.stringify(rent)), [rent])
  useEffect(() => localStorage.setItem("civicfix.tenants", JSON.stringify(tenants)), [tenants])
  useEffect(() => localStorage.setItem("civicfix.qrs", JSON.stringify(qrs)), [qrs])
  useEffect(() => localStorage.setItem("civicfix.maintenance", JSON.stringify(maintenance)), [maintenance])

  const due = rent.filter(r => r.paid < r.rent)
  const totalOutstanding = due.reduce((sum, r) => sum + r.rent - r.paid, 0)

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2800)
  }

  function parseMpesa() {
    const text = mpesaText.trim()
    if (!text) return
    const amountMatch = text.match(/(?:Ksh|KES|Ksh\.|Amount)\s*[:.]?\s*([\d,]+(?:\.\d+)?)/i) || text.match(/\b([\d,]+)\.\d{2}\b/)
    const amount = amountMatch ? Number(amountMatch[1].replaceAll(",", "")) : 0
    const receipt = text.match(/\b[A-Z0-9]{8,12}\b/i)?.[0] ?? `MANUAL-${Date.now().toString().slice(-6)}`
    const name = text.match(/from\s+([A-Za-z][A-Za-z .'-]{2,40})/i)?.[1]?.trim()
    const target = rent.find(r => r.unit === selectedUnit)
    if (!target || !amount) {
      notify("Could not confidently read an amount. Paste the full M-Pesa message and choose the unit.")
      return
    }
    setRent(current => current.map(r => r.unit === selectedUnit ? { ...r, paid: Math.min(r.rent, r.paid + amount), lastPayment: receipt, status: Math.min(r.rent, r.paid + amount) >= r.rent ? "Paid" : "Partial" } : r))
    if (name && !tenants.some(t => t.unit === selectedUnit && t.tenant.toLowerCase() === name.toLowerCase())) {
      notify(`${money(amount)} recorded for ${selectedUnit} · receipt ${receipt}.`)
    } else {
      notify(`${money(amount)} recorded for ${target.tenant} · ${receipt}.`)
    }
    setMpesaText("")
  }

  function addQr() {
    if (!newQr.unit.trim() || !newQr.location.trim()) return notify("Enter a unit/area and location first.")
    const id = `QR-${newQr.unit.replace(/[^A-Za-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`
    setQrs(current => [...current, { id, label: `Blue Bells · ${newQr.unit}`, property: "Blue Bells Apartments", unit: newQr.unit, location: newQr.location, active: true }])
    setNewQr({ unit: "", location: "" })
    notify("QR location registered.")
  }

  function addMaintenance() {
    if (!newIssue.issue.trim() || !newIssue.unit.trim() || !newIssue.tenant.trim()) return notify("Issue, unit and tenant are required.")
    setMaintenance(current => [{ id: `CF-${Math.floor(1000 + Math.random() * 8999)}`, issue: newIssue.issue, property: "Blue Bells Apartments", unit: newIssue.unit, tenant: newIssue.tenant, urgency: newIssue.urgency, status: "Requested", fundi: "Unassigned", evidence: [], createdAt: new Date().toLocaleString("en-GB") }, ...current])
    setNewIssue({ issue: "", unit: "", tenant: "", urgency: "Normal" })
    notify("Maintenance request created and added to manager triage.")
  }

  function advance(id: string) {
    const order: MaintenanceRecord["status"][] = ["Requested", "Assigned", "In Progress", "Completed", "Verified"]
    setMaintenance(current => current.map(m => {
      if (m.id !== id) return m
      const next = order[Math.min(order.indexOf(m.status) + 1, order.length - 1)]
      return { ...m, status: next, fundi: next === "Assigned" && m.fundi === "Unassigned" ? "John · Plumber" : m.fundi, evidence: next === "Completed" && !m.evidence.length ? ["completion-photo.jpg"] : m.evidence }
    }))
    notify("Work-order lifecycle advanced.")
  }

  const whatsapp = (phone: string, message: string) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed right-5 bottom-5 z-[80] rounded-full bg-[#12355B] text-white px-4 py-3 shadow-xl hover:bg-[#1a4a7a] flex items-center gap-2 text-xs font-bold border border-white/20">
        <span className="h-2 w-2 rounded-full bg-emerald-400" /> CivicFix Ops
      </button>

      {notice && <div className="fixed right-5 bottom-20 z-[90] rounded-lg bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl">{notice}</div>}

      {open && (
        <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm flex items-stretch justify-end" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="h-full w-full max-w-5xl bg-slate-50 shadow-2xl flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#12355B]">CivicFix Operations Layer</p>
                <h2 className="text-lg font-bold text-slate-900">Complete the building workflow without replacing the existing dashboard</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Close</button>
            </header>

            <nav className="bg-white border-b border-slate-200 px-6 flex gap-1 overflow-x-auto">
              {([['rent', 'Rent & Collections'], ['tenants', 'Tenant History'], ['qr', 'QR Registry'], ['maintenance', 'Maintenance Loop'], ['exports', 'Exports']] as [Tab, string][]).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`px-4 py-3 text-xs font-bold border-b-2 ${tab === id ? "border-[#12355B] text-[#12355B]" : "border-transparent text-slate-400 hover:text-slate-700"}`}>{label}</button>
              ))}
            </nav>

            <main className="flex-1 overflow-y-auto p-6">
              {tab === "rent" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white border border-slate-200 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Due units</p><p className="text-2xl font-black text-slate-900 mt-1">{due.length}</p></div>
                    <div className="rounded-xl bg-white border border-slate-200 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Outstanding</p><p className="text-2xl font-black text-amber-600 mt-1">{money(totalOutstanding)}</p></div>
                    <div className="rounded-xl bg-white border border-slate-200 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Collected</p><p className="text-2xl font-black text-emerald-600 mt-1">{money(rent.reduce((s, r) => s + r.paid, 0))}</p></div>
                  </div>

                  <section className="rounded-xl bg-white border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-900">Rent due by unit</h3><p className="text-[11px] text-slate-400">Tenant-linked ledger · August 2026</p></div><button onClick={() => downloadCsv("civicfix-rent-ledger.csv", rent.map(r => ({ unit: r.unit, tenant: r.tenant, rent: r.rent, paid: r.paid, outstanding: r.rent - r.paid, dueDate: r.dueDate, status: r.status, receipt: r.lastPayment ?? "" })))} className="text-xs font-bold text-[#12355B]">Export CSV</button></div>
                    <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Unit</th><th>Tenant</th><th>Rent</th><th>Paid</th><th>Outstanding</th><th>Status</th><th className="pr-5">Action</th></tr></thead><tbody>{rent.map(r => <tr key={r.unit} className="border-t border-slate-100 text-xs"><td className="px-5 py-3 font-bold text-slate-900">{r.unit}</td><td className="py-3"><div className="font-semibold text-slate-700">{r.tenant}</div><div className="text-[10px] text-slate-400">{r.phone}</div></td><td className="py-3">{money(r.rent)}</td><td className="py-3">{money(r.paid)}</td><td className="py-3 font-bold">{money(Math.max(0, r.rent - r.paid))}</td><td className="py-3"><StatusPill status={r.status} /></td><td className="py-3 pr-5"><a target="_blank" rel="noreferrer" href={whatsapp(r.phone, `Hello ${r.tenant}, CivicFix rent update for ${r.unit}: ${money(Math.max(0, r.rent - r.paid))} remains outstanding for August 2026.`)} className="text-[10px] font-bold text-emerald-700 hover:underline">WhatsApp tenant</a></td></tr>)}</tbody></table></div>
                  </section>

                  <section className="rounded-xl bg-white border border-slate-200 p-5"><div className="flex items-center justify-between mb-3"><div><h3 className="text-sm font-bold text-slate-900">Update rent from an M-Pesa message</h3><p className="text-[11px] text-slate-400">Paste the tenant's transaction message; CivicFix records the receipt and amount against the selected unit.</p></div><StatusPill status="No custody" /></div><div className="grid md:grid-cols-[180px_1fr_auto] gap-3 items-start"><select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs bg-white">{rent.map(r => <option key={r.unit}>{r.unit}</option>)}</select><textarea value={mpesaText} onChange={e => setMpesaText(e.target.value)} rows={3} placeholder="Paste M-Pesa confirmation, e.g. Amount Ksh 35,000 ..." className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-[#12355B]/15"/><button onClick={parseMpesa} className="rounded-lg bg-[#12355B] text-white px-4 py-2.5 text-xs font-bold">Record payment</button></div></section>
                </div>
              )}

              {tab === "tenants" && (
                <div className="space-y-5">
                  <div className="rounded-xl bg-[#12355B] text-white p-5"><p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Permanent occupancy record</p><h3 className="text-xl font-black mt-1">Who lived here — even 10 years later</h3><p className="text-xs text-white/70 mt-2 max-w-2xl">Tenant history is attached to the unit/property record, not deleted when a lease ends. Access remains role-controlled and exportable for authorized operations and handover.</p></div>
                  <section className="rounded-xl bg-white border border-slate-200 overflow-hidden"><div className="px-5 py-4 border-b border-slate-100 flex justify-between"><div><h3 className="text-sm font-bold">Tenant history</h3><p className="text-[11px] text-slate-400">Current and former occupants</p></div><button onClick={() => downloadCsv("civicfix-tenant-history.csv", tenants.map(t => ({ tenant: t.tenant, unit: t.unit, property: t.property, phone: t.phone, moveIn: t.moveIn, moveOut: t.moveOut ?? "Current", status: t.status })))} className="text-xs font-bold text-[#12355B]">Export CSV</button></div><div className="divide-y divide-slate-100">{tenants.map(t => <div key={t.id} className="px-5 py-4 flex items-center justify-between gap-4"><div><div className="flex items-center gap-2"><p className="text-xs font-bold text-slate-900">{t.tenant}</p><StatusPill status={t.status} /></div><p className="text-[10px] text-slate-400 mt-1">{t.property} · Unit {t.unit} · {t.moveIn} → {t.moveOut ?? "present"}</p></div><a target="_blank" rel="noreferrer" href={whatsapp(t.phone, `Hello ${t.tenant}, CivicFix property records are available for your unit ${t.unit}.`)} className="text-[10px] font-bold text-emerald-700">Contact via WhatsApp</a></div>)}</div></section>
                  <button onClick={() => setTenants(current => [...current, { id: `t-${Date.now()}`, tenant: "New tenant", unit: "A-101", property: "Blue Bells Apartments", moveIn: new Date().toISOString().slice(0, 10), moveOut: null, phone: "", status: "Current" }])} className="rounded-lg bg-[#12355B] text-white px-4 py-2.5 text-xs font-bold">+ Add current tenant record</button>
                </div>
              )}

              {tab === "qr" && (
                <div className="space-y-5"><div className="flex items-end justify-between"><div><h3 className="text-lg font-bold text-slate-900">QR registry</h3><p className="text-xs text-slate-400">Every physical code maps to a property, unit and location context.</p></div></div><section className="rounded-xl bg-white border border-slate-200 p-5"><div className="grid md:grid-cols-[1fr_1fr_auto] gap-3"><input value={newQr.unit} onChange={e => setNewQr({ ...newQr, unit: e.target.value })} placeholder="Unit / area, e.g. B-204" className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"/><input value={newQr.location} onChange={e => setNewQr({ ...newQr, location: e.target.value })} placeholder="Location, e.g. Kitchen" className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"/><button onClick={addQr} className="rounded-lg bg-[#12355B] text-white px-4 py-2.5 text-xs font-bold">Register QR</button></div></section><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{qrs.map(q => <section key={q.id} className="rounded-xl bg-white border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><MiniQr value={q.id} /><StatusPill status={q.active ? "Active" : "Inactive"} /></div><h4 className="text-xs font-bold text-slate-900 mt-3">{q.label}</h4><p className="text-[10px] text-slate-400 mt-1">{q.location} · {q.id}</p><div className="flex gap-2 mt-3"><button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/report?qr=${encodeURIComponent(q.id)}`).then(() => notify("QR report link copied."))} className="flex-1 rounded-lg border border-slate-200 py-2 text-[10px] font-bold text-slate-600">Copy report link</button><button onClick={() => window.print()} className="rounded-lg bg-slate-100 px-3 text-[10px] font-bold text-slate-600">Print</button></div></section>)}</div></div>
              )}

              {tab === "maintenance" && (
                <div className="space-y-5"><section className="rounded-xl bg-white border border-slate-200 p-5"><div className="mb-4"><h3 className="text-sm font-bold">Maintenance request intake</h3><p className="text-[11px] text-slate-400">The same structured record can originate from QR, WhatsApp or the manager dashboard.</p></div><div className="grid md:grid-cols-2 gap-3"><input value={newIssue.issue} onChange={e => setNewIssue({ ...newIssue, issue: e.target.value })} placeholder="Issue description" className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"/><input value={newIssue.tenant} onChange={e => setNewIssue({ ...newIssue, tenant: e.target.value })} placeholder="Tenant / reporter" className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"/><input value={newIssue.unit} onChange={e => setNewIssue({ ...newIssue, unit: e.target.value })} placeholder="Unit / location" className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"/><select value={newIssue.urgency} onChange={e => setNewIssue({ ...newIssue, urgency: e.target.value as MaintenanceRecord["urgency"] })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-xs"><option>Emergency</option><option>High</option><option>Normal</option><option>Low</option></select></div><button onClick={addMaintenance} className="mt-3 rounded-lg bg-[#12355B] text-white px-4 py-2.5 text-xs font-bold">Create request</button></section><section className="rounded-xl bg-white border border-slate-200 overflow-hidden"><div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-bold">SCAN → REPORT → ASSIGN → FIX → PROVE → VERIFY</h3><p className="text-[11px] text-slate-400">Lifecycle is preserved as an auditable operational record.</p></div><div className="divide-y divide-slate-100">{maintenance.map(m => <div key={m.id} className="px-5 py-4"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><p className="text-xs font-bold text-slate-900">{m.issue}</p><StatusPill status={m.urgency} /><StatusPill status={m.status} /></div><p className="text-[10px] text-slate-400 mt-1">{m.id} · {m.property} · {m.unit} · Reported by {m.tenant} · {m.createdAt}</p><p className="text-[10px] text-slate-500 mt-1">Worker: {m.fundi} · Evidence: {m.evidence.length ? m.evidence.join(", ") : "none yet"}</p></div><button onClick={() => advance(m.id)} disabled={m.status === "Verified"} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600 disabled:opacity-40">Advance lifecycle</button></div></div>)}</div></section></div>
              )}

              {tab === "exports" && (
                <div className="grid md:grid-cols-2 gap-4"><section className="rounded-xl bg-white border border-slate-200 p-5"><h3 className="text-sm font-bold">Property records export</h3><p className="text-xs text-slate-400 mt-1">Download structured records for authorized owners, managers, handovers or diligence.</p><div className="space-y-2 mt-4"><button onClick={() => downloadCsv("civicfix-property-passport.csv", maintenance.map(m => ({ id: m.id, property: m.property, unit: m.unit, issue: m.issue, tenant: m.tenant, urgency: m.urgency, status: m.status, fundi: m.fundi, createdAt: m.createdAt, evidence: m.evidence.join(" | ") })))} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-xs font-bold hover:bg-slate-50">Maintenance / Passport CSV</button><button onClick={() => downloadCsv("civicfix-tenant-history.csv", tenants.map(t => ({ tenant: t.tenant, unit: t.unit, property: t.property, phone: t.phone, moveIn: t.moveIn, moveOut: t.moveOut ?? "Current", status: t.status })))} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-xs font-bold hover:bg-slate-50">Tenant occupancy CSV</button><button onClick={() => downloadCsv("civicfix-rent-ledger.csv", rent.map(r => ({ unit: r.unit, tenant: r.tenant, rent: r.rent, paid: r.paid, outstanding: r.rent - r.paid, status: r.status, receipt: r.lastPayment ?? "" })))} className="w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-xs font-bold hover:bg-slate-50">Rent ledger CSV</button></div></section><section className="rounded-xl bg-[#12355B] text-white p-5"><p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Network-ready architecture</p><h3 className="text-lg font-black mt-1">WhatsApp is the interface. CivicFix is the record.</h3><ul className="mt-4 space-y-2 text-xs text-white/75"><li>• Tenant reports can be routed from a QR context into WhatsApp.</li><li>• Managers retain operational control and assignment decisions.</li><li>• Fundis can be notified by WhatsApp today; SMS remains a later channel.</li><li>• Rent messages can be normalized into a unit-linked ledger without storing money.</li><li>• Tenant occupancy history and maintenance history survive handovers.</li></ul></section></div>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  )
}
