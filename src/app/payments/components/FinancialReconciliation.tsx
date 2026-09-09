'use client';

import React, { useState } from 'react';
import { BarChart2, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GroupReconciliation {
  groupId: string;
  groupLeader: string;
  pilgrims: number;
  expectedRevenue: number;
  collectedRevenue: number;
  refunds: number;
  netRevenue: number;
  variance: number;
  status: 'balanced' | 'surplus' | 'deficit';
}

const groupData: GroupReconciliation[] = [
  { groupId: 'GRP-001', groupLeader: 'Sheikh Ahmed Al-Rashidi', pilgrims: 142, expectedRevenue: 2485000, collectedRevenue: 2421000, refunds: 16800, netRevenue: 2404200, variance: -80800, status: 'deficit' },
  { groupId: 'GRP-002', groupLeader: 'Sheikh Tariq Hussain', pilgrims: 118, expectedRevenue: 1888000, collectedRevenue: 1902000, refunds: 4560, netRevenue: 1897440, variance: 9440, status: 'surplus' },
  { groupId: 'GRP-003', groupLeader: 'Sheikh Faisal Al-Mutairi', pilgrims: 96, expectedRevenue: 1680000, collectedRevenue: 1680000, refunds: 0, netRevenue: 1680000, variance: 0, status: 'balanced' },
  { groupId: 'GRP-004', groupLeader: 'Sheikh Ibrahim Musa', pilgrims: 134, expectedRevenue: 2278000, collectedRevenue: 2195000, refunds: 17400, netRevenue: 2177600, variance: -100400, status: 'deficit' },
  { groupId: 'GRP-005', groupLeader: 'Sheikh Umar Al-Faruq', pilgrims: 108, expectedRevenue: 2052000, collectedRevenue: 2052000, refunds: 1500, netRevenue: 2050500, variance: -1500, status: 'balanced' },
  { groupId: 'GRP-006', groupLeader: 'Sheikh Moussa Diallo', pilgrims: 87, expectedRevenue: 1218000, collectedRevenue: 1104000, refunds: 14200, netRevenue: 1089800, variance: -128200, status: 'deficit' },
  { groupId: 'GRP-007', groupLeader: 'Sheikh Rizal Hakim', pilgrims: 76, expectedRevenue: 1140000, collectedRevenue: 1140000, refunds: 0, netRevenue: 1140000, variance: 0, status: 'balanced' },
  { groupId: 'GRP-008', groupLeader: 'Sheikh Noor Islam', pilgrims: 89, expectedRevenue: 1246000, collectedRevenue: 1193000, refunds: 0, netRevenue: 1193000, variance: -53000, status: 'deficit' },
];

const statusConfig: Record<GroupReconciliation['status'], { label: string; icon: React.ElementType; color: string; bg: string }> = {
  balanced: { label: 'Balanced', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  surplus: { label: 'Surplus', icon: TrendingUp, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  deficit: { label: 'Deficit', icon: TrendingDown, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
};

const chartData = groupData.map((g) => ({
  name: g.groupLeader.replace('Sheikh ', '').split(' ')[0],
  expected: g.expectedRevenue / 1000,
  collected: g.collectedRevenue / 1000,
  variance: g.variance / 1000,
}));

export default function FinancialReconciliation() {
  const [view, setView] = useState<'table' | 'chart'>('table');

  const totalExpected = groupData.reduce((s, g) => s + g.expectedRevenue, 0);
  const totalCollected = groupData.reduce((s, g) => s + g.collectedRevenue, 0);
  const totalRefunds = groupData.reduce((s, g) => s + g.refunds, 0);
  const totalNet = groupData.reduce((s, g) => s + g.netRevenue, 0);
  const totalVariance = totalCollected - totalExpected;
  const deficitGroups = groupData.filter((g) => g.status === 'deficit').length;

  return (
    <div className="card-base p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Financial Reconciliation</h3>
            {deficitGroups > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold">{deficitGroups} groups in deficit</span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${view === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Table
            </button>
            <button
              onClick={() => setView('chart')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${view === 'chart' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Chart
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Expected', value: `SAR ${(totalExpected / 1_000_000).toFixed(2)}M`, color: 'text-foreground' },
            { label: 'Collected', value: `SAR ${(totalCollected / 1_000_000).toFixed(2)}M`, color: 'text-[#16A34A]' },
            { label: 'Refunds', value: `SAR ${(totalRefunds / 1000).toFixed(0)}K`, color: 'text-[#DC2626]' },
            { label: 'Net Revenue', value: `SAR ${(totalNet / 1_000_000).toFixed(2)}M`, color: 'text-primary' },
          ].map((s) => (
            <div key={s.label} className="bg-muted/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
              <p className={`text-sm font-bold font-mono-data ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {view === 'chart' ? (
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground mb-3">Expected vs Collected by Group Leader (SAR thousands)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4} barCategoryGap="25%">
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B6560' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6B6560' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
              <Tooltip
                formatter={(value: number, name: string) => [`SAR ${value.toFixed(0)}K`, name === 'expected' ? 'Expected' : 'Collected']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
              />
              <Bar dataKey="expected" fill="#E2DED8" radius={[4, 4, 0, 0]} name="expected" />
              <Bar dataKey="collected" radius={[4, 4, 0, 0]} name="collected">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.variance >= 0 ? '#1B6B4A' : entry.variance > -50 ? '#C5A028' : '#DC2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Group Leader</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Pilgrims</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expected</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Collected</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Refunds</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Variance</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map((g, i) => {
                const sc = statusConfig[g.status];
                const StatusIcon = sc.icon;
                const fmtM = (n: number) => `${(n / 1_000_000).toFixed(2)}M`;
                const fmtK = (n: number) => n === 0 ? '—' : `${(n / 1000).toFixed(0)}K`;
                return (
                  <tr key={g.groupId} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground leading-tight">{g.groupLeader}</p>
                      <p className="text-xs text-muted-foreground font-mono-data">{g.groupId}</p>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="text-sm font-mono-data text-foreground">{g.pilgrims}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm font-mono-data text-foreground">SAR {fmtM(g.expectedRevenue)}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm font-mono-data text-[#16A34A] font-medium">SAR {fmtM(g.collectedRevenue)}</span>
                    </td>
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <span className="text-sm font-mono-data text-[#DC2626]">{g.refunds > 0 ? `−SAR ${fmtK(g.refunds)}` : '—'}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`text-sm font-mono-data font-semibold ${g.variance > 0 ? 'text-[#2563EB]' : g.variance < 0 ? 'text-[#DC2626]' : 'text-muted-foreground'}`}>
                        {g.variance > 0 ? '+' : ''}{g.variance === 0 ? '—' : `SAR ${fmtK(g.variance)}`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sc.color} ${sc.bg}`}>
                        <StatusIcon size={10} />
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="px-4 py-3 text-sm font-semibold text-foreground">Total (850 pilgrims)</td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  <span className="text-sm font-bold font-mono-data text-foreground">850</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-bold font-mono-data text-foreground">SAR {(totalExpected / 1_000_000).toFixed(2)}M</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-bold font-mono-data text-[#16A34A]">SAR {(totalCollected / 1_000_000).toFixed(2)}M</span>
                </td>
                <td className="px-3 py-3 text-right hidden md:table-cell">
                  <span className="text-sm font-bold font-mono-data text-[#DC2626]">−SAR {(totalRefunds / 1000).toFixed(0)}K</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className={`text-sm font-bold font-mono-data ${totalVariance >= 0 ? 'text-[#2563EB]' : 'text-[#DC2626]'}`}>
                    {totalVariance >= 0 ? '+' : ''}SAR {(totalVariance / 1000).toFixed(0)}K
                  </span>
                </td>
                <td className="px-3 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
