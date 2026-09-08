'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowDownLeft } from 'lucide-react';

interface RefundCase {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  resolvedDate?: string;
  groupLeader: string;
  refundType: 'full' | 'partial';
}

const refundCases: RefundCase[] = [
  { id: 'RFD-001', pilgrimId: 'PIL-009', pilgrimName: 'Yusuf Abdullahi Warsame', amount: 3200, reason: 'Visa rejection by Saudi authorities', status: 'completed', requestDate: '2027-07-28', resolvedDate: '2027-07-30', groupLeader: 'Sheikh Ibrahim Musa', refundType: 'full' },
  { id: 'RFD-002', pilgrimId: 'PIL-007', pilgrimName: 'Ibrahim Al-Siddiq', amount: 1500, reason: 'Room downgrade — hotel change', status: 'processing', requestDate: '2027-07-18', groupLeader: 'Sheikh Tariq Hussain', refundType: 'partial' },
  { id: 'RFD-003', pilgrimId: 'PIL-011', pilgrimName: 'Zainab Diallo', amount: 14200, reason: 'Medical emergency — unable to travel', status: 'approved', requestDate: '2027-08-02', groupLeader: 'Sheikh Moussa Diallo', refundType: 'full' },
  { id: 'RFD-004', pilgrimId: 'PIL-013', pilgrimName: 'Hassan Boudiaf', amount: 800, reason: 'Duplicate payment — bank error', status: 'pending', requestDate: '2027-08-20', groupLeader: 'Sheikh Tariq Hussain', refundType: 'partial' },
  { id: 'RFD-005', pilgrimId: 'PIL-014', pilgrimName: 'Rania Al-Sayed', amount: 4680, reason: 'Withdrawal from campaign', status: 'rejected', requestDate: '2027-08-10', resolvedDate: '2027-08-14', groupLeader: 'Sheikh Ahmed Al-Rashidi', refundType: 'partial' },
];

const statusConfig: Record<RefundCase['status'], { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: 'Pending Review', icon: Clock, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  processing: { label: 'Processing', icon: RefreshCw, color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
};

export default function RefundManagement() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all' ? refundCases : refundCases.filter((r) => r.status === activeFilter);

  const totalPending = refundCases.filter((r) => r.status === 'pending' || r.status === 'approved').reduce((s, r) => s + r.amount, 0);
  const totalProcessed = refundCases.filter((r) => r.status === 'completed').reduce((s, r) => s + r.amount, 0);
  const pendingCount = refundCases.filter((r) => r.status === 'pending').length;

  return (
    <div className="card-base p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ArrowDownLeft size={16} className="text-[#DC2626]" />
            <h3 className="text-sm font-semibold text-foreground">Refund Management</h3>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold">{pendingCount} pending</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              Pending: <span className="font-semibold text-[#D97706]">SAR {totalPending.toLocaleString()}</span>
            </span>
            <span className="text-muted-foreground">
              Processed: <span className="font-semibold text-[#16A34A]">SAR {totalProcessed.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {(['all', 'pending', 'approved', 'processing', 'completed', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors capitalize ${activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-input'}`}
            >
              {f === 'all' ? 'All' : statusConfig[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Refund Cases */}
      <div className="divide-y divide-border/50">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">No refund cases match this filter</div>
        ) : (
          filtered.map((r) => {
            const sc = statusConfig[r.status];
            const StatusIcon = sc.icon;
            return (
              <div key={r.id} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono-data font-semibold text-muted-foreground">{r.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.color} ${sc.bg} flex items-center gap-1`}>
                        <StatusIcon size={10} />
                        {sc.label}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${r.refundType === 'full' ? 'text-[#DC2626] bg-[#FEF2F2]' : 'text-[#D97706] bg-[#FFFBEB]'}`}>
                        {r.refundType === 'full' ? 'Full Refund' : 'Partial'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{r.pilgrimName}</p>
                    <p className="text-xs text-muted-foreground font-mono-data">{r.pilgrimId} · {r.groupLeader}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <AlertTriangle size={11} className="text-[#D97706] flex-shrink-0" />
                      {r.reason}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Requested: {r.requestDate}</span>
                      {r.resolvedDate && <span>Resolved: {r.resolvedDate}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold font-mono-data text-[#DC2626]">
                      −SAR {r.amount.toLocaleString()}
                    </p>
                    {r.status === 'pending' && (
                      <div className="flex gap-1.5 mt-2 justify-end">
                        <button className="px-2.5 py-1 text-xs rounded-lg bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20 font-medium hover:bg-[#DCFCE7] transition-colors">
                          Approve
                        </button>
                        <button className="px-2.5 py-1 text-xs rounded-lg bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20 font-medium hover:bg-[#FEE2E2] transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
