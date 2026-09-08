'use client';

import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { ScanLine, Download, CheckCircle2, AlertTriangle, Camera, FileSpreadsheet, Search, Clock, User, CreditCard, Upload, ImageIcon, XCircle } from 'lucide-react';

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
  imagePreview?: string;
}

const mockScanResults: Omit<ScannedPassport, 'id' | 'scannedAt' | 'imagePreview'>[] = [
  {
    surname: 'AL-TUNISI', givenNames: 'IBRAHIM HASSAN', nationality: 'TUN',
    passportNumber: 'TN8834521', dateOfBirth: '05 JAN 1973', sex: 'M', expiryDate: '14 AUG 2030',
    mrzLine1: 'P<TUNAL-TUNISI<<IBRAHIM<HASSAN<<<<<<<<<<<<<<<',
    mrzLine2: 'TN88345215TUN7301051M3008144<<<<<<<<<<<<<<02',
    matchStatus: 'matched', matchedPilgrimName: 'Ibrahim Hassan Al-Tunisi', pilgrimId: 'PIL-009',
  },
  {
    surname: 'KHALIL', givenNames: 'MARIAM NOUR', nationality: 'LBN',
    passportNumber: 'LB9912345', dateOfBirth: '22 SEP 1985', sex: 'F', expiryDate: '30 OCT 2031',
    mrzLine1: 'P<LBNKHALIL<<MARIAM<NOUR<<<<<<<<<<<<<<<<<<<<<',
    mrzLine2: 'LB99123456LBN8509221F3110304<<<<<<<<<<<<<<07',
    matchStatus: 'new',
  },
  {
    surname: 'AL-ZAHRANI', givenNames: 'OMAR FAISAL', nationality: 'SAU',
    passportNumber: 'SA6612987', dateOfBirth: '14 FEB 1968', sex: 'M', expiryDate: '05 MAY 2029',
    mrzLine1: 'P<SAUOMAR<<FAISAL<AL-ZAHRANI<<<<<<<<<<<<<<<<<',
    mrzLine2: 'SA66129875SAU6802141M2905054<<<<<<<<<<<<<<03',
    matchStatus: 'matched', matchedPilgrimName: 'Omar Faisal Al-Zahrani', pilgrimId: 'PIL-014',
  },
  {
    surname: 'BOUAZZA', givenNames: 'YOUSSEF AMINE', nationality: 'MAR',
    passportNumber: 'MA7723456', dateOfBirth: '30 JUL 1980', sex: 'M', expiryDate: '18 DEC 2028',
    mrzLine1: 'P<MARBOUAZZA<<YOUSSEF<AMINE<<<<<<<<<<<<<<<<<',
    mrzLine2: 'MA77234565MAR8007301M2812184<<<<<<<<<<<<<<05',
    matchStatus: 'mismatch', matchedPilgrimName: 'Youssef Bouazza',
  },
  {
    surname: 'AL-DOSARI', givenNames: 'SARA ABDULAZIZ', nationality: 'QAT',
    passportNumber: 'QA5534871', dateOfBirth: '11 APR 1990', sex: 'F', expiryDate: '22 MAR 2032',
    mrzLine1: 'P<QATAL-DOSARI<<SARA<ABDULAZIZ<<<<<<<<<<<<<<<',
    mrzLine2: 'QA55348715QAT9004111F3203224<<<<<<<<<<<<<<09',
    matchStatus: 'new',
  },
  {
    surname: 'HASSAN', givenNames: 'AMIRA MAHMOUD', nationality: 'EGY',
    passportNumber: 'EG3345678', dateOfBirth: '07 DEC 1977', sex: 'F', expiryDate: '01 JUN 2030',
    mrzLine1: 'P<EGYHASSAN<<AMIRA<MAHMOUD<<<<<<<<<<<<<<<<<<',
    mrzLine2: 'EG33456785EGY7712071F3006014<<<<<<<<<<<<<<06',
    matchStatus: 'matched', matchedPilgrimName: 'Amira Mahmoud Hassan', pilgrimId: 'PIL-022',
  },
];

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
  const [scanError, setScanError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterMatch, setFilterMatch] = useState('all');
  const [scanResultIndex, setScanResultIndex] = useState(0);
  const [registryAdded, setRegistryAdded] = useState<Set<string>>(new Set());
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  /** Scan using real AI vision — called when user uploads/captures an image */
  const processRealImage = async (imageDataUrl: string) => {
    setIsScanning(true);
    setScanError(null);
    setUploadedImage(imageDataUrl);

    try {
      const res = await fetch('/api/passport-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error ?? 'Failed to read passport image');
      }

      const d = json.data as {
        surname: string;
        givenNames: string;
        nationality: string;
        passportNumber: string;
        dateOfBirth: string;
        sex: string;
        expiryDate: string;
        mrzLine1: string;
        mrzLine2: string;
      };

      const newScan: ScannedPassport = {
        id: `SCN-${String(scannedList.length + 1).padStart(3, '0')}`,
        scannedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
        surname: d.surname ?? 'UNKNOWN',
        givenNames: d.givenNames ?? 'UNKNOWN',
        nationality: d.nationality ?? '---',
        passportNumber: d.passportNumber ?? '---',
        dateOfBirth: d.dateOfBirth ?? '---',
        sex: d.sex ?? 'M',
        expiryDate: d.expiryDate ?? '---',
        mrzLine1: d.mrzLine1 ?? '',
        mrzLine2: d.mrzLine2 ?? '',
        matchStatus: 'new',
        imagePreview: imageDataUrl,
      };

      setScannedList((prev) => [newScan, ...prev]);
      setSelectedScan(newScan);
    } catch (err: any) {
      setScanError(err?.message ?? 'Could not read passport. Please try a clearer image.');
    } finally {
      setIsScanning(false);
      setUploadedImage(null);
    }
  };

  /** Simulate scan — cycles through mock data (demo only) */
  const processMockScan = () => {
    setIsScanning(true);
    setScanError(null);
    setUploadedImage(null);
    setTimeout(() => {
      const result = mockScanResults[scanResultIndex % mockScanResults.length];
      setScanResultIndex((prev) => prev + 1);
      const newScan: ScannedPassport = {
        ...result,
        id: `SCN-${String(scannedList.length + 1).padStart(3, '0')}`,
        scannedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };
      setScannedList((prev) => [newScan, ...prev]);
      setSelectedScan(newScan);
      setIsScanning(false);
    }, 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      processRealImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addToRegistry = (scan: ScannedPassport) => {
    const newId = `PIL-${String(100 + scannedList.length).padStart(3, '0')}`;
    setScannedList((prev) =>
      prev.map((s) =>
        s.id === scan.id
          ? { ...s, matchStatus: 'matched', matchedPilgrimName: `${scan.givenNames} ${scan.surname}`, pilgrimId: newId }
          : s
      )
    );
    setSelectedScan((prev) =>
      prev?.id === scan.id
        ? { ...prev, matchStatus: 'matched', matchedPilgrimName: `${scan.givenNames} ${scan.surname}`, pilgrimId: newId }
        : prev
    );
    setRegistryAdded((prev) => new Set(prev).add(scan.id));
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
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={exportToExcel} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-70"
            >
              <Upload size={14} />
              Upload Image
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isScanning}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-70"
            >
              <Camera size={14} />
              Use Camera
            </button>
            <button
              onClick={processMockScan}
              disabled={isScanning}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-2 disabled:opacity-70"
            >
              {isScanning ? (
                <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Scanning...</>
              ) : (
                <><ScanLine size={14} />Simulate Scan</>
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
            <div
              className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                isScanning
                  ? 'border-primary bg-secondary h-48'
                  : scanError
                  ? 'border-[#DC2626] bg-[#FEF2F2] h-44'
                  : 'border-dashed border-border bg-muted/30 h-44'
              }`}
            >
              {isScanning ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                    <ScanLine size={24} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <p className="text-sm font-medium text-primary">Reading MRZ data...</p>
                  <p className="text-xs text-muted-foreground">AI is analysing passport image</p>
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-bounce" style={{ top: '60%' }} />
                </div>
              ) : scanError ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 p-4">
                  <XCircle size={28} className="text-[#DC2626]" />
                  <p className="text-sm font-semibold text-[#DC2626] text-center">Scan Failed</p>
                  <p className="text-xs text-[#DC2626]/80 text-center">{scanError}</p>
                  <button
                    onClick={() => setScanError(null)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#DC2626]/30 text-[#DC2626] font-medium mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 p-4">
                  <Camera size={28} className="text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground text-center">Scanner Ready</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Use <strong>Camera</strong> to capture, <strong>Upload Image</strong> to select a file, or <strong>Simulate Scan</strong> for demo
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-1"
                    >
                      <Camera size={11} /> Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-medium flex items-center gap-1"
                    >
                      <ImageIcon size={11} /> Upload
                    </button>
                  </div>
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
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No scans found</div>
              ) : (
                filtered.map((scan) => (
                  <button key={scan.id} onClick={() => setSelectedScan(scan)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedScan?.id === scan.id ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{scan.givenNames} {scan.surname}</p>
                        <p className="font-mono text-xs text-muted-foreground">{scan.passportNumber} · {scan.nationality}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${matchColors[scan.matchStatus]}`}>{matchLabels[scan.matchStatus]}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <Clock size={10} />
                      <span>Today {scan.scannedAt}</span>
                    </div>
                  </button>
                ))
              )}
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

                {/* Uploaded image preview */}
                {selectedScan.imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-border h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedScan.imagePreview} alt="Scanned passport" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 text-white text-xs font-medium">
                      <CheckCircle2 size={12} /> MRZ extracted from image
                    </div>
                  </div>
                )}

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
                      <p className={`text-sm font-semibold text-foreground ${field.mono ? 'font-mono' : ''}`}>{field.value}</p>
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
                      <p className="text-xs text-[#2563EB]/80">
                        {registryAdded.has(selectedScan.id)
                          ? 'Successfully added to registry' :'Add to registry to complete registration'}
                      </p>
                    </div>
                    {!registryAdded.has(selectedScan.id) && (
                      <button
                        onClick={() => addToRegistry(selectedScan)}
                        className="btn-primary text-xs px-3 py-1.5 flex-shrink-0"
                      >
                        Add to Registry
                      </button>
                    )}
                    {registryAdded.has(selectedScan.id) && (
                      <span className="flex items-center gap-1 text-xs text-[#16A34A] font-medium flex-shrink-0">
                        <CheckCircle2 size={13} /> Added
                      </span>
                    )}
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
