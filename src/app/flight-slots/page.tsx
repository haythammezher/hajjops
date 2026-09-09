'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plane, Plus, Download, Filter, CheckCircle2, Clock, X, Calendar, Users, Globe, AlertTriangle, RefreshCw, Send } from 'lucide-react';

interface FlightSlot {
  id: string;
  slotRef: string;
  authority: 'GACA' | 'LCAA';
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  aircraft: string;
  totalSeats: number;
  allocatedSeats: number;
  slotType: 'Hajj Charter' | 'Scheduled' | 'Extra Section';
  status: 'approved' | 'pending' | 'conditional' | 'rejected';
  permitNumber?: string;
  permitExpiry?: string;
  notes?: string;
  rejectionReason?: string;
}

const GACA_AIRLINES = ['Saudi Airlines (SV)', 'Flynas (XY)', 'Flyadeal (F3)', 'Air Arabia (G9)'];
const LCAA_AIRLINES = ['Middle East Airlines (ME)', 'Cedar Jet (LQ)', 'Transavia (HV)'];
const AIRCRAFT_TYPES = ['Boeing 737-800 (189 seats)', 'Airbus A320 (180 seats)', 'Boeing 777-300ER (396 seats)', 'Airbus A330-300 (335 seats)', 'Boeing 747-400 (416 seats)'];

const mockSlots: FlightSlot[] = [
  { id: 'SLT-001', slotRef: 'GACA-HJ27-0881', authority: 'GACA', airline: 'Saudi Airlines (SV)', flightNumber: 'SV-881', origin: 'Cairo (CAI)', destination: 'Jeddah (JED)', date: '15/09/2027', time: '08:30', aircraft: 'Boeing 777-300ER (396 seats)', totalSeats: 396, allocatedSeats: 187, slotType: 'Hajj Charter', status: 'approved', permitNumber: 'GACA/HJ/2027/0881', permitExpiry: '22/10/2027', notes: 'Priority Hajj charter — GACA approved' },
  { id: 'SLT-002', slotRef: 'GACA-HJ27-0903', authority: 'GACA', airline: 'Saudi Airlines (SV)', flightNumber: 'SV-903', origin: 'Lagos (LOS)', destination: 'Jeddah (JED)', date: '16/09/2027', time: '14:15', aircraft: 'Boeing 777-300ER (396 seats)', totalSeats: 396, allocatedSeats: 143, slotType: 'Hajj Charter', status: 'approved', permitNumber: 'GACA/HJ/2027/0903', permitExpiry: '22/10/2027' },
  { id: 'SLT-003', slotRef: 'LCAA-HJ27-0201', authority: 'LCAA', airline: 'Middle East Airlines (ME)', flightNumber: 'ME-201', origin: 'Beirut (BEY)', destination: 'Jeddah (JED)', date: '15/09/2027', time: '10:00', aircraft: 'Airbus A330-300 (335 seats)', totalSeats: 335, allocatedSeats: 112, slotType: 'Hajj Charter', status: 'approved', permitNumber: 'LCAA/HJ/2027/0201', permitExpiry: '22/10/2027', notes: 'Lebanese Hajj mission — LCAA slot' },
  { id: 'SLT-004', slotRef: 'LCAA-HJ27-0202', authority: 'LCAA', airline: 'Middle East Airlines (ME)', flightNumber: 'ME-202', origin: 'Beirut (BEY)', destination: 'Madinah (MED)', date: '16/09/2027', time: '07:45', aircraft: 'Airbus A320 (180 seats)', totalSeats: 180, allocatedSeats: 98, slotType: 'Extra Section', status: 'pending', notes: 'Awaiting LCAA final approval' },
  { id: 'SLT-005', slotRef: 'GACA-HJ27-0853', authority: 'GACA', airline: 'Saudi Airlines (SV)', flightNumber: 'PK-853', origin: 'Karachi (KHI)', destination: 'Jeddah (JED)', date: '17/09/2027', time: '03:45', aircraft: 'Boeing 737-800 (189 seats)', totalSeats: 189, allocatedSeats: 98, slotType: 'Scheduled', status: 'conditional', permitNumber: 'GACA/HJ/2027/0853', notes: 'Conditional — pending health clearance docs' },
  { id: 'SLT-006', slotRef: 'LCAA-HJ27-0203', authority: 'LCAA', airline: 'Cedar Jet (LQ)', flightNumber: 'LQ-103', origin: 'Beirut (BEY)', destination: 'Jeddah (JED)', date: '18/09/2027', time: '22:30', aircraft: 'Airbus A320 (180 seats)', totalSeats: 180, allocatedSeats: 0, slotType: 'Hajj Charter', status: 'rejected', notes: 'Rejected — airline permit expired', rejectionReason: 'Airline operating permit has expired. A valid LCAA operating certificate must be submitted before a new slot approval can be granted.' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20',
  pending: 'bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20',
  conditional: 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20',
  rejected: 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20',
};

const authorityColors: Record<string, string> = {
  GACA: 'bg-[#F0F9FF] text-[#0369A1] border-[#0369A1]/20',
  LCAA: 'bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]/20',
};

export default function FlightSlotsPage() {
  const [slots, setSlots] = useState<FlightSlot[]>(mockSlots);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterAuthority, setFilterAuthority] = useState<'all' | 'GACA' | 'LCAA'>('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [resubmitSlot, setResubmitSlot] = useState<FlightSlot | null>(null);
  const [resubmitNote, setResubmitNote] = useState('');
  const [resubmitSuccess, setResubmitSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    authority: 'GACA\' as \'GACA\' | \'LCAA',
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    date: '',
    time: '',
    aircraft: '',
    slotType: 'Hajj Charter' as FlightSlot['slotType'],
    totalSeats: '',
    permitNumber: '',
    notes: '',
  });

  const filtered = slots.filter((s) => {
    if (filterAuthority !== 'all' && s.authority !== filterAuthority) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: slots.length,
    approved: slots.filter((s) => s.status === 'approved').length,
    pending: slots.filter((s) => s.status === 'pending').length,
    gaca: slots.filter((s) => s.authority === 'GACA').length,
    lcaa: slots.filter((s) => s.authority === 'LCAA').length,
    totalSeats: slots.reduce((a, s) => a + s.totalSeats, 0),
    allocatedSeats: slots.reduce((a, s) => a + s.allocatedSeats, 0),
  };

  const handleAdd = () => {
    const newSlot: FlightSlot = {
      id: `SLT-${String(slots.length + 1).padStart(3, '0')}`,
      slotRef: `${form.authority}-HJ27-${form.flightNumber.replace(/\D/g, '')}`,
      authority: form.authority,
      airline: form.airline,
      flightNumber: form.flightNumber,
      origin: form.origin,
      destination: form.destination,
      date: form.date,
      time: form.time,
      aircraft: form.aircraft,
      totalSeats: parseInt(form.totalSeats) || 0,
      allocatedSeats: 0,
      slotType: form.slotType,
      status: 'pending',
      permitNumber: form.permitNumber || undefined,
      notes: form.notes || undefined,
    };
    setSlots((prev) => [...prev, newSlot]);
    setShowAddModal(false);
    setForm({ authority: 'GACA', airline: '', flightNumber: '', origin: '', destination: '', date: '', time: '', aircraft: '', slotType: 'Hajj Charter', totalSeats: '', permitNumber: '', notes: '' });
  };

  const handleResubmit = () => {
    if (!resubmitSlot) return;
    setSlots((prev) =>
      prev.map((s) =>
        s.id === resubmitSlot.id
          ? { ...s, status: 'pending', rejectionReason: undefined, notes: resubmitNote || s.notes }
          : s
      )
    );
    setResubmitSuccess(resubmitSlot.slotRef);
    setResubmitSlot(null);
    setResubmitNote('');
  };

  const exportCSV = () => {
    const headers = ['Slot Ref', 'Authority', 'Airline', 'Flight #', 'Origin', 'Destination', 'Date', 'Time', 'Aircraft', 'Total Seats', 'Allocated', 'Type', 'Status', 'Permit #'];
    const rows = slots.map((s) => [s.slotRef, s.authority, s.airline, s.flightNumber, s.origin, s.destination, s.date, s.time, s.aircraft, s.totalSeats, s.allocatedSeats, s.slotType, s.status, s.permitNumber || '']);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-slots-hajj2027.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Plane size={20} className="text-primary" />
              Flight Slot Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">GACA & LCAA authorized slots — Hajj 2027 Campaign</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <Download size={14} />
              Export Slots
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
              <Plus size={14} />
              Add Slot
            </button>
          </div>
        </div>

        {/* Resubmit Success Banner */}
        {resubmitSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#16A34A]/30 text-[#16A34A]">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <p className="text-sm font-medium">New approval request submitted for slot <span className="font-mono">{resubmitSuccess}</span>. Status updated to <strong>Pending</strong>.</p>
            <button onClick={() => setResubmitSuccess(null)} className="ml-auto p-1 rounded hover:bg-[#16A34A]/10"><X size={14} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total Slots', value: stats.total, icon: Plane, color: 'text-primary' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-[#16A34A]' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-[#D97706]' },
            { label: 'GACA Slots', value: stats.gaca, icon: Globe, color: 'text-[#0369A1]' },
            { label: 'LCAA Slots', value: stats.lcaa, icon: Globe, color: 'text-[#7C3AED]' },
            { label: 'Total Seats', value: stats.totalSeats.toLocaleString(), icon: Users, color: 'text-foreground' },
            { label: 'Allocated', value: stats.allocatedSeats.toLocaleString(), icon: Users, color: 'text-[#16A34A]' },
          ].map((stat) => (
            <div key={stat.label} className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={14} className={stat.color} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Authority Info Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-base p-4 border-l-4 border-l-[#0369A1]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center flex-shrink-0">
                <Globe size={16} className="text-[#0369A1]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">GACA — General Authority of Civil Aviation</h3>
                <p className="text-xs text-muted-foreground mt-1">Saudi Arabia's civil aviation authority. All flights landing at Jeddah (JED) or Madinah (MED) require GACA slot approval. Hajj charter permits issued under GACA/HJ/YYYY reference.</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0369A1] border border-[#0369A1]/20 font-medium">JED · MED · DMM</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0369A1] border border-[#0369A1]/20 font-medium">Hajj Season Slots</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-base p-4 border-l-4 border-l-[#7C3AED]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] flex items-center justify-center flex-shrink-0">
                <Globe size={16} className="text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">LCAA — Lebanese Civil Aviation Authority</h3>
                <p className="text-xs text-muted-foreground mt-1">Lebanon's civil aviation authority. All Hajj flights departing from Beirut (BEY) require LCAA slot authorization. Lebanese Hajj mission coordinates with LCAA/HJ/YYYY permits.</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/20 font-medium">BEY — Beirut Rafic Hariri</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/20 font-medium">Lebanese Hajj Mission</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Filter size={12} /> Filter:</span>
          {(['all', 'GACA', 'LCAA'] as const).map((a) => (
            <button key={a} onClick={() => setFilterAuthority(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterAuthority === a ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-input'}`}>
              {a === 'all' ? 'All Authorities' : a}
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          {['all', 'approved', 'pending', 'conditional', 'rejected'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-input'}`}>
              {s === 'all' ? 'All Statuses' : s}
            </button>
          ))}
        </div>

        {/* Slots Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Slot Ref', 'Authority', 'Flight', 'Route', 'Date & Time', 'Aircraft', 'Seats', 'Type', 'Status', 'Permit #', ''].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((slot) => {
                  const fillPct = slot.totalSeats > 0 ? Math.round((slot.allocatedSeats / slot.totalSeats) * 100) : 0;
                  const isRejected = slot.status === 'rejected';
                  return (
                    <React.Fragment key={slot.id}>
                      <tr className={`table-row-hover border-b border-border/50 ${isRejected ? 'bg-[#FEF2F2]/30' : ''}`}>
                        <td className="py-3 px-3">
                          <span className="font-mono-data text-xs text-foreground">{slot.slotRef}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${authorityColors[slot.authority]}`}>{slot.authority}</span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-foreground text-sm">{slot.flightNumber}</p>
                          <p className="text-xs text-muted-foreground">{slot.airline}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-sm text-foreground">{slot.origin}</p>
                          <p className="text-xs text-muted-foreground">→ {slot.destination}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-sm text-foreground flex items-center gap-1"><Calendar size={11} className="text-muted-foreground" />{slot.date}</p>
                          <p className="text-xs text-muted-foreground">{slot.time}</p>
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground max-w-[140px] truncate">{slot.aircraft}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${fillPct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums">{slot.allocatedSeats}/{slot.totalSeats}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-muted-foreground">{slot.slotType}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${statusColors[slot.status]}`}>{slot.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono-data text-xs text-muted-foreground">{slot.permitNumber || '—'}</span>
                        </td>
                        <td className="py-3 px-3">
                          {isRejected && (
                            <button
                              onClick={() => { setResubmitSlot(slot); setResubmitNote(''); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#DC2626] hover:text-white transition-all whitespace-nowrap"
                            >
                              <RefreshCw size={11} />
                              Re-submit
                            </button>
                          )}
                        </td>
                      </tr>
                      {/* Rejection reason row */}
                      {isRejected && slot.rejectionReason && (
                        <tr className="border-b border-border/50 bg-[#FEF2F2]/20">
                          <td colSpan={11} className="px-3 pb-3 pt-0">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/20">
                              <AlertTriangle size={14} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-[#DC2626] mb-0.5">Rejection Reason</p>
                                <p className="text-xs text-[#991B1B]">{slot.rejectionReason}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Plane size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">No slots match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Re-submit Approval Modal */}
      {resubmitSlot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                  <RefreshCw size={16} className="text-[#DC2626]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Re-submit Approval Request</h2>
                  <p className="text-xs text-muted-foreground">{resubmitSlot.slotRef} — {resubmitSlot.flightNumber}</p>
                </div>
              </div>
              <button onClick={() => setResubmitSlot(null)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Rejection reason display */}
              {resubmitSlot.rejectionReason && (
                <div className="flex items-start gap-2 p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/20">
                  <AlertTriangle size={15} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#DC2626] mb-1">Reason for Rejection</p>
                    <p className="text-sm text-[#991B1B]">{resubmitSlot.rejectionReason}</p>
                  </div>
                </div>
              )}

              {/* Slot summary */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Flight</p>
                  <p className="text-sm font-semibold text-foreground">{resubmitSlot.flightNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Authority</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${authorityColors[resubmitSlot.authority]}`}>{resubmitSlot.authority}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Route</p>
                  <p className="text-sm text-foreground">{resubmitSlot.origin} → {resubmitSlot.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Date</p>
                  <p className="text-sm text-foreground">{resubmitSlot.date} at {resubmitSlot.time}</p>
                </div>
              </div>

              {/* Additional notes */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Additional Notes / Corrective Actions Taken</label>
                <textarea
                  rows={3}
                  placeholder="Describe the corrective actions taken to address the rejection reason..."
                  value={resubmitNote}
                  onChange={(e) => setResubmitNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <p className="text-xs text-muted-foreground">Submitting this request will change the slot status back to <strong>Pending</strong> and notify the authority for re-review.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setResubmitSlot(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
              <button
                onClick={handleResubmit}
                className="flex items-center gap-2 btn-primary text-sm px-4 py-2"
              >
                <Send size={13} />
                Submit New Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Add Flight Slot</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Authority */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Civil Aviation Authority</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['GACA', 'LCAA'] as const).map((auth) => (
                    <button key={auth} onClick={() => setForm((f) => ({ ...f, authority: auth, airline: '' }))}
                      className={`p-3 rounded-xl border text-left transition-all ${form.authority === auth ? 'border-primary bg-secondary' : 'border-border hover:bg-muted'}`}>
                      <p className="text-sm font-semibold text-foreground">{auth}</p>
                      <p className="text-xs text-muted-foreground">{auth === 'GACA' ? 'Saudi Arabia — Jeddah/Madinah' : 'Lebanon — Beirut Rafic Hariri'}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Airline</label>
                  <select value={form.airline} onChange={(e) => setForm((f) => ({ ...f, airline: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select airline...</option>
                    {(form.authority === 'GACA' ? GACA_AIRLINES : LCAA_AIRLINES).map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Flight Number</label>
                  <input type="text" placeholder="e.g. SV-881" value={form.flightNumber} onChange={(e) => setForm((f) => ({ ...f, flightNumber: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Origin Airport</label>
                  <input type="text" placeholder="e.g. Beirut (BEY)" value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Destination Airport</label>
                  <input type="text" placeholder="e.g. Jeddah (JED)" value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Departure Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Departure Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Aircraft Type</label>
                  <select value={form.aircraft} onChange={(e) => setForm((f) => ({ ...f, aircraft: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select aircraft...</option>
                    {AIRCRAFT_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Total Seats</label>
                  <input type="number" placeholder="e.g. 335" value={form.totalSeats} onChange={(e) => setForm((f) => ({ ...f, totalSeats: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Slot Type</label>
                  <select value={form.slotType} onChange={(e) => setForm((f) => ({ ...f, slotType: e.target.value as FlightSlot['slotType'] }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Hajj Charter</option>
                    <option>Scheduled</option>
                    <option>Extra Section</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Permit Number (optional)</label>
                  <input type="text" placeholder="e.g. GACA/HJ/2027/0881" value={form.permitNumber} onChange={(e) => setForm((f) => ({ ...f, permitNumber: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Notes</label>
                <textarea rows={2} placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
              <button onClick={handleAdd} disabled={!form.flightNumber || !form.origin || !form.destination}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">Add Slot</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
