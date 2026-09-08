'use client';

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, BellOff, CheckCheck, Trash2, Search, AlertTriangle, CheckCircle2, Info, CreditCard, Plane, FileText, Clock, ChevronRight, Settings } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type NotifType = 'alert' | 'success' | 'info' | 'payment' | 'flight' | 'visa' | 'system';
type NotifPriority = 'high' | 'medium' | 'low';

interface Notification {
  id: string;
  type: NotifType;
  priority: NotifPriority;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: string;
  actionLabel?: string;
  actionHref?: string;
}

const initialNotifications: Notification[] = [
  { id: 'N-001', type: 'alert', priority: 'high', title: 'Visa Rejection — 3 Pilgrims', message: 'Pilgrims PIL-034, PIL-078, PIL-112 have received visa rejections. Immediate action required to file appeals.', time: '5 min ago', read: false, category: 'Visa', actionLabel: 'View Pilgrims' },
  { id: 'N-002', type: 'payment', priority: 'high', title: 'Overdue Payment — 8 Accounts', message: '8 pilgrim accounts are now 30+ days overdue totalling SAR 64,400. Automated reminders have been sent.', time: '22 min ago', read: false, category: 'Payments', actionLabel: 'View Payments' },
  { id: 'N-003', type: 'alert', priority: 'high', title: 'Emergency Alert — Group GRP-003', message: 'Group leader Ustaz Khalid reported a medical emergency for pilgrim PIL-089 (Mina Camp, Tent 14B).', time: '1 hr ago', read: false, category: 'Emergency', actionLabel: 'Open Emergency' },
  { id: 'N-004', type: 'success', priority: 'medium', title: 'Visa Batch Approved — 45 Pilgrims', message: 'Batch VB-2027-008 has been approved by the Saudi Ministry. 45 pilgrims are now visa-cleared.', time: '2 hrs ago', read: false, category: 'Visa' },
  { id: 'N-005', type: 'flight', priority: 'medium', title: 'Flight SV-881 Schedule Change', message: 'Departure time updated from 14:30 to 16:45 on 15 Sep 2027. 85 pilgrims affected. Manifests updated.', time: '3 hrs ago', read: false, category: 'Flights', actionLabel: 'View Manifest' },
  { id: 'N-006', type: 'info', priority: 'medium', title: 'New Pilgrim Registration — 12 Added', message: '12 new pilgrims registered via the online portal and are pending document verification.', time: '4 hrs ago', read: true, category: 'Pilgrims' },
  { id: 'N-007', type: 'payment', priority: 'medium', title: 'Payment Received — SAR 18,500', message: 'Full payment received from Ahmad Al-Rashidi (PIL-001). Invoice INV-2027-001 marked as paid.', time: '5 hrs ago', read: true, category: 'Payments' },
  { id: 'N-008', type: 'success', priority: 'low', title: 'Hotel Allocation Complete — Makkah', message: 'All 850 pilgrims have been assigned rooms at Hilton Suites Makkah and Makkah Grand Hotel.', time: '1 day ago', read: true, category: 'Logistics' },
  { id: 'N-009', type: 'system', priority: 'low', title: 'System Backup Completed', message: 'Automated daily backup completed successfully. All campaign data is secured.', time: '1 day ago', read: true, category: 'System' },
  { id: 'N-010', type: 'info', priority: 'low', title: 'QR Check-in Report Ready', message: 'Daily check-in report for 14 Sep 2027 is ready. 312 pilgrims checked in (89% attendance rate).', time: '1 day ago', read: true, category: 'Operations', actionLabel: 'Download Report' },
  { id: 'N-011', type: 'alert', priority: 'medium', title: 'Passport Expiry Warning — 6 Pilgrims', message: '6 pilgrims have passports expiring within 6 months of travel date. Renewal required before visa processing.', time: '2 days ago', read: true, category: 'Visa' },
  { id: 'N-012', type: 'success', priority: 'low', title: 'Bus Seating Finalized — All Groups', message: 'Bus seating assignments for all 10 charter buses have been confirmed and distributed to group leaders.', time: '2 days ago', read: true, category: 'Logistics' },
  { id: 'N-013', type: 'flight', priority: 'low', title: 'Flight Slots Confirmed — Return Journey', message: 'Return flight slots for all 850 pilgrims confirmed with Saudi Airlines. Dates: 20–25 Oct 2027.', time: '3 days ago', read: true, category: 'Flights' },
  { id: 'N-014', type: 'system', priority: 'low', title: 'New Feature: Payment Calculator', message: 'The payment calculator is now available on the Payments page. Calculate installment plans and cash flow.', time: '4 days ago', read: true, category: 'System' },
];

const typeConfig: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  alert: { icon: AlertTriangle, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
  success: { icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  info: { icon: Info, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  payment: { icon: CreditCard, color: 'text-[#C5A028]', bg: 'bg-[#FFFBEB]' },
  flight: { icon: Plane, color: 'text-primary', bg: 'bg-primary/10' },
  visa: { icon: FileText, color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]' },
  system: { icon: Settings, color: 'text-muted-foreground', bg: 'bg-muted' },
};

const priorityConfig: Record<NotifPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
  medium: { label: 'Medium', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
  low: { label: 'Low', color: 'text-muted-foreground', bg: 'bg-muted' },
};

const categories = ['All', 'Visa', 'Payments', 'Emergency', 'Flights', 'Pilgrims', 'Logistics', 'Operations', 'System'];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | NotifPriority>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCategory !== 'All' && n.category !== filterCategory) return false;
      if (filterRead === 'unread' && n.read) return false;
      if (filterRead === 'read' && !n.read) return false;
      if (filterPriority !== 'all' && n.priority !== filterPriority) return false;
      return true;
    });
  }, [notifications, search, filterCategory, filterRead, filterPriority]);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Notification Center
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#DC2626] text-white text-xs font-bold">{unreadCount}</span>
              )}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Hajj 2027 · Campaign alerts and updates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary gap-2 text-xs">
              <CheckCheck size={13} /> Mark All Read
            </button>
          )}
          <button onClick={clearAll} className="btn-secondary gap-2 text-xs text-muted-foreground">
            <Trash2 size={13} /> Clear Read
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Unread', value: unreadCount, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', icon: Bell },
            { label: 'High Priority', value: notifications.filter((n) => n.priority === 'high' && !n.read).length, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', icon: AlertTriangle },
            { label: 'Today', value: notifications.filter((n) => n.time.includes('min') || n.time.includes('hr')).length, color: 'text-primary', bg: 'bg-primary/10', icon: Clock },
            { label: 'Total', value: notifications.length, color: 'text-muted-foreground', bg: 'bg-muted', icon: BellOff },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card-base flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className={`text-2xl font-bold font-mono-data ${s.color}`}>{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="card-base p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
            />
          </div>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as 'all' | 'unread' | 'read')}
            className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as 'all' | NotifPriority)}
            className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="card-base p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BellOff size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No notifications found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((n) => {
                const cfg = typeConfig[n.type];
                const pCfg = priorityConfig[n.priority];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    {/* Unread dot */}
                    <div className="flex-shrink-0 mt-1">
                      {!n.read ? (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className={cfg.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-xs font-semibold ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{n.category}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-[#DC2626] transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                      {n.actionLabel && (
                        <button className="mt-1.5 text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                          {n.actionLabel} <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
