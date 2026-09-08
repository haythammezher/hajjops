'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { pilgrims, campaignStats, groupLeaders } from '@/lib/mockData';
import { Search, CheckCircle2, XCircle, Clock, ScanLine, RefreshCw, ChevronRight, Wifi, WifiOff } from 'lucide-react';

interface CheckInRecord {
  pilgrimId: string;
  name: string;
  group: string;
  time: string;
  status: 'success' | 'already' | 'not-found';
}

const SCAN_DELAY = 1800;

export default function QRCheckInPage() {
  const [scanMode, setScanMode] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedPilgrim, setScannedPilgrim] = useState<(typeof pilgrims)[0] | null>(null);
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set(['PIL-001', 'PIL-002', 'PIL-004', 'PIL-007', 'PIL-009', 'PIL-011', 'PIL-012']));
  const [recentScans, setRecentScans] = useState<CheckInRecord[]>([
    { pilgrimId: 'PIL-012', name: 'Sumayyah Al-Ghamdi', group: 'GRP-001', time: '2 min ago', status: 'success' },
    { pilgrimId: 'PIL-011', name: 'Abdulrahman Siddiqui', group: 'GRP-008', time: '5 min ago', status: 'success' },
    { pilgrimId: 'PIL-009', name: 'Ibrahim Al-Tunisi', group: 'GRP-005', time: '11 min ago', status: 'success' },
    { pilgrimId: 'PIL-007', name: 'Yusuf Abdullahi Musa', group: 'GRP-005', time: '18 min ago', status: 'success' },
    { pilgrimId: 'PIL-001', name: 'Ahmad Yusuf Al-Rashidi', group: 'GRP-001', time: '24 min ago', status: 'success' },
  ]);
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');
  const [isOnline, setIsOnline] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  const totalCheckedIn = checkedIn.size;
  const totalPilgrims = campaignStats.totalPilgrims;
  const checkInPct = Math.round((totalCheckedIn / totalPilgrims) * 100);

  const simulateScan = useCallback(() => {
    setScanMode('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 8;
      });
    }, SCAN_DELAY / 12);

    setTimeout(() => {
      clearInterval(interval);
      const notCheckedIn = pilgrims.filter((p) => !checkedIn.has(p.id));
      const target = notCheckedIn.length > 0 ? notCheckedIn[Math.floor(Math.random() * notCheckedIn.length)] : pilgrims[0];
      setScannedPilgrim(target);
      setScanMode('result');
    }, SCAN_DELAY);
  }, [checkedIn]);

  const confirmCheckIn = () => {
    if (!scannedPilgrim) return;
    const alreadyIn = checkedIn.has(scannedPilgrim.id);
    const newRecord: CheckInRecord = {
      pilgrimId: scannedPilgrim.id,
      name: scannedPilgrim.name,
      group: scannedPilgrim.groupId,
      time: 'Just now',
      status: alreadyIn ? 'already' : 'success',
    };
    if (!alreadyIn) {
      setCheckedIn((prev) => new Set([...prev, scannedPilgrim.id]));
    }
    setRecentScans((prev) => [newRecord, ...prev.slice(0, 9)]);
    setScanMode('idle');
    setScannedPilgrim(null);
  };

  const handleManualSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    const found = pilgrims.find(
      (p) => p.id.toLowerCase() === q || p.name.toLowerCase().includes(q) || p.passportNumber.toLowerCase() === q
    );
    if (found) {
      setScannedPilgrim(found);
      setScanMode('result');
    }
  };

  const groupCheckinStats = groupLeaders.slice(0, 6).map((gl) => {
    const groupPilgrims = pilgrims.filter((p) => p.groupId === gl.groupId);
    const groupChecked = groupPilgrims.filter((p) => checkedIn.has(p.id)).length;
    return { ...gl, checked: groupChecked, total: gl.pilgrimCount, pct: Math.round((groupChecked / gl.pilgrimCount) * 100) };
  });

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider">Live</span>
            <span className="text-muted-foreground text-sm">Hajj 2027 · Departure Day</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">QR Check-in</h1>
          <p className="text-sm text-muted-foreground mt-1">Scan pilgrim QR codes or search manually to record attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isOnline ? 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20' : 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20'}`}
          >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isOnline ? 'Online' : 'Offline Mode'}
          </button>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCw size={14} />
            Sync
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-base border-l-4 border-l-primary">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Checked In</p>
          <p className="text-3xl font-bold text-primary tabular-nums">{totalCheckedIn}</p>
          <p className="text-xs text-muted-foreground mt-1">{checkInPct}% of total</p>
        </div>
        <div className="card-base">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Remaining</p>
          <p className="text-3xl font-bold text-foreground tabular-nums">{totalPilgrims - totalCheckedIn}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting check-in</p>
        </div>
        <div className="card-base">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Today's Scans</p>
          <p className="text-3xl font-bold text-foreground tabular-nums">{recentScans.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Last: {recentScans[0]?.time ?? '—'}</p>
        </div>
        <div className="card-base border border-[#DC2626]/20 bg-[#FEF2F2]">
          <p className="text-xs font-500 uppercase tracking-wide text-[#DC2626] mb-2">Absent</p>
          <p className="text-3xl font-bold text-[#DC2626] tabular-nums">{pilgrims.filter((p) => p.attendanceStatus === 'absent').length}</p>
          <p className="text-xs text-[#DC2626]/70 mt-1">Flagged absent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scanner Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tab Toggle */}
          <div className="card-base">
            <div className="flex gap-1 p-1 bg-muted rounded-lg mb-5 w-fit">
              {(['scanner', 'manual'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setScanMode('idle'); setScannedPilgrim(null); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {tab === 'scanner' ? '📷 QR Scanner' : '🔍 Manual Search'}
                </button>
              ))}
            </div>

            {activeTab === 'scanner' && (
              <div className="flex flex-col items-center">
                {/* Scanner Viewport */}
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-primary/30 bg-[#0A1A12] mb-5">
                  {scanMode === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="qr-pattern w-24 h-24 opacity-40" />
                      <p className="text-xs text-[#16A34A]/70 font-medium">Ready to scan</p>
                    </div>
                  )}
                  {scanMode === 'scanning' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="qr-pattern w-24 h-24 opacity-80 animate-pulse" />
                      <div className="w-48 h-1 bg-[#1B6B4A]/30 rounded-full overflow-hidden">
                        <div className="h-full bg-[#16A34A] rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <p className="text-xs text-[#16A34A] font-medium animate-pulse">Scanning…</p>
                    </div>
                  )}
                  {scanMode === 'result' && scannedPilgrim && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                      <CheckCircle2 size={40} className="text-[#16A34A]" />
                      <p className="text-[#16A34A] text-xs font-semibold text-center">QR Detected</p>
                      <p className="text-white text-xs text-center font-mono">{scannedPilgrim.id}</p>
                    </div>
                  )}
                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#16A34A] rounded-tl" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#16A34A] rounded-tr" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#16A34A] rounded-bl" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#16A34A] rounded-br" />
                  {scanMode === 'scanning' && (
                    <div className="absolute left-4 right-4 h-0.5 bg-[#16A34A] shadow-[0_0_8px_#16A34A] animate-bounce" style={{ top: '50%' }} />
                  )}
                </div>

                {scanMode === 'idle' && (
                  <button onClick={simulateScan} className="btn-primary flex items-center gap-2">
                    <ScanLine size={16} />
                    Start Scanning
                  </button>
                )}
                {scanMode === 'scanning' && (
                  <button onClick={() => setScanMode('idle')} className="btn-secondary flex items-center gap-2">
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name, ID, or passport number…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button onClick={handleManualSearch} className="btn-primary text-sm">Search</button>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                  {pilgrims.filter((p) => {
                    const q = searchQuery.toLowerCase();
                    return q && (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.passportNumber.toLowerCase().includes(q));
                  }).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setScannedPilgrim(p); setScanMode('result'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors border border-border"
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">{p.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.id} · {p.groupLeader}</p>
                      </div>
                      {checkedIn.has(p.id) && <CheckCircle2 size={14} className="text-[#16A34A] flex-shrink-0" />}
                      <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result Panel */}
            {scanMode === 'result' && scannedPilgrim && (
              <div className={`mt-5 rounded-xl border-2 p-4 ${checkedIn.has(scannedPilgrim.id) ? 'border-[#D97706]/40 bg-[#FFFBEB]' : 'border-[#16A34A]/40 bg-[#F0FDF4]'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${checkedIn.has(scannedPilgrim.id) ? 'bg-[#FEF9C3]' : 'bg-[#DCFCE7]'}`}>
                    {checkedIn.has(scannedPilgrim.id)
                      ? <Clock size={22} className="text-[#D97706]" />
                      : <CheckCircle2 size={22} className="text-[#16A34A]" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${checkedIn.has(scannedPilgrim.id) ? 'text-[#D97706]' : 'text-[#16A34A]'}`}>
                      {checkedIn.has(scannedPilgrim.id) ? 'Already Checked In' : 'Ready to Check In'}
                    </p>
                    <p className="text-base font-bold text-foreground mt-0.5">{scannedPilgrim.name}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{scannedPilgrim.id}</span>
                      <span>·</span>
                      <span>{scannedPilgrim.nationality}</span>
                      <span>·</span>
                      <span>Bus #{scannedPilgrim.busNumber ?? '—'} · Seat {scannedPilgrim.seatNumber ?? '—'}</span>
                      <span>·</span>
                      <span>Room {scannedPilgrim.roomNumber ?? '—'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Group: {scannedPilgrim.groupLeader}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={confirmCheckIn} className="btn-primary text-sm flex-1">
                    {checkedIn.has(scannedPilgrim.id) ? 'Acknowledge & Continue' : '✓ Confirm Check-in'}
                  </button>
                  <button onClick={() => { setScanMode('idle'); setScannedPilgrim(null); }} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Group Progress */}
          <div className="card-base">
            <h3 className="text-sm font-semibold text-foreground mb-4">Check-in by Group</h3>
            <div className="space-y-3">
              {groupCheckinStats.map((g) => (
                <div key={g.id} className="flex items-center gap-3">
                  <div className="w-28 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{g.name.replace('Sheikh ', '')}</p>
                    <p className="text-xs text-muted-foreground">{g.groupId}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                      <div className="bg-primary rounded-full transition-all" style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right w-20 flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground tabular-nums">{g.checked}/{g.total}</span>
                    <span className="text-xs text-muted-foreground ml-1">({g.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="card-base h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Scans</h3>
            <span className="text-xs text-muted-foreground">{recentScans.length} today</span>
          </div>
          <div className="space-y-2.5">
            {recentScans.map((scan, i) => (
              <div key={`${scan.pilgrimId}-${i}`} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${scan.status === 'success' ? 'bg-[#F0FDF4]' : scan.status === 'already' ? 'bg-[#FFFBEB]' : 'bg-[#FEF2F2]'}`}>
                  {scan.status === 'success'
                    ? <CheckCircle2 size={13} className="text-[#16A34A]" />
                    : scan.status === 'already'
                    ? <Clock size={13} className="text-[#D97706]" />
                    : <XCircle size={13} className="text-[#DC2626]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{scan.name}</p>
                  <p className="text-xs text-muted-foreground">{scan.group} · {scan.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground">Overall Progress</p>
              <p className="text-xs font-semibold text-primary">{checkInPct}%</p>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${checkInPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{totalCheckedIn} of {totalPilgrims} pilgrims checked in</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
