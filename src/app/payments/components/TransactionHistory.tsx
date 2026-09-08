'use client';

import React, { useState, useMemo } from 'react';
import { History, RefreshCw, Search, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, XCircle, ChevronDown } from 'lucide-react';

export interface Transaction {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  amount: number;
  type: 'installment' | 'full' | 'deposit' | 'refund' | 'adjustment';
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
  method: 'bank' | 'cash' | 'card' | 'online';
  ref: string;
  groupLeader: string;
  note?: string;
}

const allTransactions: Transaction[] = [
  { id: 'TXN-001', pilgrimId: 'PIL-003', pilgrimName: 'Mohammad Idris Patel', amount: 9940, type: 'installment', status: 'completed', date: '2027-08-28', method: 'bank', ref: 'BNK-88341', groupLeader: 'Sheikh Tariq Hussain' },
  { id: 'TXN-002', pilgrimId: 'PIL-010', pilgrimName: 'Maryam Koné', amount: 11175, type: 'installment', status: 'completed', date: '2027-08-25', method: 'online', ref: 'ONL-55219', groupLeader: 'Sheikh Moussa Diallo' },
  { id: 'TXN-003', pilgrimId: 'PIL-001', pilgrimName: 'Ahmad Yusuf Al-Rashidi', amount: 18500, type: 'full', status: 'completed', date: '2027-08-20', method: 'bank', ref: 'BNK-77102', groupLeader: 'Sheikh Ahmed Al-Rashidi' },
  { id: 'TXN-004', pilgrimId: 'PIL-006', pilgrimName: 'Amira Hassan Saleh', amount: 7800, type: 'installment', status: 'completed', date: '2027-08-18', method: 'card', ref: 'CRD-44312', groupLeader: 'Sheikh Ahmed Al-Rashidi' },
  { id: 'TXN-005', pilgrimId: 'PIL-016', pilgrimName: 'Tariq Noor Al-Din', amount: 8200, type: 'installment', status: 'completed', date: '2027-08-15', method: 'cash', ref: 'CSH-22198', groupLeader: 'Sheikh Faisal Al-Mutairi' },
  { id: 'TXN-006', pilgrimId: 'PIL-012', pilgrimName: 'Sumayyah Al-Ghamdi', amount: 18500, type: 'full', status: 'completed', date: '2027-08-12', method: 'bank', ref: 'BNK-66543', groupLeader: 'Sheikh Umar Al-Faruq' },
  { id: 'TXN-007', pilgrimId: 'PIL-005', pilgrimName: 'Khalid Mansour Al-Otaibi', amount: 5250, type: 'deposit', status: 'completed', date: '2027-08-10', method: 'cash', ref: 'CSH-11087', groupLeader: 'Sheikh Faisal Al-Mutairi' },
  { id: 'TXN-008', pilgrimId: 'PIL-020', pilgrimName: 'Mustafa Al-Kurdi', amount: 6600, type: 'installment', status: 'completed', date: '2027-08-08', method: 'online', ref: 'ONL-33421', groupLeader: 'Sheikh Noor Islam' },
  { id: 'TXN-009', pilgrimId: 'PIL-017', pilgrimName: 'Layla Al-Mansouri', amount: 19800, type: 'full', status: 'completed', date: '2027-08-05', method: 'bank', ref: 'BNK-55891', groupLeader: 'Sheikh Umar Al-Faruq' },
  { id: 'TXN-010', pilgrimId: 'PIL-004', pilgrimName: 'Nadia Okonkwo', amount: 19200, type: 'full', status: 'completed', date: '2027-08-01', method: 'bank', ref: 'BNK-44231', groupLeader: 'Sheikh Ibrahim Musa' },
  { id: 'TXN-011', pilgrimId: 'PIL-009', pilgrimName: 'Yusuf Abdullahi Warsame', amount: 3200, type: 'refund', status: 'completed', date: '2027-07-30', method: 'bank', ref: 'RFD-10021', groupLeader: 'Sheikh Ibrahim Musa', note: 'Visa rejection — full refund processed' },
  { id: 'TXN-012', pilgrimId: 'PIL-013', pilgrimName: 'Hassan Boudiaf', amount: 4560, type: 'installment', status: 'pending', date: '2027-07-28', method: 'bank', ref: 'BNK-99012', groupLeader: 'Sheikh Tariq Hussain' },
  { id: 'TXN-013', pilgrimId: 'PIL-014', pilgrimName: 'Rania Al-Sayed', amount: 4680, type: 'installment', status: 'failed', date: '2027-07-25', method: 'card', ref: 'CRD-77654', groupLeader: 'Sheikh Ahmed Al-Rashidi', note: 'Card declined — retry required' },
  { id: 'TXN-014', pilgrimId: 'PIL-002', pilgrimName: 'Fatima Zahra Benali', amount: 16800, type: 'full', status: 'completed', date: '2027-07-22', method: 'bank', ref: 'BNK-33219', groupLeader: 'Sheikh Ahmed Al-Rashidi' },
  { id: 'TXN-015', pilgrimId: 'PIL-007', pilgrimName: 'Ibrahim Al-Siddiq', amount: 1500, type: 'refund', status: 'processing', date: '2027-07-20', method: 'bank', ref: 'RFD-10022', groupLeader: 'Sheikh Tariq Hussain', note: 'Partial refund — room downgrade' },
  { id: 'TXN-016', pilgrimId: 'PIL-019', pilgrimName: 'Aisha Bint Umar', amount: 14600, type: 'full', status: 'completed', date: '2027-07-18', method: 'online', ref: 'ONL-44871', groupLeader: 'Sheikh Rizal Hakim' },
  { id: 'TXN-017', pilgrimId: 'PIL-015', pilgrimName: 'Bilal Osman Farah', amount: 13800, type: 'full', status: 'completed', date: '2027-07-15', method: 'bank', ref: 'BNK-22341', groupLeader: 'Sheikh Ibrahim Musa' },
  { id: 'TXN-018', pilgrimId: 'PIL-018', pilgrimName: 'Omar Farouq Diallo', amount: 3000, type: 'adjustment', status: 'completed', date: '2027-07-12', method: 'bank', ref: 'ADJ-00031', groupLeader: 'Sheikh Moussa Diallo', note: 'Late registration surcharge applied' },
];

const typeConfig: Record<Transaction['type'], { label: string; color: string; bg: string }> = {
  full: { label: 'Full Payment', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  installment: { label: 'Installment', color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  deposit: { label: 'Deposit', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
  refund: { label: 'Refund', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
  adjustment: { label: 'Adjustment', color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]' },
};

const statusConfig: Record<Transaction['status'], { label: string; icon: React.ElementType; color: string }> = {
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-[#16A34A]' },
  pending: { label: 'Pending', icon: Clock, color: 'text-[#D97706]' },
  failed: { label: 'Failed', icon: XCircle, color: 'text-[#DC2626]' },
  processing: { label: 'Processing', icon: RefreshCw, color: 'text-[#2563EB]' },
};

const methodLabel: Record<Transaction['method'], string> = {
  bank: 'Bank Transfer',
  cash: 'Cash',
  card: 'Card',
  online: 'Online',
};

const PAGE_SIZE = 10;

export default function TransactionHistory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...allTransactions];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((t) => t.pilgrimName.toLowerCase().includes(q) || t.pilgrimId.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') rows = rows.filter((t) => t.type === typeFilter);
    if (statusFilter !== 'all') rows = rows.filter((t) => t.status === statusFilter);
    return rows;
  }, [search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const totalIn = filtered.filter((t) => t.type !== 'refund').reduce((s, t) => s + t.amount, 0);
  const totalRefunds = filtered.filter((t) => t.type === 'refund').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="card-base p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Transaction History</h3>
            <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground font-medium">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-[#16A34A] font-medium">
              <ArrowUpRight size={12} />
              SAR {(totalIn / 1000).toFixed(0)}K in
            </span>
            <span className="flex items-center gap-1 text-[#DC2626] font-medium">
              <ArrowDownLeft size={12} />
              SAR {(totalRefunds / 1000).toFixed(0)}K refunded
            </span>
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pilgrim, ref…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            className="px-2.5 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="full">Full Payment</option>
            <option value="installment">Installment</option>
            <option value="deposit">Deposit</option>
            <option value="refund">Refund</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-2.5 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ref / Date</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pilgrim</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Type</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Method</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
              <th className="px-3 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((txn, i) => {
              const tc = typeConfig[txn.type];
              const sc = statusConfig[txn.status];
              const StatusIcon = sc.icon;
              const isExpanded = expandedId === txn.id;
              const isRefund = txn.type === 'refund';
              return (
                <React.Fragment key={txn.id}>
                  <tr
                    className={`border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer ${i % 2 === 0 ? '' : 'bg-muted/10'} ${isExpanded ? 'bg-primary/5' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : txn.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono-data font-medium text-foreground">{txn.ref}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{txn.date}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium text-foreground leading-tight">{txn.pilgrimName}</p>
                      <p className="text-xs text-muted-foreground font-mono-data">{txn.pilgrimId}</p>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.color} ${tc.bg}`}>{tc.label}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground capitalize">{methodLabel[txn.method]}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`flex items-center justify-center gap-1 text-xs font-medium ${sc.color}`}>
                        <StatusIcon size={12} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`text-sm font-semibold font-mono-data ${isRefund ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                        {isRefund ? '−' : '+'}SAR {txn.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-border/50 bg-primary/5">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="flex items-start gap-6 text-xs text-muted-foreground flex-wrap">
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Group Leader</span>
                            {txn.groupLeader}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Payment Method</span>
                            {methodLabel[txn.method]}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block mb-0.5">Transaction ID</span>
                            <span className="font-mono-data">{txn.id}</span>
                          </div>
                          {txn.note && (
                            <div className="flex-1">
                              <span className="font-semibold text-foreground block mb-0.5">Note</span>
                              <span className={txn.type === 'refund' ? 'text-[#DC2626]' : ''}>{txn.note}</span>
                            </div>
                          )}
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0 ? 'No transactions' : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-2.5 py-1 text-xs rounded-lg border border-border bg-muted hover:bg-input disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-2.5 py-1 text-xs rounded-lg border ${page === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-muted hover:bg-input'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-2.5 py-1 text-xs rounded-lg border border-border bg-muted hover:bg-input disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
