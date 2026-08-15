import React, { useMemo, useState } from 'react'

type RentStatus = 'Paid' | 'Due' | 'Partial' | 'Pending verification'

type RentRecord = {
  unit: string
  tenant: string
  amountDue: number
  amountPaid: number
  dueDate: string
  status: RentStatus
  lastPayment: string
  reference: string
}

type TenantHistory = {
  tenant: string
  unit: string
  moveIn: string
  moveOut: string
  status: 'Current' | 'Former'
  phone: string
}

const RENT_RECORDS: RentRecord[] = [
  { unit: 'B-204', tenant: 'Grace Mwangi', amountDue: 45000, amountPaid: 0, dueDate: '05 Aug 2026', status: 'Due', lastPayment: '05 Jul 2026', reference: '—' },
  { unit: 'A-101', tenant: 'David Ochieng', amountDue: 38000, amountPaid: 38000, dueDate: '05 Aug 2026', status: 'Paid', lastPayment: '04 Aug 2026', reference: 'QRF7M2P1' },
  { unit: 'C-310', tenant: 'Alice Weru', amountDue: 52000, amountPaid: 26000, dueDate: '05 Aug 2026', status: 'Partial', lastPayment: '03 Aug 2026', reference: 'QRE8K4D2' },
  { unit: 'B-108', tenant: 'Kevin Otieno', amountDue: 42000, amountPaid: 0, dueDate: '05 Aug 2026', status: 'Due', lastPayment: '05 Jul 2026', reference: '—' },
  { unit: 'A-305', tenant: '—', amountDue: 0, amountPaid: 0, dueDate: '—', status: 'Pending verification', lastPayment: '—', reference: '—' },
]

const TENANT_HISTORY: TenantHistory[] = [
  { tenant: 'Tenant A', unit: 'B-204', moveIn: 'Jan 2010', moveOut: 'Dec 2013', status: 'Former', phone: '—' },
  { tenant: 'Tenant B', unit: 'B-204', moveIn: 'Feb 2014', moveOut: 'Aug 2018', status: 'Former', phone: '—' },
  { tenant: 'Beatrice Ouma', unit: 'B-204', moveIn: 'Sep 2018', moveOut: 'Mar 2022', status: 'Former', phone: '+254 7•• ••• •••' },
  { tenant: 'Samuel Ngugi', unit: 'B-204', moveIn: 'May 2022', moveOut: 'Dec 2024', status: 'Former', phone: '+254 7•• ••• •••' },
  { tenant: 'Grace Mwangi', unit: 'B-204', moveIn: 'Jan 2025', moveOut: 'Present', status: 'Current', phone: '+254 7•• ••• •••' },
]

function csvEscape(value: unknown) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function money(value: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value)
}

function Pill({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'red' | 'blue' | 'slate' }) {
  const styles = {
    green: { bg: '#ECFDF3', color: '#087443', border: '#ABEFC6' },
    amber: { bg: '#FFFAEB', color: '#B54708', border: '#FEDF89' },
    red: { bg: '#FEF3F2', color: '#B42318', border: '#FECDCA' },
    blue: { bg: '#EFF8FF', color: '#175CD3', border: '#B2DDFF' },
    slate: { bg: '#F8FAFC', color: '#475467', border: '#E2E8F0' },
  }[tone]
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: 999, background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`, fontSize: 11, fontWeight: 700 }}>{children}</span>
}

function ActionButton({ children, onClick, primary = false }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return <button onClick={onClick} style={{ border: primary ? '1px solid #12355B' : '1px solid #D0D5DD', background: primary ? '#12355B' : '#fff', color: primary ? '#fff' : '#344054', borderRadius: 9, padding: '8px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{children}</button>
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} style={{ border: 0, borderBottom: active ? '2px solid #12355B' : '2px solid transparent', background: 'transparent', color: active ? '#12355B' : '#667085', padding: '11px 10px', fontSize: 11, fontWeight: active ? 800 : 600, cursor: 'pointer' }}>{children}</button>
}

function RentTab() {
  const [records, setRecords] = useState(RENT_RECORDS)
  const [message, setMessage] = useState('')
  const [transcript, setTranscript] = useState('')

  const due = useMemo(() => records.filter(r => r.status === 'Due' || r.status === 'Partial'), [records])
  const outstanding = useMemo(() => records.reduce((sum, r) => sum + Math.max(0, r.amountDue - r.amountPaid), 0), [records])

  const parseTranscript = () => {
    const lower = transcript.toLowerCase()
    const match = records.find(r => lower.includes(r.tenant.toLowerCase()) || lower.includes(r.unit.toLowerCase()) || (r.reference !== '—' && lower.includes(r.reference.toLowerCase())))
    if (!match) {
      setMessage('No tenant/unit/reference matched this message. Keep it pending verification rather than guessing.')
      return
    }
    const amountMatch = transcript.match(/(?:ksh|kes|amount|paid)\s*[:=]?\s*([0-9,]+)/i)
    const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0
    if (!amount) {
      setMessage(`Matched ${match.tenant} (${match.unit}), but no amount was confidently extracted. Nothing was changed.`)
      return
    }
    setRecords(current => current.map(r => r.unit === match.unit ? { ...r, amountPaid: Math.min(r.amountDue, r.amountPaid + amount), lastPayment: 'Today', reference: r.reference === '—' ? 'WHATSAPP-IMPORT' : r.reference, status: r.amountPaid + amount >= r.amountDue ? 'Paid' : 'Partial' } : r))
    setMessage(`${money(amount)} matched to ${match.tenant} (${match.unit}). Marked as a payment record for manager review.`)
    setTranscript('')
  }

  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
      <div style={{ padding: 12, border: '1px solid #E4E7EC', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#667085' }}>Outstanding</div><strong style={{ fontSize: 19, color: '#B42318' }}>{money(outstanding)}</strong></div>
      <div style={{ padding: 12, border: '1px solid #E4E7EC', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#667085' }}>Units due / partial</div><strong style={{ fontSize: 19 }}>{due.length}</strong></div>
      <div style={{ padding: 12, border: '1px solid #E4E7EC', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#667085' }}>Verified this month</div><strong style={{ fontSize: 19, color: '#087443' }}>{records.filter(r => r.status === 'Paid').length}</strong></div>
    </div>

    <div style={{ border: '1px solid #D0D5DD', borderRadius: 10, padding: 12, marginBottom: 14, background: '#F8FAFC' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#12355B', marginBottom: 4 }}>WhatsApp rent receipt / M-Pesa message import</div>
      <div style={{ fontSize: 10, color: '#667085', marginBottom: 8 }}>Paste a tenant's M-Pesa confirmation or transcript. CivicFix should match by tenant, unit or reference and keep ambiguous payments pending review.</div>
      <textarea value={transcript} onChange={e => setTranscript(e.target.value)} placeholder="Example: Grace Mwangi B-204 paid KES 45,000..." style={{ width: '100%', minHeight: 62, resize: 'vertical', border: '1px solid #D0D5DD', borderRadius: 8, padding: 9, fontSize: 11, boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><ActionButton primary onClick={parseTranscript}>Parse & queue payment</ActionButton><ActionButton onClick={() => setTranscript('')}>Clear</ActionButton></div>
      {message && <div style={{ marginTop: 8, padding: 8, background: '#ECFDF3', color: '#087443', borderRadius: 7, fontSize: 10, fontWeight: 700 }}>{message}</div>}
    </div>

    <div style={{ border: '1px solid #E4E7EC', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '10px 12px', background: '#F8FAFC', fontSize: 11, fontWeight: 800 }}>Rent due by unit and tenant</div>
      {records.map(record => <div key={record.unit} style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr 100px', gap: 8, alignItems: 'center', padding: '10px 12px', borderTop: '1px solid #F2F4F7' }}>
        <strong style={{ fontSize: 11 }}>{record.unit}</strong>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>{record.tenant}</div><div style={{ fontSize: 9, color: '#98A2B3' }}>Due {record.dueDate}</div></div>
        <div><div style={{ fontSize: 10 }}>{money(Math.max(0, record.amountDue - record.amountPaid))} outstanding</div><div style={{ fontSize: 9, color: '#98A2B3' }}>Last: {record.lastPayment}</div></div>
        <Pill tone={record.status === 'Paid' ? 'green' : record.status === 'Partial' ? 'amber' : record.status === 'Due' ? 'red' : 'slate'}>{record.status}</Pill>
      </div>)}
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}><ActionButton onClick={() => downloadCsv('civicfix-rent-ledger.csv', records)}>Export rent CSV</ActionButton></div>
  </div>
}

function TenantHistoryTab() {
  return <div>
    <div style={{ padding: 12, borderRadius: 10, background: '#EFF8FF', border: '1px solid #B2DDFF', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#175CD3' }}>Permanent occupancy record</div>
      <div style={{ fontSize: 10, color: '#475467', marginTop: 3 }}>Authorized users can trace who occupied a unit over time without exposing private contact details. Keep historical records separate from public Passport views.</div>
    </div>
    <div style={{ border: '1px solid #E4E7EC', borderRadius: 10, overflow: 'hidden' }}>
      {TENANT_HISTORY.map((tenant, index) => <div key={`${tenant.tenant}-${index}`} style={{ display: 'grid', gridTemplateColumns: '1.4fr 70px 1fr 1fr 80px', gap: 8, alignItems: 'center', padding: '11px 12px', borderTop: index ? '1px solid #F2F4F7' : 0 }}>
        <div><div style={{ fontSize: 11, fontWeight: 700 }}>{tenant.tenant}</div><div style={{ fontSize: 9, color: '#98A2B3' }}>{tenant.phone}</div></div>
        <strong style={{ fontSize: 10 }}>{tenant.unit}</strong>
        <span style={{ fontSize: 10, color: '#667085' }}>{tenant.moveIn}</span>
        <span style={{ fontSize: 10, color: '#667085' }}>{tenant.moveOut}</span>
        <Pill tone={tenant.status === 'Current' ? 'green' : 'slate'}>{tenant.status}</Pill>
      </div>)}
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
      <ActionButton onClick={() => downloadCsv('civicfix-tenant-history.csv', TENANT_HISTORY)}>Export tenant CSV</ActionButton>
      <ActionButton primary onClick={() => downloadCsv('civicfix-property-occupancy-history.csv', TENANT_HISTORY)}>Export occupancy history</ActionButton>
    </div>
  </div>
}

function QrTab() {
  const [copied, setCopied] = useState('')
  const codes = [
    { id: 'QR-B204-KITCHEN', location: 'B-204 · Kitchen', target: 'WhatsApp report flow', status: 'Active' },
    { id: 'QR-LOBBY-COMMON', location: 'Common · Lobby', target: 'WhatsApp report flow', status: 'Active' },
    { id: 'QR-BLOCKB-GATE', location: 'Block B · Gate', target: 'WhatsApp report flow', status: 'Active' },
  ]
  const copy = (id: string) => { navigator.clipboard?.writeText(`https://civicfix.app/report/${id}`); setCopied(id); setTimeout(() => setCopied(''), 1600) }
  return <div>
    <div style={{ padding: 12, background: '#ECFDF3', border: '1px solid #ABEFC6', borderRadius: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#087443' }}>Building-first reporting</div>
      <div style={{ fontSize: 10, color: '#475467', marginTop: 3 }}>Every QR identifier carries property, building, unit/room and location context. The public code contains only a safe opaque identifier.</div>
    </div>
    {codes.map(code => <div key={code.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E4E7EC', borderRadius: 10, padding: 12, marginBottom: 8 }}>
      <div style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', border: '2px solid #12355B', borderRadius: 7, color: '#12355B', fontWeight: 900, fontSize: 12 }}>QR</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 800 }}>{code.location}</div><div style={{ fontSize: 9, color: '#98A2B3' }}>{code.id} · {code.target}</div></div>
      <Pill tone="green">{code.status}</Pill>
      <ActionButton onClick={() => copy(code.id)}>{copied === code.id ? 'Copied' : 'Copy report link'}</ActionButton>
    </div>)}
    <div style={{ marginTop: 12, padding: 12, border: '1px dashed #D0D5DD', borderRadius: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 800 }}>Scan-to-report preview</div>
      <div style={{ fontSize: 10, color: '#667085', margin: '4px 0 10px' }}>Tenant → QR → WhatsApp → structured maintenance request</div>
      <ActionButton primary onClick={() => window.open('https://wa.me/', '_blank', 'noopener,noreferrer')}>Open WhatsApp entry point</ActionButton>
    </div>
  </div>
}

function PassportTab() {
  const rows = [
    { date: '15 Aug 2026', unit: 'B-204', event: 'Leaking kitchen pipe reported', actor: 'Grace Mwangi', status: 'Reported' },
    { date: '14 Aug 2026', unit: 'Common', event: 'Lift doors repaired', actor: 'Otis Elevators', status: 'Verified' },
    { date: '02 Aug 2026', unit: 'Common', event: 'Annual fire inspection passed', actor: 'FireSafe Kenya', status: 'Verified' },
  ]
  return <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}><div><div style={{ fontSize: 13, fontWeight: 800 }}>Property Passport continuity</div><div style={{ fontSize: 10, color: '#667085' }}>Maintenance, occupancy and payment records can contribute to the long-term property record.</div></div><ActionButton primary onClick={() => downloadCsv('civicfix-property-passport.csv', rows)}>Export Passport CSV</ActionButton></div>
    <div style={{ border: '1px solid #E4E7EC', borderRadius: 10, overflow: 'hidden' }}>{rows.map((row, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '95px 65px 1fr 120px 90px', gap: 8, padding: '10px 12px', alignItems: 'center', borderTop: i ? '1px solid #F2F4F7' : 0 }}><span style={{ fontSize: 10, color: '#667085' }}>{row.date}</span><strong style={{ fontSize: 10 }}>{row.unit}</strong><span style={{ fontSize: 11, fontWeight: 700 }}>{row.event}</span><span style={{ fontSize: 10, color: '#667085' }}>{row.actor}</span><Pill tone={row.status === 'Verified' ? 'green' : 'amber'}>{row.status}</Pill></div>)}</div>
  </div>
}

function Console() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'rent' | 'tenants' | 'qr' | 'passport'>('rent')

  if (!open) return <button onClick={() => setOpen(true)} style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 10000, background: '#12355B', color: '#fff', border: 0, borderRadius: 999, padding: '11px 15px', boxShadow: '0 8px 30px rgba(18,53,91,.28)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>CivicFix MVP Console</button>

  return <div style={{ position: 'fixed', right: 18, bottom: 18, width: 680, maxWidth: 'calc(100vw - 36px)', maxHeight: 'calc(100vh - 36px)', zIndex: 10000, background: '#fff', border: '1px solid #D0D5DD', borderRadius: 14, boxShadow: '0 20px 60px rgba(16,24,40,.22)', overflow: 'hidden' }}>
    <div style={{ padding: '12px 14px', background: '#12355B', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 900 }}>CivicFix MVP Continuity Console</div><div style={{ fontSize: 9, color: '#B2DDFF', marginTop: 2 }}>Added without removing the existing Figma/Lovable prototype surfaces</div></div>
      <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: 0, borderRadius: 7, padding: '6px 9px', cursor: 'pointer', fontWeight: 800 }}>×</button>
    </div>
    <div style={{ display: 'flex', borderBottom: '1px solid #E4E7EC', padding: '0 8px' }}>
      <TabButton active={tab === 'rent'} onClick={() => setTab('rent')}>Rent collection</TabButton>
      <TabButton active={tab === 'tenants'} onClick={() => setTab('tenants')}>Tenant history</TabButton>
      <TabButton active={tab === 'qr'} onClick={() => setTab('qr')}>QR registry</TabButton>
      <TabButton active={tab === 'passport'} onClick={() => setTab('passport')}>Passport</TabButton>
    </div>
    <div style={{ padding: 14, overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
      {tab === 'rent' && <RentTab />}
      {tab === 'tenants' && <TenantHistoryTab />}
      {tab === 'qr' && <QrTab />}
      {tab === 'passport' && <PassportTab />}
    </div>
  </div>
}

export default function MvpContinuityLayer({ children }: { children: React.ReactNode }) {
  return <>{children}<Console /></>
}
