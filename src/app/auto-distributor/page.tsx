'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { pilgrims, buses, hotels, flights } from '@/lib/mockData';
import { Shuffle, Play, CheckCircle2, Bus, Building2, Plane, Users, RotateCcw, Download, Zap } from 'lucide-react';

interface DistributionRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface DistributionResult {
  pilgrimId: string;
  name: string;
  bus?: string;
  seat?: string;
  hotel?: string;
  room?: string;
  flight?: string;
  status: 'assigned' | 'partial' | 'failed';
  reason?: string;
}

const defaultRules: DistributionRule[] = [
  { id: 'gender', label: 'Gender Separation', description: 'Separate male and female pilgrims in buses and rooms', enabled: true },
  { id: 'mahram', label: 'Mahram Grouping', description: 'Keep mahram pairs (husband/wife) in same bus and adjacent rooms', enabled: true },
  { id: 'group', label: 'Group Cohesion', description: 'Assign pilgrims from same group to same bus and hotel floor', enabled: true },
  { id: 'age', label: 'Elderly Priority', description: 'Assign pilgrims 65+ to ground floor rooms and front bus seats', enabled: true },
  { id: 'payment', label: 'Payment Verified Only', description: 'Only assign fully paid pilgrims to confirmed flights', enabled: false },
  { id: 'visa', label: 'Visa Approved Only', description: 'Only assign visa-approved pilgrims to flights', enabled: true },
  { id: 'balance', label: 'Load Balancing', description: 'Distribute evenly across buses and hotels to avoid overloading', enabled: true },
];

const mockResults: DistributionResult[] = pilgrims.slice(0, 8).map((p, i) => ({
  pilgrimId: p.id,
  name: p.name,
  bus: p.busNumber ? `Bus #${p.busNumber}` : undefined,
  seat: p.seatNumber,
  hotel: p.hotelMakkah,
  room: p.roomNumber ? `Room ${p.roomNumber}` : undefined,
  flight: p.flightNumber,
  status: p.busNumber && p.roomNumber && p.flightNumber ? 'assigned' : p.busNumber || p.roomNumber ? 'partial' : 'failed',
  reason: !p.busNumber && !p.roomNumber ? 'Visa not approved — skipped per rules' : undefined,
}));

type DistStep = 'config' | 'running' | 'results';

export default function AutoDistributorPage() {
  const [rules, setRules] = useState<DistributionRule[]>(defaultRules);
  const [step, setStep] = useState<DistStep>('config');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<DistributionResult[]>([]);
  const [scope, setScope] = useState<'all' | 'unassigned'>('unassigned');

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const runDistribution = () => {
    setStep('running');
    setProgress(0);
    const steps = [
      { pct: 15, label: 'Analyzing pilgrim data...' },
      { pct: 30, label: 'Applying gender separation rules...' },
      { pct: 45, label: 'Grouping mahram pairs...' },
      { pct: 60, label: 'Assigning buses & seats...' },
      { pct: 75, label: 'Allocating hotel rooms...' },
      { pct: 88, label: 'Assigning flight slots...' },
      { pct: 100, label: 'Finalizing assignments...' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].pct);
        setProgressLabel(steps[i].label);
        i++;
      } else {
        clearInterval(interval);
        setResults(mockResults);
        setStep('results');
      }
    }, 600);
  };

  const reset = () => {
    setStep('config');
    setProgress(0);
    setProgressLabel('');
    setResults([]);
  };

  const exportResults = () => {
    const headers = ['Pilgrim ID', 'Name', 'Bus', 'Seat', 'Hotel', 'Room', 'Flight', 'Status', 'Notes'];
    const rows = results.map((r) => [r.pilgrimId, r.name, r.bus || '', r.seat || '', r.hotel || '', r.room || '', r.flight || '', r.status, r.reason || '']);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auto-distribution-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const assigned = results.filter((r) => r.status === 'assigned').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  const unassignedCount = pilgrims.filter((p) => !p.busNumber || !p.roomNumber || !p.flightNumber).length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Shuffle size={20} className="text-primary" />
              Automatic Distributor
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Auto-assign pilgrims to buses, rooms, hotels, and flights using smart rules</p>
          </div>
          {step === 'results' && (
            <div className="flex items-center gap-2">
              <button onClick={exportResults} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <Download size={14} />Export Results
              </button>
              <button onClick={reset} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <RotateCcw size={14} />Reset
              </button>
            </div>
          )}
        </div>

        {/* Capacity Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Pilgrims to Assign', value: scope === 'all' ? pilgrims.length : unassignedCount, icon: Users, color: 'text-primary', sub: scope === 'all' ? 'All pilgrims' : 'Unassigned only' },
            { label: 'Available Buses', value: `${buses.filter((b) => b.allocated < b.capacity).length}/${buses.length}`, icon: Bus, color: 'text-[#D97706]', sub: 'With free seats' },
            { label: 'Available Hotels', value: `${hotels.filter((h) => h.allocatedRooms < h.totalRooms).length}/${hotels.length}`, icon: Building2, color: 'text-[#2563EB]', sub: 'With free rooms' },
            { label: 'Available Flights', value: `${flights.filter((f) => f.confirmed < f.passengers).length}/${flights.length}`, icon: Plane, color: 'text-[#16A34A]', sub: 'With open seats' },
          ].map((s) => (
            <div key={s.label} className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={14} className={s.color} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {step === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rules Config */}
            <div className="lg:col-span-2 card-base p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap size={15} className="text-primary" />
                Distribution Rules
              </h2>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${rule.enabled ? 'border-primary/30 bg-secondary' : 'border-border bg-muted/30'}`}
                    onClick={() => toggleRule(rule.id)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${rule.enabled ? 'bg-primary border-primary' : 'border-border bg-card'}`}>
                      {rule.enabled && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{rule.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Config */}
            <div className="space-y-4">
              <div className="card-base p-5 space-y-4">
                <h2 className="text-sm font-bold text-foreground">Distribution Scope</h2>
                <div className="space-y-2">
                  {[
                    { id: 'unassigned', label: 'Unassigned Pilgrims Only', desc: `${unassignedCount} pilgrims without full allocation`, count: unassignedCount },
                    { id: 'all', label: 'All Pilgrims', desc: 'Re-assign all 850 pilgrims from scratch', count: 850 },
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setScope(opt.id as 'all' | 'unassigned')}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${scope === opt.id ? 'border-primary bg-secondary' : 'border-border hover:bg-muted'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${scope === opt.id ? 'border-primary' : 'border-border'}`}>
                          {scope === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-base p-5 space-y-3">
                <h2 className="text-sm font-bold text-foreground">Summary</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Active rules</span>
                    <span className="font-semibold text-foreground">{rules.filter((r) => r.enabled).length}/{rules.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pilgrims in scope</span>
                    <span className="font-semibold text-foreground">{scope === 'all' ? 850 : unassignedCount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Buses available</span>
                    <span className="font-semibold text-foreground">{buses.filter((b) => b.allocated < b.capacity).length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Hotel rooms free</span>
                    <span className="font-semibold text-foreground">{hotels.reduce((a, h) => a + (h.totalRooms - h.allocatedRooms), 0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Flight seats free</span>
                    <span className="font-semibold text-foreground">{flights.reduce((a, f) => a + (f.passengers - f.confirmed), 0)}</span>
                  </div>
                </div>
              </div>

              <button onClick={runDistribution}
                className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2">
                <Play size={15} />
                Run Auto-Distribution
              </button>
            </div>
          </div>
        )}

        {step === 'running' && (
          <div className="card-base p-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              <Shuffle size={28} className="absolute inset-0 m-auto text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Running Distribution...</h3>
              <p className="text-sm text-muted-foreground mt-1">{progressLabel}</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
              {[
                { icon: Users, label: 'Analyzing', done: progress >= 30 },
                { icon: Bus, label: 'Buses', done: progress >= 60 },
                { icon: Building2, label: 'Hotels', done: progress >= 75 },
                { icon: Plane, label: 'Flights', done: progress >= 88 },
              ].map((s) => (
                <div key={s.label} className={`p-3 rounded-xl border text-center transition-all ${s.done ? 'border-[#16A34A]/30 bg-[#F0FDF4]' : 'border-border bg-muted/30'}`}>
                  <s.icon size={16} className={`mx-auto mb-1 ${s.done ? 'text-[#16A34A]' : 'text-muted-foreground'}`} />
                  <p className={`text-xs font-medium ${s.done ? 'text-[#16A34A]' : 'text-muted-foreground'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-4">
            {/* Result Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-base p-4 text-center border-[#16A34A]/20 bg-[#F0FDF4]">
                <p className="text-3xl font-bold text-[#16A34A]">{assigned}</p>
                <p className="text-xs text-[#16A34A] mt-1">Fully Assigned</p>
              </div>
              <div className="card-base p-4 text-center border-[#D97706]/20 bg-[#FFFBEB]">
                <p className="text-3xl font-bold text-[#D97706]">{partial}</p>
                <p className="text-xs text-[#D97706] mt-1">Partially Assigned</p>
              </div>
              <div className="card-base p-4 text-center border-[#DC2626]/20 bg-[#FEF2F2]">
                <p className="text-3xl font-bold text-[#DC2626]">{failed}</p>
                <p className="text-xs text-[#DC2626] mt-1">Could Not Assign</p>
              </div>
            </div>

            {/* Results Table */}
            <div className="card-base overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Distribution Results — {results.length} pilgrims processed</p>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['Pilgrim ID', 'Name', 'Bus', 'Seat', 'Hotel (Makkah)', 'Room', 'Flight', 'Status'].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.pilgrimId} className="table-row-hover border-b border-border/50 last:border-0">
                        <td className="py-2.5 px-3 font-mono-data text-xs text-muted-foreground">{r.pilgrimId}</td>
                        <td className="py-2.5 px-3 font-medium text-foreground text-sm">{r.name}</td>
                        <td className="py-2.5 px-3 text-sm text-foreground">{r.bus || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2.5 px-3 font-mono-data text-xs text-foreground">{r.seat || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2.5 px-3 text-xs text-muted-foreground truncate max-w-[120px]">{r.hotel || '—'}</td>
                        <td className="py-2.5 px-3 text-sm text-foreground">{r.room || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2.5 px-3 font-mono-data text-xs text-foreground">{r.flight || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2.5 px-3">
                          {r.status === 'assigned' && <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20 font-medium">Assigned</span>}
                          {r.status === 'partial' && <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20 font-medium">Partial</span>}
                          {r.status === 'failed' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20 font-medium" title={r.reason}>Failed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground">Showing {results.length} processed records. Export to view full distribution report.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
