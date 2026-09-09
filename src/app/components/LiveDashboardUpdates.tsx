'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, CreditCard, ScanLine, AlertTriangle, Bus, MessageSquare, QrCode, Loader2, Wifi, RefreshCw } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface LiveUpdate {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: string;
  isNew?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  check: CheckCircle2,
  payment: CreditCard,
  scan: ScanLine,
  alert: AlertTriangle,
  bus: Bus,
  message: MessageSquare,
  qr: QrCode,
  processing: Loader2,
};

const iconColorMap: Record<string, string> = {
  check: 'text-[#16A34A]',
  payment: 'text-accent',
  scan: 'text-[#2563EB]',
  alert: 'text-[#DC2626]',
  bus: 'text-primary',
  message: 'text-[#7C3AED]',
  qr: 'text-primary',
  processing: 'text-[#2563EB]',
};

const iconBgMap: Record<string, string> = {
  check: 'bg-[#F0FDF4]',
  payment: 'bg-accent/10',
  scan: 'bg-[#EFF6FF]',
  alert: 'bg-[#FEF2F2]',
  bus: 'bg-secondary',
  message: 'bg-[#F5F3FF]',
  qr: 'bg-secondary',
  processing: 'bg-[#EFF6FF]',
};

const liveUpdatePool: Omit<LiveUpdate, 'id' | 'time' | 'isNew'>[] = [
  { type: 'visa', message: 'Visa approved for Fatima Zahra Benali (PIL-002)', icon: 'check' },
  { type: 'payment', message: 'Payment SAR 4,260 received from Amira Hassan Saleh (PIL-006)', icon: 'payment' },
  { type: 'qr', message: 'QR check-in completed for 12 pilgrims — Group GRP-002', icon: 'qr' },
  { type: 'alert', message: 'Passport expiry warning: PIL-003 expires before return date', icon: 'alert' },
  { type: 'bus', message: 'Bus #12 departed — 47/50 seats occupied', icon: 'bus' },
  { type: 'scan', message: 'Passport scanned for Maryam Koné (PIL-010)', icon: 'scan' },
  { type: 'message', message: 'WhatsApp broadcast sent to Group GRP-003 (38 recipients)', icon: 'message' },
  { type: 'processing', message: 'Visa processing initiated for 8 pilgrims via MOFA portal', icon: 'processing' },
  { type: 'check', message: 'Room 318 allocated to Abdulrahman Siddiqui (PIL-011)', icon: 'check' },
  { type: 'payment', message: 'Overdue payment reminder sent to 61 pilgrims', icon: 'alert' },
];

let updateCounter = 100;

export default function LiveDashboardUpdates() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([
    { id: 'ACT-001', type: 'visa', message: 'Visa approved for Ahmad Yusuf Al-Rashidi (PIL-001)', time: '8 min ago', icon: 'check' },
    { id: 'ACT-002', type: 'payment', message: 'Payment received SAR 9,940 from Mohammad Patel (PIL-003)', time: '23 min ago', icon: 'payment' },
    { id: 'ACT-003', type: 'passport', message: 'Passport scanned for 12 pilgrims in Group GRP-006', time: '1 hr ago', icon: 'scan' },
    { id: 'ACT-004', type: 'alert', message: 'Visa rejected for Zainab Bint Abdullah (PIL-008) — action required', time: '2 hr ago', icon: 'alert' },
    { id: 'ACT-005', type: 'allocation', message: 'Bus #7 seating plan updated — 48/50 seats filled', time: '3 hr ago', icon: 'bus' },
    { id: 'ACT-006', type: 'whatsapp', message: 'WhatsApp broadcast sent to Group GRP-001 (47 recipients)', time: '4 hr ago', icon: 'message' },
  ]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const poolIndexRef = useRef(0);

  const pushUpdate = () => {
    const template = liveUpdatePool[poolIndexRef.current % liveUpdatePool.length];
    poolIndexRef.current += 1;
    updateCounter += 1;
    const newUpdate: LiveUpdate = {
      id: `LIVE-${updateCounter}`,
      ...template,
      time: 'Just now',
      isNew: true,
    };
    setUpdates((prev) => {
      const aged = prev.map((u) => ({ ...u, isNew: false, time: u.time === 'Just now' ? '1 min ago' : u.time }));
      return [newUpdate, ...aged].slice(0, 8);
    });
    setLastUpdated(0);
    setNewCount((c) => c + 1);
    setTimeout(() => {
      setUpdates((prev) => prev.map((u) => u.id === newUpdate.id ? { ...u, isNew: false } : u));
    }, 2000);
  };

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        setLastUpdated((s) => s + 1);
      }, 1000);
      const pushInterval = setInterval(pushUpdate, 12000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearInterval(pushInterval);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isLive]);

  const formatLastUpdated = () => {
    if (lastUpdated === 0) return 'Just now';
    if (lastUpdated < 60) return `${lastUpdated}s ago`;
    return `${Math.floor(lastUpdated / 60)}m ago`;
  };

  return (
    <div className="card-base h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Live Activity</h3>
          {isLive && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse inline-block" />
              Live
            </span>
          )}
          {newCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              +{newCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatLastUpdated()}</span>
          <button
            onClick={() => { setIsLive((v) => !v); setNewCount(0); }}
            className={`p-1.5 rounded-lg transition-colors ${isLive ? 'bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]' : 'bg-muted text-muted-foreground hover:bg-input'}`}
            title={isLive ? 'Pause live updates' : 'Resume live updates'}
          >
            {isLive ? <Wifi size={13} /> : <RefreshCw size={13} />}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto scrollbar-thin">
        {updates.map((act) => {
          const Icon = iconMap[act.icon] ?? CheckCircle2;
          return (
            <div
              key={act.id}
              className={`flex items-start gap-3 transition-all duration-500 rounded-lg px-1 py-0.5 ${act.isNew ? 'bg-[#F0FDF4] pulse-highlight' : ''}`}
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${iconBgMap[act.icon] ?? 'bg-muted'}`}>
                <Icon size={13} className={iconColorMap[act.icon] ?? 'text-muted-foreground'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{act.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
              </div>
              {act.isNew && (
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
