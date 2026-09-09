'use client';

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { FileText, Plus, Download, Search, Eye, Printer, CheckCircle2, Clock, AlertTriangle, XCircle, ChevronDown, ChevronUp, ChevronsUpDown, Receipt, Send } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface Invoice {
  id: string;
  pilgrimName: string;
  pilgrimId: string;
  campaign: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  status: 'paid' | 'partial' | 'overdue' | 'draft' | 'sent';
  type: 'invoice' | 'receipt';
  items: { description: string; qty: number; unitPrice: number }[];
}

const mockInvoices: Invoice[] = [
  { id: 'INV-2027-001', pilgrimName: 'Ahmad Al-Rashidi', pilgrimId: 'PIL-001', campaign: 'Hajj 2027', issueDate: '2026-10-01', dueDate: '2026-11-01', amount: 15800, paid: 15800, status: 'paid', type: 'invoice', items: [{ description: 'Hajj Package – Full', qty: 1, unitPrice: 14000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }, { description: 'Travel Insurance', qty: 1, unitPrice: 600 }] },
  { id: 'INV-2027-002', pilgrimName: 'Fatima Al-Zahra', pilgrimId: 'PIL-002', campaign: 'Hajj 2027', issueDate: '2026-10-03', dueDate: '2026-11-03', amount: 16200, paid: 8100, status: 'partial', type: 'invoice', items: [{ description: 'Hajj Package – Premium', qty: 1, unitPrice: 15000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }] },
  { id: 'INV-2027-003', pilgrimName: 'Mohammed Benali', pilgrimId: 'PIL-003', campaign: 'Hajj 2027', issueDate: '2026-09-15', dueDate: '2026-10-15', amount: 14400, paid: 0, status: 'overdue', type: 'invoice', items: [{ description: 'Hajj Package – Standard', qty: 1, unitPrice: 13000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }, { description: 'Travel Insurance', qty: 1, unitPrice: 200 }] },
  { id: 'REC-2027-001', pilgrimName: 'Khadija Noor', pilgrimId: 'PIL-004', campaign: 'Hajj 2027', issueDate: '2026-10-10', dueDate: '2026-10-10', amount: 17500, paid: 17500, status: 'paid', type: 'receipt', items: [{ description: 'Hajj Package – VIP', qty: 1, unitPrice: 16000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }, { description: 'Travel Insurance', qty: 1, unitPrice: 300 }] },
  { id: 'INV-2027-004', pilgrimName: 'Yusuf Ibrahim', pilgrimId: 'PIL-005', campaign: 'Hajj 2027', issueDate: '2026-10-12', dueDate: '2026-11-12', amount: 13600, paid: 0, status: 'draft', type: 'invoice', items: [{ description: 'Hajj Package – Standard', qty: 1, unitPrice: 13000 }, { description: 'Visa Processing', qty: 1, unitPrice: 600 }] },
  { id: 'INV-2027-005', pilgrimName: 'Amina Diallo', pilgrimId: 'PIL-006', campaign: 'Hajj 2027', issueDate: '2026-10-14', dueDate: '2026-11-14', amount: 15200, paid: 15200, status: 'paid', type: 'invoice', items: [{ description: 'Hajj Package – Full', qty: 1, unitPrice: 14000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }] },
  { id: 'REC-2027-002', pilgrimName: 'Omar Farouq', pilgrimId: 'PIL-007', campaign: 'Hajj 2027', issueDate: '2026-10-16', dueDate: '2026-10-16', amount: 14800, paid: 14800, status: 'paid', type: 'receipt', items: [{ description: 'Hajj Package – Full', qty: 1, unitPrice: 14000 }, { description: 'Visa Processing', qty: 1, unitPrice: 800 }] },
  { id: 'INV-2027-006', pilgrimName: 'Zainab Al-Hussain', pilgrimId: 'PIL-008', campaign: 'Hajj 2027', issueDate: '2026-10-18', dueDate: '2026-11-18', amount: 16800, paid: 5600, status: 'partial', type: 'invoice', items: [{ description: 'Hajj Package – Premium', qty: 1, unitPrice: 15000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }, { description: 'Travel Insurance', qty: 1, unitPrice: 600 }] },
  { id: 'INV-2027-007', pilgrimName: 'Hassan Boudiaf', pilgrimId: 'PIL-009', campaign: 'Hajj 2027', issueDate: '2026-09-20', dueDate: '2026-10-20', amount: 15200, paid: 4560, status: 'overdue', type: 'invoice', items: [{ description: 'Hajj Package – Full', qty: 1, unitPrice: 14000 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }] },
  { id: 'INV-2027-008', pilgrimName: 'Rania Al-Sayed', pilgrimId: 'PIL-010', campaign: 'Hajj 2027', issueDate: '2026-10-20', dueDate: '2026-11-20', amount: 15600, paid: 0, status: 'sent', type: 'invoice', items: [{ description: 'Hajj Package – Full', qty: 1, unitPrice: 14400 }, { description: 'Visa Processing', qty: 1, unitPrice: 1200 }] },
];

type SortKey = 'id' | 'pilgrimName' | 'amount' | 'paid' | 'issueDate' | 'status';
type SortDir = 'asc' | 'desc';

const statusConfig = {
  paid: { label: 'Paid', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', icon: CheckCircle2 },
  partial: { label: 'Partial', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', icon: Clock },
  overdue: { label: 'Overdue', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', icon: AlertTriangle },
  draft: { label: 'Draft', color: 'text-muted-foreground', bg: 'bg-muted', icon: FileText },
  sent: { label: 'Sent', color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', icon: Send },
};

function StatusPill({ status }: { status: Invoice['status'] }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const balance = invoice.amount - invoice.paid;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono-data text-muted-foreground">{invoice.id}</span>
              <StatusPill status={invoice.status} />
            </div>
            <h2 className="text-base font-semibold text-foreground">{invoice.type === 'receipt' ? 'Receipt' : 'Invoice'}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{invoice.pilgrimName} · {invoice.pilgrimId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <XCircle size={18} />
          </button>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 p-5 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground">Campaign</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{invoice.campaign}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issue Date</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{invoice.issueDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{invoice.dueDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{invoice.type}</p>
          </div>
        </div>

        {/* Line items */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Line Items</p>
          <div className="space-y-2">
            {invoice.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-foreground flex-1">{item.description}</span>
                <span className="text-muted-foreground mx-4 text-xs">×{item.qty}</span>
                <span className="font-mono-data text-foreground">SAR {item.unitPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono-data text-foreground">SAR {invoice.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid</span>
            <span className="font-mono-data text-[#16A34A] font-medium">SAR {invoice.paid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
            <span className="text-foreground">Balance Due</span>
            <span className={`font-mono-data ${balance > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
              {balance > 0 ? `SAR ${balance.toLocaleString()}` : 'Settled'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-5 pb-5">
          <button className="btn-primary flex-1 justify-center gap-2">
            <Printer size={14} /> Print
          </button>
          <button className="btn-secondary flex-1 justify-center gap-2">
            <Download size={14} /> Export PDF
          </button>
          {invoice.status === 'draft' && (
            <button className="btn-primary flex-1 justify-center gap-2">
              <Send size={14} /> Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoicingPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('issueDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = useMemo(() => {
    let rows = [...mockInvoices];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.id.toLowerCase().includes(q) || r.pilgrimName.toLowerCase().includes(q) || r.pilgrimId.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') rows = rows.filter((r) => r.status === filterStatus);
    if (filterType !== 'all') rows = rows.filter((r) => r.type === filterType);
    rows.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [search, filterStatus, filterType, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={11} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-primary" /> : <ChevronDown size={11} className="text-primary" />;
  };

  // KPI summary
  const totalInvoiced = mockInvoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = mockInvoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = totalInvoiced - totalCollected;
  const overdueCount = mockInvoices.filter((i) => i.status === 'overdue').length;
  const paidCount = mockInvoices.filter((i) => i.status === 'paid').length;
  const draftCount = mockInvoices.filter((i) => i.status === 'draft').length;

  const kpis = [
    { label: 'Total Invoiced', value: `SAR ${(totalInvoiced / 1000).toFixed(0)}K`, sub: `${mockInvoices.length} documents`, color: 'text-primary', bg: 'bg-primary/10', icon: FileText },
    { label: 'Collected', value: `SAR ${(totalCollected / 1000).toFixed(0)}K`, sub: `${Math.round((totalCollected / totalInvoiced) * 100)}% rate`, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', icon: CheckCircle2 },
    { label: 'Outstanding', value: `SAR ${(totalOutstanding / 1000).toFixed(0)}K`, sub: 'balance due', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', icon: Clock },
    { label: 'Overdue', value: `${overdueCount}`, sub: 'invoices overdue', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', icon: AlertTriangle },
    { label: 'Fully Paid', value: `${paidCount}`, sub: 'invoices settled', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', icon: Receipt },
    { label: 'Drafts', value: `${draftCount}`, sub: 'pending send', color: 'text-muted-foreground', bg: 'bg-muted', icon: FileText },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Invoicing &amp; Receipts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Hajj 2027 · Issue and manage campaign invoices and receipts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary gap-2">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowNewModal(true)} className="btn-primary gap-2">
            <Plus size={14} /> New Invoice
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="card-base flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                  <Icon size={16} className={k.color} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
                <p className={`text-lg font-bold font-mono-data ${k.color}`}>{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="card-base p-0 overflow-hidden">
          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground font-medium">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-36"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="invoice">Invoice</option>
                <option value="receipt">Receipt</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left">
                    <button onClick={() => toggleSort('id')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground">
                      Doc # <SortIcon col="id" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <button onClick={() => toggleSort('pilgrimName')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground">
                      Pilgrim <SortIcon col="pilgrimName" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</span>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <button onClick={() => toggleSort('issueDate')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground">
                      Issued <SortIcon col="issueDate" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right">
                    <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground ml-auto">
                      Amount <SortIcon col="amount" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right">
                    <button onClick={() => toggleSort('paid')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground ml-auto">
                      Paid <SortIcon col="paid" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Balance</span>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground mx-auto">
                      Status <SortIcon col="status" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const balance = inv.amount - inv.paid;
                  return (
                    <tr
                      key={inv.id}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 !== 0 ? 'bg-muted/10' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono-data text-xs text-primary font-semibold">{inv.id}</span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground text-sm leading-tight">{inv.pilgrimName}</p>
                        <p className="text-xs text-muted-foreground font-mono-data">{inv.pilgrimId}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${inv.type === 'receipt' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-primary/10 text-primary'}`}>
                          {inv.type === 'receipt' ? <Receipt size={10} /> : <FileText size={10} />}
                          {inv.type === 'receipt' ? 'Receipt' : 'Invoice'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs text-foreground">{inv.issueDate}</p>
                        <p className="text-xs text-muted-foreground">Due: {inv.dueDate}</p>
                      </td>
                      <td className="px-3 py-3 text-right font-mono-data text-sm text-foreground">SAR {inv.amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-mono-data text-sm text-[#16A34A] font-medium">SAR {inv.paid.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-mono-data text-sm">
                        <span className={balance > 0 ? (inv.status === 'overdue' ? 'text-[#DC2626] font-semibold' : 'text-[#D97706]') : 'text-muted-foreground'}>
                          {balance > 0 ? `SAR ${balance.toLocaleString()}` : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <StatusPill status={inv.status} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Print"
                          >
                            <Printer size={14} />
                          </button>
                          {inv.status === 'draft' && (
                            <button
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Send"
                            >
                              <Send size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <FileText size={32} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No documents match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {/* New Invoice Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">New Invoice</h2>
              <button onClick={() => setShowNewModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <XCircle size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Pilgrim ID</label>
                <input type="text" placeholder="PIL-XXX" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Document Type</label>
                <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none">
                  <option>Invoice</option>
                  <option>Receipt</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Issue Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Package</label>
                <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none">
                  <option>Hajj Package – Standard (SAR 13,000)</option>
                  <option>Hajj Package – Full (SAR 14,000)</option>
                  <option>Hajj Package – Premium (SAR 15,000)</option>
                  <option>Hajj Package – VIP (SAR 16,000)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Notes</label>
                <textarea rows={2} placeholder="Optional notes…" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowNewModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => setShowNewModal(false)} className="btn-primary flex-1 justify-center">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
