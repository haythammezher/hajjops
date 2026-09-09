'use client';

import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { pilgrims, type Pilgrim } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Upload, Download, Search, FileSpreadsheet, CheckCircle2, AlertTriangle, X, Filter } from 'lucide-react';

interface ImportedPilgrim {
  row: number;
  name: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  groupLeader: string;
  status: 'valid' | 'error' | 'duplicate';
  error?: string;
}

const CSV_TEMPLATE_HEADERS = ['Name', 'Passport Number', 'Nationality', 'Date of Birth (DD/MM/YYYY)', 'Gender (M/F)', 'Phone', 'Email', 'Group Leader', 'Emergency Contact', 'Emergency Phone', 'Payment Total (USD)', 'Room Type (single/double/triple/quad)'];

const mockImportPreview: ImportedPilgrim[] = [
  { row: 1, name: 'Hassan Khalil Mansour', passportNumber: 'LB8821043', nationality: 'Lebanon', dateOfBirth: '12/03/1975', gender: 'M', phone: '+961-3-123456', email: 'hassan.m@email.com', groupLeader: 'Sheikh Ahmed Al-Rashidi', status: 'valid' },
  { row: 2, name: 'Fatima Nour Al-Din', passportNumber: 'LB9934521', nationality: 'Lebanon', dateOfBirth: '08/07/1982', gender: 'F', phone: '+961-70-234567', email: 'fatima.nd@email.com', groupLeader: 'Sheikh Ahmed Al-Rashidi', status: 'valid' },
  { row: 3, name: 'Ahmad Yusuf Al-Rashidi', passportNumber: 'SA7823641', nationality: 'Saudi Arabia', dateOfBirth: '12/06/1975', gender: 'M', phone: '+966-55-123-4567', email: 'ahmad.rashidi@email.com', groupLeader: 'Sheikh Ahmed Al-Rashidi', status: 'duplicate', error: 'Passport SA7823641 already registered (PIL-001)' },
  { row: 4, name: 'Omar Saad Berri', passportNumber: 'LB7712398', nationality: 'Lebanon', dateOfBirth: '25/11/1968', gender: 'M', phone: '+961-3-345678', email: 'omar.berri@email.com', groupLeader: 'Sheikh Tariq Hussain', status: 'valid' },
  { row: 5, name: 'Mariam Joumaa', passportNumber: '', nationality: 'Lebanon', dateOfBirth: '14/02/1990', gender: 'F', phone: '+961-76-456789', email: 'mariam.j@email.com', groupLeader: 'Sheikh Tariq Hussain', status: 'error', error: 'Passport number is required' },
];

export default function PilgrimRegistryPage() {
  const [registryPilgrims] = useState<Pilgrim[]>(pilgrims);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'done'>('upload');
  const [importPreview, setImportPreview] = useState<ImportedPilgrim[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = registryPilgrims.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(q) || p.passportNumber.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || p.passportStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: 850,
    verified: registryPilgrims.filter((p) => p.passportStatus === 'verified').length,
    scanned: registryPilgrims.filter((p) => p.passportStatus === 'scanned').length,
    missing: registryPilgrims.filter((p) => p.passportStatus === 'missing').length,
    pending: registryPilgrims.filter((p) => p.passportStatus === 'pending').length,
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateImport();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateImport();
  };

  const simulateImport = () => {
    setImportPreview(mockImportPreview);
    setImportStep('preview');
  };

  const handleConfirmImport = () => {
    setImportStep('done');
  };

  const downloadTemplate = () => {
    const csv = CSV_TEMPLATE_HEADERS.join(',') + '\n' + 'Hassan Khalil,LB1234567,Lebanon,12/03/1975,M,+961-3-123456,hassan@email.com,Sheikh Ahmed,Emergency Name,+961-3-999999,3500,double';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pilgrim-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRegistry = () => {
    const headers = ['Pilgrim ID', 'Name', 'Nationality', 'Passport #', 'Passport Status', 'Visa Status', 'Flight', 'Hotel Makkah', 'Room #', 'Bus #', 'Group Leader', 'Payment Status', 'Registered At'];
    const rows = registryPilgrims.map((p) => [p.id, p.name, p.nationality, p.passportNumber, p.passportStatus, p.visaStatus, p.flightNumber || '', p.hotelMakkah || '', p.roomNumber || '', p.busNumber || '', p.groupLeader, p.paymentStatus, p.registeredAt]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pilgrim-registry-hajj2027.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = importPreview.filter((p) => p.status === 'valid').length;
  const errorCount = importPreview.filter((p) => p.status === 'error').length;
  const dupCount = importPreview.filter((p) => p.status === 'duplicate').length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />
              Pilgrim Registry
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Official registry — Hajj 2027 · Import CSV/Excel · Export records</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadTemplate} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <Download size={14} />
              Download Template
            </button>
            <button onClick={() => { setShowImportModal(true); setImportStep('upload'); }} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
              <Upload size={14} />
              Import CSV/Excel
            </button>
            <button onClick={exportRegistry} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
              <Download size={14} />
              Export Registry
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Registered', value: stats.total, color: 'text-foreground', bg: '' },
            { label: 'Passport Verified', value: stats.verified, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
            { label: 'Scanned Only', value: stats.scanned, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
            { label: 'Pending Scan', value: stats.pending, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
            { label: 'Missing Passport', value: stats.missing, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
          ].map((s) => (
            <div key={s.label} className={`card-base p-4 ${s.bg}`}>
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search by name, passport #, or pilgrim ID..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'verified', 'scanned', 'pending', 'missing'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-input'}`}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Registry Table */}
        <div className="card-base overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Registry — {filtered.length} records shown</p>
            <span className="text-xs text-muted-foreground">Showing {Math.min(filtered.length, 12)} of {stats.total} total pilgrims</span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Pilgrim ID', 'Name', 'Nationality', 'Passport #', 'Passport', 'Visa', 'Flight', 'Hotel (Makkah)', 'Bus', 'Group Leader', 'Payment', 'Registered'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="table-row-hover border-b border-border/50 last:border-0">
                    <td className="py-2.5 px-3 font-mono-data text-xs text-muted-foreground">{p.id}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground text-sm whitespace-nowrap">{p.name}</td>
                    <td className="py-2.5 px-3 text-sm text-muted-foreground">{p.nationality}</td>
                    <td className="py-2.5 px-3 font-mono-data text-xs text-foreground">{p.passportNumber}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={p.passportStatus as 'verified' | 'pending'} size="sm" /></td>
                    <td className="py-2.5 px-3"><StatusBadge status={p.visaStatus as 'approved' | 'pending' | 'rejected' | 'processing'} size="sm" /></td>
                    <td className="py-2.5 px-3 font-mono-data text-xs text-foreground">{p.flightNumber || <span className="text-muted-foreground">—</span>}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground truncate max-w-[120px]">{p.hotelMakkah || '—'}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">{p.busNumber ? `Bus #${p.busNumber}` : '—'}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground truncate max-w-[120px]">{p.groupLeader}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={p.paymentStatus as 'paid' | 'partial' | 'overdue' | 'pending'} size="sm" /></td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">{p.registeredAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">Registry contains {stats.total} pilgrims total. Showing first {filtered.length} results. Export to view full registry.</p>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Import Pilgrims from CSV / Excel</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Step {importStep === 'upload' ? '1' : importStep === 'preview' ? '2' : '3'} of 3</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><X size={16} /></button>
            </div>

            <div className="p-6">
              {importStep === 'upload' && (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                    <Upload size={32} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Drop your CSV or Excel file here</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse — supports .csv, .xlsx, .xls</p>
                    <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <FileSpreadsheet size={20} className="text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Need the import template?</p>
                      <p className="text-xs text-muted-foreground">Download our pre-formatted CSV template with all required columns</p>
                    </div>
                    <button onClick={downloadTemplate} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0">
                      <Download size={12} /> Template
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Required columns:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CSV_TEMPLATE_HEADERS.map((h) => (
                        <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{h}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {importStep === 'preview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#16A34A]/20 text-center">
                      <p className="text-2xl font-bold text-[#16A34A]">{validCount}</p>
                      <p className="text-xs text-[#16A34A]">Valid records</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/20 text-center">
                      <p className="text-2xl font-bold text-[#DC2626]">{errorCount}</p>
                      <p className="text-xs text-[#DC2626]">Errors</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#D97706]/20 text-center">
                      <p className="text-2xl font-bold text-[#D97706]">{dupCount}</p>
                      <p className="text-xs text-[#D97706]">Duplicates</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin rounded-xl border border-border">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {['Row', 'Name', 'Passport #', 'Nationality', 'Group Leader', 'Status'].map((h) => (
                            <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row) => (
                          <tr key={row.row} className={`border-b border-border/50 last:border-0 ${row.status === 'error' ? 'bg-[#FEF2F2]/50' : row.status === 'duplicate' ? 'bg-[#FFFBEB]/50' : ''}`}>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">{row.row}</td>
                            <td className="py-2.5 px-3 font-medium text-foreground text-sm">{row.name}</td>
                            <td className="py-2.5 px-3 font-mono-data text-xs text-foreground">{row.passportNumber || <span className="text-[#DC2626]">Missing</span>}</td>
                            <td className="py-2.5 px-3 text-sm text-muted-foreground">{row.nationality}</td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">{row.groupLeader}</td>
                            <td className="py-2.5 px-3">
                              {row.status === 'valid' && <span className="flex items-center gap-1 text-xs text-[#16A34A]"><CheckCircle2 size={12} />Valid</span>}
                              {row.status === 'error' && <span className="flex items-center gap-1 text-xs text-[#DC2626]"><AlertTriangle size={12} />{row.error}</span>}
                              {row.status === 'duplicate' && <span className="flex items-center gap-1 text-xs text-[#D97706]"><AlertTriangle size={12} />Duplicate</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {errorCount > 0 && (
                    <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/20">
                      <p className="text-xs text-[#DC2626] font-medium">{errorCount} row(s) have errors and will be skipped. Fix them in your file and re-import, or proceed to import only valid records.</p>
                    </div>
                  )}
                </div>
              )}

              {importStep === 'done' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-[#16A34A]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Import Successful</h3>
                  <p className="text-sm text-muted-foreground mt-2">{validCount} pilgrims have been added to the registry.</p>
                  {dupCount > 0 && <p className="text-xs text-[#D97706] mt-1">{dupCount} duplicate(s) were skipped.</p>}
                  {errorCount > 0 && <p className="text-xs text-[#DC2626] mt-1">{errorCount} row(s) with errors were skipped.</p>}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              {importStep === 'upload' && <button onClick={() => setShowImportModal(false)} className="btn-secondary text-sm px-4 py-2">Cancel</button>}
              {importStep === 'preview' && (
                <>
                  <button onClick={() => setImportStep('upload')} className="btn-secondary text-sm px-4 py-2">Back</button>
                  <button onClick={handleConfirmImport} className="btn-primary text-sm px-4 py-2">Import {validCount} Valid Records</button>
                </>
              )}
              {importStep === 'done' && <button onClick={() => setShowImportModal(false)} className="btn-primary text-sm px-4 py-2">Close</button>}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
