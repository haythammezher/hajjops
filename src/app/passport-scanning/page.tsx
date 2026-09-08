'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';


import { ScanLine, Download, CheckCircle2, AlertTriangle, Camera, FileSpreadsheet, Search, Clock, User, CreditCard } from 'lucide-react';

interface ScannedPassport {
  id: string;
  scannedAt: string;
  pilgrimId?: string;
  surname: string;
  givenNames: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  sex: string;
  expiryDate: string;
  mrzLine1: string;
  mrzLine2: string;
  matchStatus: 'matched' | 'new' | 'mismatch';
  matchedPilgrimName?: string;
}

const mockScanned: ScannedPassport[] = [
  {
    id: 'SCN-001', scannedAt: '09:14:32', pilgrimId: 'PIL-001',
    surname: 'AL-RASHIDI', givenNames: 'AHMAD YUSUF', nationality: 'SAU',
    passportNumber: 'SA7823641', dateOfBirth: '12 JUN 1975', sex: 'M', expiryDate: '15 MAR 2029',
    mrzLine1: 'P<SAUAHMAD<<YUSUF<AL-RASHIDI<<<<<<<<<<<<<<<<<',
    mrzLine2: 'SA78236415SAU7506121M2903154<<<<<<<<<<<<<<06',
    matchStatus: 'matched', matchedPilgrimName: 'Ahmad Yusuf Al-Rashidi',
  },
  {
    id: 'SCN-002', scannedAt: '09:18:07', pilgrimId: 'PIL-002',
    surname: 'BENALI', givenNames: 'FATIMA ZAHRA', nationality: 'MAR',
    passportNumber: 'MA4561237', dateOfBirth: '08 MAR 1978', sex: 'F', expiryDate: '22 JUL 2028',
    mrzLine1: 'P<MARBENALI<<FATIMA<ZAHRA<<<<<<<<<<<<<<<<<<<<',
    mrzLine2: 'MA45612375MAR7803081F2807224<<<<<<<<<<<<<<02',
    matchStatus: 'matched', matchedPilgrimName: 'Fatima Zahra Benali',
  },
  {
    id: 'SCN-003', scannedAt: '09:22:45',
    surname: 'MANSOUR', givenNames: 'HASSAN KHALIL', nationality: 'LBN',
    passportNumber: 'LB8821043', dateOfBirth: '12 MAR 1975', sex: 'M', expiryDate: '10 JAN 2030',
    mrzLine1: 'P<LBNMANSOUR<<HASSAN<KHALIL<<<<<<<<<<<<<<<<<<',
    mrzLine2: 'LB88210435LBN7503121M3001104<<<<<<<<<<<<<<08',
    matchStatus: 'new',
  },
  {
    id: 'SCN-004', scannedAt: '09:31:18', pilgrimId: 'PIL-005',
    surname: 'AL-OTAIBI', givenNames: 'KHALID MANSOUR', nationality: 'KWT',
    passportNumber: 'KW3312984', dateOfBirth: '25 NOV 1971', sex: 'M', expiryDate: '20 JAN 2028',
    mrzLine1: 'P<KWTAL-OTAIBI<<KHALID<MANSOUR<<<<<<<<<<<<<<<<',
    mrzLine2: 'KW33129845KWT7111251M2801204<<<<<<<<<<<<<<04',
    matchStatus: 'mismatch', matchedPilgrimName: 'Khalid Mansour Al-Otaibi',
  },
];

const matchColors: Record<string, string> = {
  matched: 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20',
  new: 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20',
  mismatch: 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20',
};

const matchLabels: Record<string, string> = {
  matched: 'Matched',
  new: 'New Pilgrim',
  mismatch: 'Data Mismatch',
};

export default function PassportScanningPage() {
  const [scannedList, setScannedList] = useState<ScannedPassport[]>(mockScanned);
  const [selectedScan, setSelectedScan] = useState<ScannedPassport | null>(mockScanned[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMatch, setFilterMatch] = useState('all');

  const stats = {
    total: scannedList.length,
    matched: scannedList.filter((s) => s.matchStatus === 'matched').length,
    newPilgrims: scannedList.filter((s) => s.matchStatus === 'new').length,
    mismatches: scannedList.filter((s) => s.matchStatus === 'mismatch').length,
  };

  const filtered = scannedList.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.surname.toLowerCase().includes(q) || s.passportNumber.toLowerCase().includes(q) || s.givenNames.toLowerCase().includes(q);
    const matchFilter = filterMatch === 'all' || s.matchStatus === filterMatch;
    return matchSearch && matchFilter;
  });

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newScan: ScannedPassport = {
        id: `SCN-${String(scannedList.length + 1).padStart(3, '0')}`,
        scannedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
        surname: 'AL-TUNISI', givenNames: 'IBRAHIM', nationality: 'TUN',
        passportNumber: 'TN8834521', dateOfBirth: '05 JAN 1973', sex: 'M', expiryDate: '14 AUG 2030',
        mrzLine1: 'P<TUNAL-TUNISI<<IBRAHIM<<<<<<<<<<<<<<<<<<<<<<<',
        mrzLine2: 'TN88345215TUN7301051M3008144<<<<<<<<<<<<<<02',
        matchStatus: 'matched', matchedPilgrimName: 'Ibrahim Al-Tunisi', pilgrimId: 'PIL-009',
      };
      setScannedList((prev) => [newScan, ...prev]);
      setSelectedScan(newScan);
      setIsScanning(false);
    }, 2500);
  };

  const exportToExcel = () => {
    const headers = ['Scan ID', 'Scanned At', 'Surname', 'Given Names', 'Nationality', 'Passport #', 'Date of Birth', 'Sex', 'Expiry Date', 'MRZ Line 1', 'MRZ Line 2', 'Match Status', 'Matched Pilgrim', 'Pilgrim ID'];
    const rows = scannedList.map((s) => [s.id, s.scannedAt, s.surname, s.givenNames, s.nationality, s.passportNumber, s.dateOfBirth, s.sex, s.expiryDate, s.mrzLine1, s.mrzLine2, s.matchStatus, s.matchedPilgrimName || '', s.pilgrimId || '']);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passport-scans-hajj2027.csv';
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
              <ScanLine size={20} className="text-primary" />
              Passport Scanning & MRZ Reader
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Scan passports, read MRZ data, match to registry — export to Excel</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportToExcel} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
            <button onClick={simulateScan} disabled={isScanning}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-70">
              {isScanning ? (
                <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Scanning...</>
              ) : (
                <><Camera size={14} />Scan Passport</>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Scanned', value: stats.total, color: 'text-foreground' },
            { label: 'Matched', value: stats.matched, color: 'text-[#16A34A]' },
            { label: 'New Pilgrims', value: stats.newPilgrims, color: 'text-[#2563EB]' },
            { label: 'Data Mismatches', value: stats.mismatches, color: 'text-[#DC2626]' },
          ].map((s) => (
            <div key={s.label} className="card-base p-4">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Scan List */}
          <div className="lg:col-span-2 space-y-3">
            {/* Scanner Viewport */}
            <div className={`relative rounded-xl border-2 overflow-hidden h-40 flex items-center justify-center transition-all ${isScanning ? 'border-primary bg-secondary' : 'border-dashed border-border bg-muted/30'}`}>
              {isScanning ? (
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                    <ScanLine size={24} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <p className="text-sm font-medium text-primary">Reading MRZ data...</p>
                  <p className="text-xs text-muted-foreground">Hold passport steady</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Scanner Ready</p>
                  <p className="text-xs text-muted-foreground">Click "Scan Passport" to begin</p>
                </div>
              )}
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/60 rounded-tl" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/60 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/60 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/60 rounded-br" />
            </div>

            {/* Search + Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search scans..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <select value={filterMatch} onChange={(e) => setFilterMatch(e.target.value)}
                className="px-2 py-1.5 text-xs border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="all">All</option>
                <option value="matched">Matched</option>
                <option value="new">New</option>
                <option value="mismatch">Mismatch</option>
              </select>
            </div>

            {/* Scan List */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin">
              {filtered.map((scan) => (
                <button key={scan.id} onClick={() => setSelectedScan(scan)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedScan?.id === scan.id ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{scan.givenNames} {scan.surname}</p>
                      <p className="font-mono-data text-xs text-muted-foreground">{scan.passportNumber} · {scan.nationality}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${matchColors[scan.matchStatus]}`}>{matchLabels[scan.matchStatus]}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    <Clock size={10} />
                    <span>Today {scan.scannedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Detail */}
          <div className="lg:col-span-3">
            {selectedScan ? (
              <div className="card-base p-5 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{selectedScan.givenNames} {selectedScan.surname}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Scanned today at {selectedScan.scannedAt}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${matchColors[selectedScan.matchStatus]}`}>{matchLabels[selectedScan.matchStatus]}</span>
                </div>

                {/* Passport Data Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Surname', value: selectedScan.surname },
                    { label: 'Given Names', value: selectedScan.givenNames },
                    { label: 'Passport Number', value: selectedScan.passportNumber, mono: true },
                    { label: 'Nationality', value: selectedScan.nationality },
                    { label: 'Date of Birth', value: selectedScan.dateOfBirth },
                    { label: 'Sex', value: selectedScan.sex === 'M' ? 'Male' : 'Female' },
                    { label: 'Expiry Date', value: selectedScan.expiryDate },
                    { label: 'Scan ID', value: selectedScan.id, mono: true },
                  ].map((field) => (
                    <div key={field.label} className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                      <p className={`text-sm font-semibold text-foreground ${field.mono ? 'font-mono-data' : ''}`}>{field.value}</p>
                    </div>
                  ))}
                </div>

                {/* MRZ Data */}
                <div className="p-4 rounded-xl bg-[#0F172A] border border-border">
                  <p className="text-xs font-medium text-[#94A3B8] mb-2 uppercase tracking-wide">MRZ — Machine Readable Zone</p>
                  <p className="font-mono text-xs text-[#22D3EE] tracking-widest leading-relaxed break-all">{selectedScan.mrzLine1}</p>
                  <p className="font-mono text-xs text-[#22D3EE] tracking-widest leading-relaxed break-all mt-1">{selectedScan.mrzLine2}</p>
                </div>

                {/* Match Info */}
                {selectedScan.matchStatus === 'matched' && selectedScan.matchedPilgrimName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#16A34A]/20">
                    <CheckCircle2 size={18} className="text-[#16A34A] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#16A34A]">Matched to registry</p>
                      <p className="text-xs text-[#16A34A]/80">{selectedScan.matchedPilgrimName} · {selectedScan.pilgrimId}</p>
                    </div>
                  </div>
                )}
                {selectedScan.matchStatus === 'new' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20">
                    <User size={18} className="text-[#2563EB] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#2563EB]">New pilgrim — not in registry</p>
                      <p className="text-xs text-[#2563EB]/80">Add to registry to complete registration</p>
                    </div>
                    <button className="btn-primary text-xs px-3 py-1.5 flex-shrink-0">Add to Registry</button>
                  </div>
                )}
                {selectedScan.matchStatus === 'mismatch' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/20">
                    <AlertTriangle size={18} className="text-[#DC2626] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#DC2626]">Data mismatch detected</p>
                      <p className="text-xs text-[#DC2626]/80">Scanned data differs from registry record for {selectedScan.matchedPilgrimName}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={exportToExcel} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                    <Download size={12} />Export This Scan
                  </button>
                  {selectedScan.pilgrimId && (
                    <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <CreditCard size={12} />View Pilgrim Profile
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card-base p-12 text-center">
                <ScanLine size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Select a scan to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
