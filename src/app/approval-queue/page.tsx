'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheckCircle, XCircle, Clock, User, Search, ChevronDown, AlertCircle, RefreshCw, Plane, CreditCard, FileText } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type ApprovalType = 'visa' | 'reallocation' | 'refund';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalItem {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  requester: string;
  requesterRole: string;
  pilgrimName: string;
  pilgrimId: string;
  description: string;
  amount?: number;
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
  details: string;
}

const initialApprovals: ApprovalItem[] = [
  {
    id: 'APR-001',
    type: 'visa',
    status: 'pending',
    requester: 'Ahmed Al-Rashid',
    requesterRole: 'Group Leader',
    pilgrimName: 'Fatima Hassan',
    pilgrimId: 'PIL-2847',
    description: 'Visa status update — extension request due to medical hold',
    submittedAt: '2026-09-09T04:30:00Z',
    priority: 'high',
    details: 'Pilgrim requires 7-day visa extension due to hospital admission. Medical certificate attached.',
  },
  {
    id: 'APR-002',
    type: 'reallocation',
    status: 'pending',
    requester: 'Sara Khalid',
    requesterRole: 'Operations Staff',
    pilgrimName: 'Mohammed Al-Farsi',
    pilgrimId: 'PIL-1923',
    description: 'Hotel room reallocation — accessibility requirement',
    submittedAt: '2026-09-09T03:15:00Z',
    priority: 'high',
    details: 'Pilgrim has mobility issues. Requesting ground-floor room at Makkah Grand Hotel. Current room: 412.',
  },
  {
    id: 'APR-003',
    type: 'refund',
    status: 'pending',
    requester: 'Khalid Nasser',
    requesterRole: 'Finance Officer',
    pilgrimName: 'Aisha Bint Yusuf',
    pilgrimId: 'PIL-3301',
    description: 'Partial refund — cancelled bus seat upgrade',
    amount: 850,
    submittedAt: '2026-09-09T02:00:00Z',
    priority: 'medium',
    details: 'Pilgrim cancelled premium bus seat upgrade. Refund of SAR 850 to original payment method.',
  },
  {
    id: 'APR-004',
    type: 'visa',
    status: 'pending',
    requester: 'Omar Bin Laden',
    requesterRole: 'Group Leader',
    pilgrimName: 'Yusuf Al-Qahtani',
    pilgrimId: 'PIL-0892',
    description: 'Visa correction — passport number mismatch',
    submittedAt: '2026-09-08T22:45:00Z',
    priority: 'high',
    details: 'Passport number on visa application does not match renewed passport. Correction required before departure.',
  },
  {
    id: 'APR-005',
    type: 'reallocation',
    status: 'pending',
    requester: 'Nadia Hamdan',
    requesterRole: 'Operations Staff',
    pilgrimName: 'Ibrahim Al-Sayed',
    pilgrimId: 'PIL-2156',
    description: 'Flight seat reallocation — family grouping request',
    submittedAt: '2026-09-08T20:10:00Z',
    priority: 'medium',
    details: 'Family of 4 split across different rows. Requesting adjacent seating on SV-2341 Jeddah flight.',
  },
  {
    id: 'APR-006',
    type: 'refund',
    status: 'pending',
    requester: 'Tariq Mansour',
    requesterRole: 'Finance Officer',
    pilgrimName: 'Zainab Al-Hussain',
    pilgrimId: 'PIL-4412',
    description: 'Full refund — medical withdrawal from campaign',
    amount: 12500,
    submittedAt: '2026-09-08T18:30:00Z',
    priority: 'high',
    details: 'Pilgrim medically unfit to travel per doctor certificate. Full campaign fee refund requested.',
  },
  {
    id: 'APR-007',
    type: 'reallocation',
    status: 'pending',
    requester: 'Hana Al-Otaibi',
    requesterRole: 'Group Leader',
    pilgrimName: 'Abdul Rahman Malik',
    pilgrimId: 'PIL-1677',
    description: 'Bus route reallocation — schedule conflict',
    submittedAt: '2026-09-08T16:00:00Z',
    priority: 'low',
    details: 'Pilgrim missed Bus-7 departure. Requesting transfer to Bus-9 on same route.',
  },
  {
    id: 'APR-008',
    type: 'visa',
    status: 'pending',
    requester: 'Bilal Chaudhry',
    requesterRole: 'Operations Staff',
    pilgrimName: 'Mariam Al-Zahra',
    pilgrimId: 'PIL-3089',
    description: 'Visa category change — Umrah to Hajj upgrade',
    submittedAt: '2026-09-08T14:20:00Z',
    priority: 'medium',
    details: 'Pilgrim registered under Umrah visa but eligible for Hajj quota. Requesting category upgrade.',
  },
];

const typeConfig: Record<ApprovalType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  visa: { label: 'Visa Update', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  reallocation: { label: 'Reallocation', icon: Plane, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  refund: { label: 'Refund', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: 'High', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  low: { label: 'Low', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ApprovalQueuePage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [filterType, setFilterType] = useState<ApprovalType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null);

  const pending = approvals.filter((a) => a.status === 'pending');
  const resolved = approvals.filter((a) => a.status !== 'pending');

  const filtered = pending.filter((a) => {
    const matchType = filterType === 'all' || a.type === filterType;
    const matchPriority = filterPriority === 'all' || a.priority === filterPriority;
    const matchSearch =
      !search ||
      a.pilgrimName.toLowerCase().includes(search.toLowerCase()) ||
      a.requester.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchPriority && matchSearch;
  });

  function handleAction(id: string, action: 'approved' | 'rejected') {
    setActionFeedback({ id, action });
    setTimeout(() => {
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
      setActionFeedback(null);
      setExpandedId(null);
    }, 600);
  }

  const counts = {
    visa: pending.filter((a) => a.type === 'visa').length,
    reallocation: pending.filter((a) => a.type === 'reallocation').length,
    refund: pending.filter((a) => a.type === 'refund').length,
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Approval Queue</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Centralized pending approvals — visa updates, reallocations, and refunds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
              {pending.length} Pending
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
              {resolved.length} Resolved
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {(Object.keys(typeConfig) as ApprovalType[]).map((type) => {
            const cfg = typeConfig[type];
            const Icon = cfg.icon;
            return (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? 'all' : type)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  filterType === type
                    ? `${cfg.bg} border-opacity-60 ring-1 ring-inset ring-current/20`
                    : 'bg-card border-border hover:border-border/80'
                }`}
              >
                <div className={`p-2 rounded-lg ${cfg.bg} border`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  <p className="text-xl font-bold text-foreground">{counts[type]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by pilgrim, requester, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ApprovalType | 'all')}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            <option value="all">All Types</option>
            <option value="visa">Visa Updates</option>
            <option value="reallocation">Reallocations</option>
            <option value="refund">Refunds</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Approval Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl">
            <CheckCircle size={40} className="text-green-400 mb-3" />
            <p className="text-foreground font-semibold">All clear!</p>
            <p className="text-sm text-muted-foreground mt-1">No pending approvals match your filters.</p>
          </div>
        )}

        {filtered.map((item) => {
          const typeCfg = typeConfig[item.type];
          const TypeIcon = typeCfg.icon;
          const priCfg = priorityConfig[item.priority];
          const isExpanded = expandedId === item.id;
          const isFeedback = actionFeedback?.id === item.id;

          return (
            <div
              key={item.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all ${
                isFeedback
                  ? actionFeedback?.action === 'approved' ?'border-green-500/50 bg-green-500/5' :'border-red-500/50 bg-red-500/5' :'border-border hover:border-border/80'
              }`}
            >
              {/* Main Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Type Icon */}
                <div className={`p-2.5 rounded-lg border flex-shrink-0 ${typeCfg.bg}`}>
                  <TypeIcon size={16} className={typeCfg.color} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${typeCfg.bg} ${typeCfg.color}`}>
                      {typeCfg.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priCfg.color}`}>
                      {priCfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-1 truncate">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User size={11} />
                      {item.pilgrimName}
                      <span className="text-muted-foreground/50">·</span>
                      <span className="font-mono">{item.pilgrimId}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {timeAgo(item.submittedAt)}
                    </span>
                    {item.amount && (
                      <span className="text-xs font-semibold text-purple-400">SAR {item.amount.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Requester */}
                <div className="hidden md:block text-right flex-shrink-0 min-w-32">
                  <p className="text-xs text-muted-foreground">Requested by</p>
                  <p className="text-sm font-medium text-foreground">{item.requester}</p>
                  <p className="text-xs text-muted-foreground">{item.requesterRole}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    {isExpanded ? 'Hide' : 'Details'}
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'rejected')}
                    disabled={isFeedback}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={13} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'approved')}
                    disabled={isFeedback}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={13} />
                    Approve
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-border/50 pt-3 bg-muted/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Details</p>
                      <p className="text-sm text-foreground">{item.details}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Submitted: {new Date(item.submittedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span>·</span>
                    <span>Requester role: {item.requesterRole}</span>
                  </div>
                </div>
              )}

              {/* Feedback overlay */}
              {isFeedback && (
                <div className={`px-5 py-2 text-xs font-semibold flex items-center gap-2 ${
                  actionFeedback?.action === 'approved' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <RefreshCw size={12} className="animate-spin" />
                  {actionFeedback?.action === 'approved' ? 'Approving…' : 'Rejecting…'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resolved Section */}
      {resolved.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recently Resolved ({resolved.length})
          </h2>
          <div className="space-y-2">
            {resolved.map((item) => {
              const typeCfg = typeConfig[item.type];
              const TypeIcon = typeCfg.icon;
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3 bg-card border border-border rounded-xl opacity-60">
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${typeCfg.bg}`}>
                    <TypeIcon size={14} className={typeCfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.pilgrimName} · {item.requester}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    item.status === 'approved' ?'text-green-400 bg-green-500/10 border-green-500/20' :'text-red-400 bg-red-500/10 border-red-500/20'
                  }`}>
                    {item.status === 'approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {item.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
