import React, { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | 'overview'
  | 'properties'
  | 'units'
  | 'tenants'
  | 'maintenance'
  | 'workorders'
  | 'fundis'
  | 'assets'
  | 'passport'
  | 'reports'
  | 'settings'

type RequestStatus = 'Requested' | 'Reviewed' | 'Assigned' | 'Accepted' | 'In Progress' | 'Completed' | 'Verified' | 'Closed'
type Urgency = 'Emergency' | 'High' | 'Normal' | 'Low'

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const s = size
  const icons: Record<string, JSX.Element> = {
    grid: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    building: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="1"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>,
    home: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    wrench: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    clipboard: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
    hammer: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.75l-2.29-2.29a3 3 0 0 1 0-4.24l2.09 2.09 1.65 1.65"/><line x1="15" y1="12" x2="20" y2="17"/></svg>,
    cpu: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
    shield: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    'file-text': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    'dollar-sign': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    'bar-chart': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    check: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    'check-circle': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    alert: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    'alert-triangle': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    clock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    'map-pin': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    image: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    camera: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    phone: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l.61-.61a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    'star-outline': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trending: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    'chevron-right': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    chevron: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    'arrow-right': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    search: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    filter: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    plus: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    qr: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16" y="16" width="3" height="3" fill="currentColor" stroke="none"/><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/></svg>,
    download: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    upload: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    'x': <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    invoice: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
    whatsapp: <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
    swap: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  }
  return <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>{icons[name] ?? null}</span>
}

// ─── Shared components ────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const cfg: Record<Urgency, { bg: string; text: string; border: string }> = {
    Emergency: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
    High:      { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
    Normal:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
    Low:       { bg: 'bg-slate-50',  text: 'text-slate-500',  border: 'border-slate-200' },
  }
  const c = cfg[urgency]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
      {urgency}
    </span>
  )
}

function StatusBadge({ status }: { status: RequestStatus | string }) {
  const cfg: Record<string, { dot: string; text: string; bg: string }> = {
    Requested:   { dot: 'bg-slate-400',   text: 'text-slate-600',   bg: 'bg-slate-50' },
    Reviewed:    { dot: 'bg-blue-400',    text: 'text-blue-700',    bg: 'bg-blue-50' },
    Assigned:    { dot: 'bg-violet-500',  text: 'text-violet-700',  bg: 'bg-violet-50' },
    Accepted:    { dot: 'bg-indigo-500',  text: 'text-indigo-700',  bg: 'bg-indigo-50' },
    'In Progress': { dot: 'bg-amber-500', text: 'text-amber-700',   bg: 'bg-amber-50' },
    Completed:   { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Verified:    { dot: 'bg-emerald-600', text: 'text-emerald-800', bg: 'bg-emerald-100' },
    Closed:      { dot: 'bg-slate-400',   text: 'text-slate-500',   bg: 'bg-slate-100' },
    Occupied:    { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Vacant:      { dot: 'bg-slate-400',   text: 'text-slate-500',   bg: 'bg-slate-50' },
    Active:      { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Inactive:    { dot: 'bg-slate-400',   text: 'text-slate-500',   bg: 'bg-slate-50' },
    Passed:      { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  }
  const c = cfg[status] ?? { dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-50' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Icon name="check" size={10} /> Verified
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200">
      Unverified
    </span>
  )
}

function KPICard({
  label, value, sub, delta, color = 'default',
}: {
  label: string; value: string | number; sub?: string; delta?: string; color?: 'default' | 'red' | 'amber' | 'green'
}) {
  const textColor = color === 'red' ? 'text-red-600' : color === 'amber' ? 'text-amber-600' : color === 'green' ? 'text-emerald-600' : 'text-slate-900'
  return (
    <Card className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      {delta && <p className="text-xs text-emerald-600 font-semibold mt-1">{delta}</p>}
    </Card>
  )
}

// ─── Tiny SVG charts (no external deps, no ResizeObserver) ───────────────────

function MiniBarChart({ data, width = 210, height = 90 }: {
  data: { q: string; v: number }[]; width?: number; height?: number
}) {
  const padL = 28, padB = 18, padT = 4, padR = 4
  const chartW = width - padL - padR
  const chartH = height - padT - padB
  const max = Math.max(...data.map(d => d.v))
  const barW = Math.floor(chartW / data.length * 0.55)
  const gap  = chartW / data.length

  const yTicks = [0, Math.round(max / 2), max]

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {/* Y gridlines + labels */}
      {yTicks.map(t => {
        const y = padT + chartH - (t / max) * chartH
        return (
          <g key={t}>
            <line x1={padL} x2={padL + chartW} y1={y} y2={y} stroke="#F1F5F9" strokeWidth={1} />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize={8} fill="#94A3B8">{t}</text>
          </g>
        )
      })}
      {/* Bars + X labels */}
      {data.map((d, i) => {
        const barH = (d.v / max) * chartH
        const x = padL + i * gap + (gap - barW) / 2
        const y = padT + chartH - barH
        return (
          <g key={d.q}>
            <rect x={x} y={y} width={barW} height={barH} fill="#12355B" rx={2} />
            <text x={x + barW / 2} y={padT + chartH + 12} textAnchor="middle" fontSize={8} fill="#94A3B8">{d.q}</text>
          </g>
        )
      })}
    </svg>
  )
}

function MiniAreaChart({ data, width = 220, height = 60 }: {
  data: { month: string; score: number }[]; width?: number; height?: number
}) {
  const min = Math.min(...data.map(d => d.score)) - 2
  const max = Math.max(...data.map(d => d.score)) + 2
  const xStep = width / (data.length - 1)

  const pts = data.map((d, i) => ({
    x: i * xStep,
    y: height - ((d.score - min) / (max - min)) * height,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${height} L0,${height} Z`

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#16A34A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MAINTENANCE_REQUESTS = [
  { id: 'CF-000501', property: 'Blue Bells Apts', unit: 'B-204', location: 'Kitchen', description: 'Leaking pipe under sink', category: 'Plumbing', urgency: 'High' as Urgency, status: 'Assigned' as RequestStatus, reporter: 'Grace Mwangi', reportedAt: '15 Aug 2026, 10:32 AM', fundi: 'John Kamau', hasPhotos: true, hasEvidence: false },
  { id: 'CF-000500', property: 'Blue Bells Apts', unit: 'A-101', location: 'Living Room', description: 'Power outlet not working', category: 'Electrical', urgency: 'Normal' as Urgency, status: 'In Progress' as RequestStatus, reporter: 'David Ochieng', reportedAt: '14 Aug 2026, 3:15 PM', fundi: 'Peter Njoroge', hasPhotos: true, hasEvidence: false },
  { id: 'CF-000499', property: 'Blue Bells Apts', unit: 'Common', location: 'Lobby', description: 'Lift doors not closing properly', category: 'Lift', urgency: 'Emergency' as Urgency, status: 'Completed' as RequestStatus, reporter: 'Caretaker', reportedAt: '14 Aug 2026, 8:00 AM', fundi: 'Otis Elevators', hasPhotos: true, hasEvidence: true },
  { id: 'CF-000498', property: 'Blue Bells Apts', unit: 'C-310', location: 'Bathroom', description: 'Shower head dripping', category: 'Plumbing', urgency: 'Low' as Urgency, status: 'Requested' as RequestStatus, reporter: 'Alice Weru', reportedAt: '13 Aug 2026, 9:45 PM', fundi: '', hasPhotos: false, hasEvidence: false },
  { id: 'CF-000497', property: 'Greenpark Estate', unit: 'D-02', location: 'Bedroom', description: 'AC not cooling adequately', category: 'HVAC', urgency: 'Normal' as Urgency, status: 'Verified' as RequestStatus, reporter: 'Michael Otieno', reportedAt: '12 Aug 2026, 2:00 PM', fundi: 'David Gitau', hasPhotos: true, hasEvidence: true },
  { id: 'CF-000496', property: 'Blue Bells Apts', unit: 'B-108', location: 'Gate', description: 'Entry gate lock broken', category: 'Security', urgency: 'High' as Urgency, status: 'Accepted' as RequestStatus, reporter: 'Tenant', reportedAt: '12 Aug 2026, 7:22 AM', fundi: 'Safeguard Security', hasPhotos: true, hasEvidence: false },
  { id: 'CF-000495', property: 'Greenpark Estate', unit: 'A-05', location: 'Kitchen', description: 'Water heater not working', category: 'Plumbing', urgency: 'High' as Urgency, status: 'Closed' as RequestStatus, reporter: 'Janet Kamau', reportedAt: '10 Aug 2026, 11:30 AM', fundi: 'John Kamau', hasPhotos: true, hasEvidence: true },
]

const FUNDIS = [
  { id: 'F-001', name: 'John Kamau', trade: 'Plumber', phone: '+254 712 345 678', jobs: 83, completed: 78, acceptance: 95, rating: 4.8, properties: ['Blue Bells Apts', 'Greenpark Estate'], status: 'Active' as const, verified: true },
  { id: 'F-002', name: 'Peter Njoroge', trade: 'Electrician', phone: '+254 723 456 789', jobs: 61, completed: 58, acceptance: 88, rating: 4.6, properties: ['Blue Bells Apts'], status: 'Active' as const, verified: true },
  { id: 'F-003', name: 'David Gitau', trade: 'HVAC Technician', phone: '+254 734 567 890', jobs: 44, completed: 40, acceptance: 91, rating: 4.5, properties: ['Greenpark Estate', 'Kilimani Heights'], status: 'Active' as const, verified: true },
  { id: 'F-004', name: 'Mary Wanjiku', trade: 'Cleaner', phone: '+254 745 678 901', jobs: 120, completed: 118, acceptance: 99, rating: 4.9, properties: ['Blue Bells Apts'], status: 'Active' as const, verified: false },
  { id: 'F-005', name: 'Samuel Oduya', trade: 'Painter', phone: '+254 756 789 012', jobs: 29, completed: 26, acceptance: 80, rating: 4.2, properties: ['Kilimani Heights'], status: 'Inactive' as const, verified: false },
]

const UNITS = [
  { id: 'B-204', building: 'Block B', floor: '2nd Floor', bedrooms: 2, status: 'Occupied' as const, tenant: 'Grace Mwangi', tenantSince: 'Jan 2025', openRequests: 1, totalRequests: 12 },
  { id: 'A-101', building: 'Block A', floor: '1st Floor', bedrooms: 1, status: 'Occupied' as const, tenant: 'David Ochieng', tenantSince: 'Mar 2023', openRequests: 1, totalRequests: 7 },
  { id: 'C-310', building: 'Block C', floor: '3rd Floor', bedrooms: 3, status: 'Occupied' as const, tenant: 'Alice Weru', tenantSince: 'Jun 2024', openRequests: 1, totalRequests: 4 },
  { id: 'B-108', building: 'Block B', floor: '1st Floor', bedrooms: 2, status: 'Occupied' as const, tenant: 'Tenant', tenantSince: 'Sep 2022', openRequests: 1, totalRequests: 9 },
  { id: 'A-305', building: 'Block A', floor: '3rd Floor', bedrooms: 2, status: 'Vacant' as const, tenant: '', tenantSince: '', openRequests: 0, totalRequests: 5 },
  { id: 'D-402', building: 'Block D', floor: '4th Floor', bedrooms: 3, status: 'Vacant' as const, tenant: '', tenantSince: '', openRequests: 0, totalRequests: 2 },
]

const PASSPORT_EVENTS = [
  { date: '15 Aug 2026', title: 'Leaking kitchen pipe reported', type: 'Maintenance', unit: 'B-204', fundi: '', verified: false, detail: 'High-urgency plumbing request raised by Grace Mwangi via WhatsApp. Photos attached.' },
  { date: '02 Aug 2026', title: 'Annual fire inspection passed', type: 'Compliance', unit: 'Common', fundi: 'FireSafe Kenya', verified: true, detail: 'NCA-certified fire safety inspection completed. Certificate valid until August 2027.' },
  { date: '15 Mar 2026', title: 'Roof replacement completed', type: 'Capital Work', unit: 'All Blocks', fundi: 'Kijani Roofing', verified: true, detail: 'Full IBR sheet replacement on Blocks A and B. 10-year contractor warranty issued.' },
  { date: '18 Jan 2026', title: 'Lift quarterly service', type: 'Service', unit: 'Common', fundi: 'Otis Elevators EA', verified: true, detail: 'Routine Q4 maintenance, cable inspection, and control panel calibration.' },
  { date: '05 Dec 2025', title: 'Electrical board upgrade', type: 'Capital Work', unit: 'All Blocks', fundi: 'Powerline Engineers', verified: true, detail: 'Distribution board replacement and RCCD installation across all three phases.' },
  { date: '22 Nov 2025', title: 'Water tank cleaning', type: 'Service', unit: 'Common', fundi: 'AquaClean Services', verified: false, detail: 'Biannual tank cleaning and bacteriological water quality test.' },
  { date: '30 Jul 2025', title: 'Emergency burst pipe repair', type: 'Emergency', unit: 'A-Ground', fundi: 'John Kamau', verified: true, detail: 'Main supply pipe burst repaired within 4 hours. KES 62,000.' },
]

const TENANT_HISTORY = [
  { tenant: 'Tenant A', moveIn: 'Jan 2010', moveOut: 'Dec 2013', duration: '3 yrs', status: 'Former' },
  { tenant: 'Tenant B', moveIn: 'Feb 2014', moveOut: 'Aug 2018', duration: '4.5 yrs', status: 'Former' },
  { tenant: 'Beatrice Ouma', moveIn: 'Sep 2018', moveOut: 'Mar 2022', duration: '3.5 yrs', status: 'Former' },
  { tenant: 'Samuel Ngugi', moveIn: 'May 2022', moveOut: 'Dec 2024', duration: '2.5 yrs', status: 'Former' },
  { tenant: 'Grace Mwangi', moveIn: 'Jan 2025', moveOut: 'Present', duration: '8 months', status: 'Current' },
]

const TRUST_TREND = [
  { month: 'Aug 24', score: 61 }, { month: 'Oct 24', score: 64 }, { month: 'Dec 24', score: 66 },
  { month: 'Feb 25', score: 69 }, { month: 'Apr 25', score: 72 }, { month: 'Jun 25', score: 74 },
  { month: 'Aug 25', score: 76 }, { month: 'Oct 25', score: 78 }, { month: 'Dec 25', score: 79 },
  { month: 'Feb 26', score: 80 }, { month: 'Apr 26', score: 81 }, { month: 'Jun 26', score: 82 },
]

const SPEND_DATA = [
  { q: 'Q3 24', v: 120 }, { q: 'Q4 24', v: 95 }, { q: 'Q1 25', v: 230 },
  { q: 'Q2 25', v: 180 }, { q: 'Q3 25', v: 810 }, { q: 'Q4 25', v: 410 },
  { q: 'Q1 26', v: 620 }, { q: 'Q2 26', v: 45 },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Portfolio',
    items: [
      { id: 'overview', label: 'Overview', icon: 'grid' },
      { id: 'properties', label: 'Properties', icon: 'building' },
      { id: 'units', label: 'Units', icon: 'home' },
      { id: 'tenants', label: 'Tenants', icon: 'users' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench', badge: 6 },
      { id: 'workorders', label: 'Work Orders', icon: 'clipboard' },
      { id: 'fundis', label: 'Fundis', icon: 'hammer' },
      { id: 'assets', label: 'Assets', icon: 'cpu' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'passport', label: 'Passport', icon: 'shield' },
      { id: 'reports', label: 'Reports', icon: 'bar-chart' },
    ],
  },
]

function Sidebar({ current, onChange }: { current: Screen; onChange: (s: Screen) => void }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#12355B] flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Icon name="building" size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">CivicFix</p>
            <p className="text-blue-300 text-[9px] mt-0.5 font-semibold tracking-widest uppercase">Property Intelligence</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="bg-white/8 rounded-lg px-3 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-white/12 transition-colors">
          <div className="w-6 h-6 rounded bg-blue-400/20 flex items-center justify-center flex-shrink-0">
            <Icon name="map-pin" size={11} className="text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold leading-none truncate">Blue Bells Apts</p>
            <p className="text-blue-300 text-[10px] mt-0.5">Syokimau · 320 units</p>
          </div>
          <Icon name="chevron" size={11} className="text-blue-400 flex-shrink-0" />
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto pb-4 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-blue-400/50">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = current === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id as Screen)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left
                      ${active ? 'bg-white/12 text-white' : 'text-blue-200 hover:bg-white/6 hover:text-white'}`}
                  >
                    <span className={active ? 'text-emerald-400' : 'text-blue-400'}>
                      <Icon name={item.icon} size={14} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {'badge' in item && item.badge ? (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {item.badge}
                      </span>
                    ) : active ? (
                      <span className="w-1 h-4 rounded-full bg-emerald-400 flex-shrink-0" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        <div>
          <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-blue-400/50">System</p>
          <button
            onClick={() => onChange('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left
              ${current === 'settings' ? 'bg-white/12 text-white' : 'text-blue-200 hover:bg-white/6 hover:text-white'}`}
          >
            <span className={current === 'settings' ? 'text-emerald-400' : 'text-blue-400'}>
              <Icon name="settings" size={14} />
            </span>
            Settings
          </button>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0">
          <Icon name="user" size={13} className="text-blue-300" />
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">James Kariuki</p>
          <p className="text-blue-400 text-[10px]">Property Manager</p>
        </div>
      </div>
    </aside>
  )
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({ screen }: { screen: Screen }) {
  const labels: Record<Screen, string> = {
    overview: 'Overview', properties: 'Properties', units: 'Units', tenants: 'Tenants',
    maintenance: 'Maintenance', workorders: 'Work Orders', fundis: 'Fundis', assets: 'Assets',
    passport: 'Passport', reports: 'Reports', settings: 'Settings',
  }
  return (
    <header className="h-12 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-6 gap-3">
      <span className="text-xs text-slate-400 font-medium">Blue Bells Apartments</span>
      <Icon name="chevron-right" size={11} className="text-slate-300" />
      <span className="text-xs text-slate-700 font-semibold">{labels[screen]}</span>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <input
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]/40"
            placeholder="Search units, tenants, requests…"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={12} />
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">Trust: 82</span>
        </div>
        <span className="text-[10px] text-slate-400">Last sync: just now</span>
      </div>
    </header>
  )
}

// ─── Screen: Overview ─────────────────────────────────────────────────────────

function OverviewScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const urgent = MAINTENANCE_REQUESTS.filter(r => r.urgency === 'Emergency' || r.urgency === 'High')
  const open   = MAINTENANCE_REQUESTS.filter(r => !['Closed', 'Verified'].includes(r.status))

  return (
    <div className="flex-1 overflow-y-auto p-7">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operations Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">Friday, 15 August 2026</p>
        </div>
        <button
          onClick={() => onNavigate('maintenance')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors"
        >
          <Icon name="plus" size={13} /> New Request
        </button>
      </div>

      {/* Urgent banner */}
      {urgent.length > 0 && (
        <div
          className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-red-100/60 transition-colors"
          onClick={() => onNavigate('maintenance')}
        >
          <Icon name="alert-triangle" size={16} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800 font-medium flex-1">
            <span className="font-bold">{urgent.length} urgent requests</span> need immediate attention — including a lift fault in the lobby
          </p>
          <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
            Review <Icon name="chevron-right" size={12} />
          </span>
        </div>
      )}

      {/* KPI rows */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard label="Properties" value="3" sub="2 active portfolios" />
        <KPICard label="Total Units" value="320" sub="Managed across all properties" />
        <KPICard label="Occupied" value="298" sub="93% occupancy" color="green" delta="↑ 2% vs last month" />
        <KPICard label="Vacant" value="22" sub="7% vacancy rate" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        <KPICard label="Open Requests" value={open.length} sub="Awaiting action" color="amber" />
        <KPICard label="Urgent" value={urgent.length} sub="Emergency + High priority" color="red" />
        <KPICard label="Completed This Month" value="34" sub="4 pending verification" color="green" />
        <KPICard label="Avg. Resolution" value="18h" sub="Normal priority" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Needs attention */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Needs Attention</h2>
            <button onClick={() => onNavigate('maintenance')} className="text-xs text-[#12355B] font-semibold flex items-center gap-1 hover:underline">
              All requests <Icon name="chevron-right" size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {MAINTENANCE_REQUESTS.filter(r => ['Requested', 'In Progress', 'Assigned'].includes(r.status)).map(req => (
              <Card key={req.id} className="px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{req.description}</span>
                    <UrgencyBadge urgency={req.urgency} />
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Icon name="home" size={11} />{req.unit}</span>
                    <span className="flex items-center gap-1"><Icon name="map-pin" size={11} />{req.location}</span>
                    <span className="flex items-center gap-1"><Icon name="clock" size={11} />{req.reportedAt}</span>
                    {req.hasPhotos && <span className="flex items-center gap-1 text-blue-500"><Icon name="camera" size={11} />Photo</span>}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {req.fundi ? (
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">{req.fundi}</p>
                      <p className="text-[10px] text-slate-400">Assigned</p>
                    </div>
                  ) : (
                    <button onClick={() => onNavigate('maintenance')} className="px-3 py-1.5 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
                      Assign
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-5">
          {/* Recurring issues */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Recurring Issues</p>
            <div className="space-y-2.5">
              {[
                { label: 'Plumbing', loc: 'Block B', count: 7, pct: 70 },
                { label: 'Electrical', loc: 'Block A', count: 4, pct: 40 },
                { label: 'Lift faults', loc: 'Lobby', count: 3, pct: 30 },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="font-medium text-slate-700">{r.label} <span className="text-slate-400">· {r.loc}</span></span>
                    <span className="font-semibold text-slate-900">{r.count}×</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#12355B]" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick fundis */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Trusted Fundis</p>
            <div className="space-y-2.5">
              {FUNDIS.slice(0, 3).map(f => (
                <div key={f.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#12355B]/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[#12355B]">
                    {f.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                    <p className="text-[10px] text-slate-400">{f.trade}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Icon name="star" size={10} />
                    <span className="text-[10px] font-semibold text-slate-700">{f.rating}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => onNavigate('fundis')} className="w-full text-xs text-[#12355B] font-semibold text-center hover:underline mt-1">
                Manage Fundis →
              </button>
            </div>
          </Card>

          {/* Spend trend */}
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Maintenance Spend</p>
            <p className="text-[10px] text-slate-400 mb-3">KES (thousands) by quarter</p>
            <MiniBarChart data={SPEND_DATA} width={210} height={90} />
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Maintenance ──────────────────────────────────────────────────────

type ReqDetail = typeof MAINTENANCE_REQUESTS[0]

const LIFECYCLE: RequestStatus[] = ['Requested', 'Reviewed', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Verified', 'Closed']

function RequestDetailPanel({ req, onClose, onNavigate }: { req: ReqDetail; onClose: () => void; onNavigate: (s: Screen) => void }) {
  const [status, setStatus] = useState<RequestStatus>(req.status)
  const stepIdx = LIFECYCLE.indexOf(status)

  const advance = () => {
    if (stepIdx < LIFECYCLE.length - 1) setStatus(LIFECYCLE[stepIdx + 1])
  }

  const nextLabel: Record<string, string> = {
    Requested: 'Mark Reviewed', Reviewed: 'Assign Fundi', Assigned: 'Mark Accepted',
    Accepted: 'Start Work', 'In Progress': 'Mark Completed', Completed: 'Verify Work', Verified: 'Close Job',
  }

  return (
    <div className="w-96 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{req.id}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{req.description}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0">
          <Icon name="x" size={13} className="text-slate-500" />
        </button>
      </div>

      <div className="p-5 flex-1 space-y-5">
        {/* Status + urgency */}
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <UrgencyBadge urgency={req.urgency} />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Property', val: req.property },
            { label: 'Unit', val: req.unit },
            { label: 'Location', val: req.location },
            { label: 'Category', val: req.category },
            { label: 'Reported by', val: req.reporter },
            { label: 'Reported at', val: req.reportedAt },
          ].map(i => (
            <div key={i.label}>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{i.label}</p>
              <p className="text-xs font-medium text-slate-800 mt-0.5">{i.val}</p>
            </div>
          ))}
        </div>

        {/* Photos placeholder */}
        {req.hasPhotos && (
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Reported Evidence</p>
            <div className="flex gap-2">
              {[1, 2].map(n => (
                <div key={n} className="w-24 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Icon name="image" size={20} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifecycle progress */}
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">Job Lifecycle</p>
          <div className="space-y-1.5">
            {LIFECYCLE.map((s, i) => (
              <div key={s} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg ${i === stepIdx ? 'bg-[#12355B]/5 border border-[#12355B]/10' : ''}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < stepIdx ? 'bg-emerald-500' : i === stepIdx ? 'bg-[#12355B]' : 'bg-slate-200'
                }`}>
                  {i < stepIdx && <Icon name="check" size={8} className="text-white" />}
                  {i === stepIdx && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={`text-xs ${i === stepIdx ? 'font-semibold text-[#12355B]' : i < stepIdx ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>{s}</span>
                {i === stepIdx && <span className="ml-auto text-[10px] text-slate-400">Current</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Fundi assignment */}
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Assigned Fundi</p>
          {req.fundi ? (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#12355B]/10 flex items-center justify-center text-xs font-bold text-[#12355B]">
                {req.fundi.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{req.fundi}</p>
                <p className="text-[10px] text-slate-400">{req.category} specialist</p>
              </div>
              <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                <Icon name="star" size={10} />
                <span className="text-[10px] font-semibold text-slate-600">4.8</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 font-medium mb-2">No fundi assigned yet</p>
              <button onClick={() => onNavigate('fundis')} className="w-full py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
                Assign Fundi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action footer */}
      {status !== 'Closed' && (
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={advance}
            className="w-full py-2.5 rounded-lg bg-[#12355B] text-white text-xs font-bold hover:bg-[#1a4a7a] transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="arrow-right" size={13} />
            {nextLabel[status] ?? 'Advance'}
          </button>
          {status === 'Completed' && (
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Completion Evidence</p>
              <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
                <Icon name="upload" size={12} /> Upload Photos / Invoice
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MAINT_FILTERS = ['All', 'Requested', 'In Progress', 'Assigned', 'Completed', 'Verified']

function MaintenanceScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ReqDetail | null>(null)

  const filtered = MAINTENANCE_REQUESTS.filter(r => {
    const matchF = filter === 'All' || r.status === filter
    const matchS = !search || r.description.toLowerCase().includes(search.toLowerCase()) || r.unit.includes(search)
    return matchF && matchS
  })

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Maintenance Requests</h1>
            <p className="text-sm text-slate-400 mt-0.5">{MAINTENANCE_REQUESTS.length} total · {MAINTENANCE_REQUESTS.filter(r => !['Closed','Verified'].includes(r.status)).length} open</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
            <Icon name="plus" size={13} /> Log Request
          </button>
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={13} />
            </span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search requests, units…"
              className="w-full pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#12355B]/20"
            />
          </div>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {MAINT_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-[#12355B] text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Request', 'Unit / Location', 'Category', 'Urgency', 'Fundi', 'Status', 'Reported', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr
                  key={req.id}
                  className={`border-b border-slate-100 hover:bg-slate-50/70 cursor-pointer transition-colors ${selected?.id === req.id ? 'bg-blue-50/40' : ''}`}
                  onClick={() => setSelected(selected?.id === req.id ? null : req)}
                >
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-slate-900">{req.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{req.id}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-medium text-slate-700">{req.unit}</p>
                    <p className="text-[10px] text-slate-400">{req.location}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-600">{req.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <UrgencyBadge urgency={req.urgency} />
                  </td>
                  <td className="px-4 py-3.5">
                    {req.fundi ? (
                      <span className="text-xs text-slate-700 font-medium">{req.fundi}</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                    {req.reportedAt.split(',')[0]}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5 items-center">
                      {req.hasPhotos && <Icon name="image" size={13} className="text-slate-400" />}
                      {req.hasEvidence && <Icon name="check-circle" size={13} className="text-emerald-500" />}
                      <Icon name="chevron-right" size={13} className="text-slate-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">Showing {filtered.length} of {MAINTENANCE_REQUESTS.length} requests</p>
          </div>
        </Card>

        {/* WhatsApp intake note */}
        <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <Icon name="whatsapp" size={16} className="text-emerald-600 flex-shrink-0" />
          <p className="text-xs text-emerald-800">
            <span className="font-semibold">WhatsApp intake active.</span> Tenants scan QR → report via WhatsApp → requests appear here automatically.
          </p>
          <button className="ml-auto text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 whitespace-nowrap">
            QR Codes <Icon name="qr" size={12} />
          </button>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <RequestDetailPanel req={selected} onClose={() => setSelected(null)} onNavigate={onNavigate} />
      )}
    </div>
  )
}

// ─── Screen: Fundis ───────────────────────────────────────────────────────────

function FundisScreen() {
  const [selected, setSelected] = useState<typeof FUNDIS[0] | null>(FUNDIS[0])

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List */}
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Fundis & Contractors</h1>
            <p className="text-sm text-slate-400 mt-0.5">{FUNDIS.length} registered · {FUNDIS.filter(f => f.status === 'Active').length} active</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
            <Icon name="plus" size={13} /> Invite Fundi
          </button>
        </div>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Fundi', 'Trade', 'Properties', 'Jobs', 'Completion', 'Rating', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FUNDIS.map(f => (
                <tr
                  key={f.id}
                  className={`border-b border-slate-100 hover:bg-slate-50/70 cursor-pointer transition-colors ${selected?.id === f.id ? 'bg-blue-50/30' : ''}`}
                  onClick={() => setSelected(f)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#12355B]/10 flex items-center justify-center text-xs font-bold text-[#12355B] flex-shrink-0">
                        {f.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{f.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Icon name="phone" size={10} />{f.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{f.trade}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {f.properties.map(p => (
                        <span key={p} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.split(' ')[0]}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">{f.jobs}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.round(f.completed / f.jobs * 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{Math.round(f.completed / f.jobs * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(n => (
                        <Icon key={n} name={n <= Math.round(f.rating) ? 'star' : 'star-outline'} size={11} className={n <= Math.round(f.rating) ? 'text-amber-400' : 'text-slate-200'} />
                      ))}
                      <span className="text-xs font-semibold text-slate-700 ml-1">{f.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={f.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <VerifiedBadge verified={f.verified} />
                      <Icon name="chevron-right" size={13} className="text-slate-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Passport concept note */}
        <div className="mt-4 px-4 py-3 rounded-xl bg-[#12355B]/5 border border-[#12355B]/15 flex items-center gap-3">
          <Icon name="shield" size={15} className="text-[#12355B]" />
          <p className="text-xs text-slate-700">
            <span className="font-semibold text-[#12355B]">Fundi Passport.</span> Each fundi builds a verified performance history through CivicFix — the foundation for a future trusted contractor network.
          </p>
        </div>
      </div>

      {/* Fundi detail */}
      {selected && (
        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-[#12355B] flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
              {selected.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p className="font-bold text-slate-900">{selected.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{selected.trade}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(n => (
                <Icon key={n} name={n <= Math.round(selected.rating) ? 'star' : 'star-outline'} size={13} className={n <= Math.round(selected.rating) ? 'text-amber-400' : 'text-slate-200'} />
              ))}
              <span className="text-sm font-bold text-slate-800 ml-1">{selected.rating}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">CivicFix Passport</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Jobs', val: selected.jobs },
                { label: 'Completed', val: selected.completed },
                { label: 'Acceptance Rate', val: `${selected.acceptance}%` },
                { label: 'Completion Rate', val: `${Math.round(selected.completed / selected.jobs * 100)}%` },
              ].map(s => (
                <Card key={s.label} className="p-3 text-center">
                  <p className="text-base font-bold text-slate-900">{s.val}</p>
                  <p className="text-[10px] text-slate-400">{s.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Properties Served</p>
            <div className="space-y-1.5">
              {selected.properties.map(p => (
                <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-xs text-slate-700 font-medium">
                  <Icon name="building" size={12} className="text-slate-400" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Verification</p>
            <div className="space-y-2">
              {[
                { label: 'Identity verified', done: selected.verified },
                { label: 'Trade license', done: selected.verified },
                { label: 'Insurance', done: false },
              ].map(v => (
                <div key={v.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${v.done ? 'bg-emerald-500' : 'border-2 border-slate-200 bg-white'}`}>
                    {v.done && <Icon name="check" size={8} className="text-white" />}
                  </div>
                  <span className={`text-xs ${v.done ? 'text-slate-700' : 'text-slate-400'}`}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 rounded-lg bg-[#12355B] text-white text-xs font-bold hover:bg-[#1a4a7a] transition-colors flex items-center justify-center gap-2">
            <Icon name="plus" size={13} /> Assign to Request
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Screen: Units ────────────────────────────────────────────────────────────

function UnitsScreen() {
  const [selected, setSelected] = useState<typeof UNITS[0] | null>(UNITS[0])
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Units</h1>
            <p className="text-sm text-slate-400 mt-0.5">320 units · {UNITS.filter(u => u.status === 'Occupied').length} of {UNITS.length} shown occupied</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5">
              <Icon name="filter" size={12} /> Filter
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5">
              <Icon name="download" size={12} /> Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {UNITS.map(unit => (
            <Card
              key={unit.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${selected?.id === unit.id ? 'border-[#12355B]/30 bg-blue-50/20' : ''}`}
              onClick={() => setSelected(unit)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{unit.id}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{unit.building} · {unit.floor}</p>
                </div>
                <StatusBadge status={unit.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{unit.bedrooms} BR</span>
                {unit.status === 'Occupied' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="truncate">{unit.tenant}</span>
                  </>
                )}
              </div>
              {unit.openRequests > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold">
                  <Icon name="alert" size={10} className="text-amber-500" />
                  {unit.openRequests} open request
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Unit detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">Unit {selected.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selected.building} · {selected.floor} · {selected.bedrooms} Bedroom</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
          </div>

          {/* Current tenant */}
          {selected.status === 'Occupied' && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Current Tenant</p>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                  {selected.tenant.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{selected.tenant}</p>
                  <p className="text-[10px] text-slate-500">Since {selected.tenantSince}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <Card className="p-3 text-center">
              <p className="text-base font-bold text-slate-900">{selected.totalRequests}</p>
              <p className="text-[10px] text-slate-400">Total Requests</p>
            </Card>
            <Card className="p-3 text-center">
              <p className={`text-base font-bold ${selected.openRequests > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{selected.openRequests}</p>
              <p className="text-[10px] text-slate-400">Open</p>
            </Card>
          </div>

          {/* Occupancy history */}
          <div>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span>Occupancy History</span>
              <Icon name={historyOpen ? 'chevron' : 'chevron-right'} size={12} />
            </button>
            {historyOpen && (
              <div className="mt-3 space-y-0">
                {TENANT_HISTORY.map((t, i) => (
                  <div key={i} className={`px-3 py-2.5 border-b border-slate-100 last:border-0 ${t.status === 'Current' ? 'bg-emerald-50/50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${t.status === 'Current' ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {t.tenant}
                      </p>
                      {t.status === 'Current' && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">Current</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.moveIn} → {t.moveOut} · {t.duration}</p>
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 pt-2 text-center">
                  Authorized users only · Data governed by privacy policy
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full py-2.5 rounded-lg bg-[#12355B] text-white text-xs font-bold hover:bg-[#1a4a7a] transition-colors flex items-center justify-center gap-2">
              <Icon name="file-text" size={13} /> View Passport
            </button>
            <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
              <Icon name="download" size={12} /> Export Unit History
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Screen: Passport ─────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  'Maintenance': 'bg-blue-500',
  'Compliance':  'bg-emerald-500',
  'Capital Work':'bg-[#12355B]',
  'Service':     'bg-purple-500',
  'Emergency':   'bg-red-500',
}

function PassportScreen() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main timeline */}
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#12355B] text-white uppercase tracking-wider">Property Passport</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Blue Bells Apartments</h1>
            <p className="text-sm text-slate-400 mt-0.5">Syokimau · Built 2008 · 16 years of recorded history</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50">
              <Icon name="download" size={12} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
              <Icon name="file-text" size={13} /> Due Diligence Report
            </button>
          </div>
        </div>

        {/* Trust score strip */}
        <Card className="p-4 mb-6 flex items-center gap-6">
          <div className="text-center px-4 border-r border-slate-100">
            <p className="text-3xl font-bold text-emerald-600">82</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Trust Score</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Top 18% Syokimau</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { l: 'Total Events', v: '148' },
                { l: 'Verified', v: '114' },
                { l: 'Capital Works (5yr)', v: 'KES 3.2M' },
                { l: 'Compliance', v: '93%' },
                { l: 'Last Activity', v: '15 Aug 2026' },
              ].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-sm font-bold text-slate-900">{s.v}</p>
                  <p className="text-[10px] text-slate-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: 220 }}>
            <MiniAreaChart data={TRUST_TREND} width={220} height={60} />
            <p className="text-[9px] text-slate-400 text-center -mt-1">24-month trend</p>
          </div>
        </Card>

        {/* Events timeline */}
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Maintenance & Compliance Timeline</h2>
        <div className="relative pl-6">
          <span className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />
          {PASSPORT_EVENTS.map((ev, i) => (
            <div key={i} className="relative mb-4">
              <span className={`absolute -left-6 top-4 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${TYPE_COLOR[ev.type] ?? 'bg-slate-400'}`} style={{ width: 16, height: 16 }} />
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900">{ev.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white ${TYPE_COLOR[ev.type] ?? 'bg-slate-400'}`}>{ev.type}</span>
                      <VerifiedBadge verified={ev.verified} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{ev.date}</span>
                      {ev.unit !== 'All Blocks' && <span>· {ev.unit}</span>}
                      {ev.fundi && <span>· {ev.fundi}</span>}
                    </div>
                  </div>
                  <span className={`text-slate-400 transition-transform duration-150 flex-shrink-0 ${expanded === i ? 'rotate-180' : ''}`}>
                    <Icon name="chevron" size={14} />
                  </span>
                </div>
                {expanded === i && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{ev.detail}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium">View Documents</button>
                      {ev.verified && <button className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium border border-emerald-200">Verification Record</button>}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Right info panel */}
      <aside className="w-64 flex-shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Score Breakdown</p>
          <div className="space-y-2.5">
            {[
              { label: 'Verified Repairs', score: 78, color: '#16A34A' },
              { label: 'Permit-backed', score: 65, color: '#12355B' },
              { label: 'Compliance Docs', score: 90, color: '#7C3AED' },
              { label: 'Photos Available', score: 72, color: '#EA580C' },
              { label: 'Invoices Available', score: 68, color: '#0891B2' },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600">{b.label}</span>
                  <span className="text-xs font-bold text-slate-900">{b.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${b.score}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Recommendations</p>
          <div className="space-y-2.5">
            {[
              { text: 'Schedule lift annual inspection', icon: 'wrench' },
              { text: 'Upload fire certificate 2026', icon: 'shield' },
              { text: 'Add contractor licenses', icon: 'users' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <Icon name={r.icon} size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <button className="w-full py-2.5 rounded-lg bg-[#12355B] text-white text-xs font-bold hover:bg-[#1a4a7a] transition-colors flex items-center justify-center gap-2">
            <Icon name="file-text" size={13} /> Generate Report
          </button>
          <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
            <Icon name="swap" size={12} /> Building Handover
          </button>
        </div>
      </aside>
    </div>
  )
}

// ─── Screen: Properties ───────────────────────────────────────────────────────

const PROPERTIES = [
  { name: 'Blue Bells Apartments', location: 'Syokimau, Nairobi', units: 320, occupied: 298, openRequests: 6, trustScore: 82, yearBuilt: 2008 },
  { name: 'Greenpark Estate', location: 'Kilimani, Nairobi', units: 48, occupied: 45, openRequests: 2, trustScore: 74, yearBuilt: 2014 },
  { name: 'Kilimani Heights', location: 'Kilimani, Nairobi', units: 24, occupied: 21, openRequests: 1, trustScore: 68, yearBuilt: 2017 },
]

function PropertiesScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Properties</h1>
          <p className="text-sm text-slate-400 mt-0.5">{PROPERTIES.length} properties · {PROPERTIES.reduce((a,p) => a+p.units, 0)} total units</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12355B] text-white text-xs font-semibold hover:bg-[#1a4a7a] transition-colors">
          <Icon name="plus" size={13} /> Add Property
        </button>
      </div>

      <div className="space-y-4">
        {PROPERTIES.map(p => (
          <Card key={p.name} className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('overview')}>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#12355B]/8 flex items-center justify-center flex-shrink-0">
                <Icon name="building" size={22} className="text-[#12355B]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Icon name="map-pin" size={11} />{p.location} · Built {p.yearBuilt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-emerald-700">Trust: {p.trustScore}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{p.units}</p>
                    <p className="text-[10px] text-slate-400">Total Units</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-600">{p.occupied}</p>
                    <p className="text-[10px] text-slate-400">Occupied</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{Math.round(p.occupied/p.units*100)}%</p>
                    <p className="text-[10px] text-slate-400">Occupancy</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${p.openRequests > 3 ? 'text-amber-600' : 'text-slate-900'}`}>{p.openRequests}</p>
                    <p className="text-[10px] text-slate-400">Open Requests</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] text-slate-400">Occupancy</span>
                      <span className="text-[10px] font-semibold text-slate-700">{Math.round(p.occupied/p.units*100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.round(p.occupied/p.units*100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <Icon name="chevron-right" size={16} className="text-slate-300 flex-shrink-0 mt-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Screen: Placeholder (Tenants, Work Orders, Assets, Reports, Settings) ────

function PlaceholderScreen({ screen }: { screen: Screen }) {
  const info: Record<string, { icon: string; title: string; desc: string }> = {
    tenants: { icon: 'users', title: 'Tenants', desc: 'Manage tenant profiles, move-in/move-out records, and occupancy history with privacy controls.' },
    workorders: { icon: 'clipboard', title: 'Work Orders', desc: 'Create, assign, and track formal work orders tied to maintenance requests and fundis.' },
    assets: { icon: 'cpu', title: 'Assets', desc: 'Register and track building assets — lifts, generators, water tanks, HVAC, electrical panels — with full maintenance history.' },
    reports: { icon: 'bar-chart', title: 'Reports & Analytics', desc: 'Maintenance KPIs, recurring issue analysis, fundi performance, cost reports, and exportable property history.' },
    settings: { icon: 'settings', title: 'Settings', desc: 'Configure properties, user roles, QR codes, notification channels, and SLA thresholds.' },
  }
  const { icon, title, desc } = info[screen] ?? { icon: 'grid', title: screen, desc: '' }
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#12355B]/8 flex items-center justify-center mx-auto mb-4">
          <Icon name={icon} size={26} className="text-[#12355B]/60" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium">
          <Icon name="clock" size={12} /> Module in development
        </div>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('overview')

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar current={screen} onChange={setScreen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar screen={screen} />
        <div className="flex-1 overflow-hidden flex">
          {screen === 'overview'    && <OverviewScreen onNavigate={setScreen} />}
          {screen === 'properties'  && <PropertiesScreen onNavigate={setScreen} />}
          {screen === 'units'       && <UnitsScreen />}
          {screen === 'maintenance' && <MaintenanceScreen onNavigate={setScreen} />}
          {screen === 'fundis'      && <FundisScreen />}
          {screen === 'passport'    && <PassportScreen />}
          {['tenants','workorders','assets','reports','settings'].includes(screen) && (
            <PlaceholderScreen screen={screen} />
          )}
        </div>
      </main>
    </div>
  )
}
