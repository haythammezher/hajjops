'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BarChart3, Download, FileText, Users, CreditCard, Plane, Building2, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet, FileBarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/AppIcon';


const pilgrimsByNationality = [
  { name: 'Saudi Arabia', value: 210, color: '#1B6B4A' },
  { name: 'Egypt', value: 145, color: '#C5A028' },
  { name: 'Pakistan', value: 130, color: '#2563EB' },
  { name: 'Morocco', value: 98, color: '#7C3AED' },
  { name: 'Indonesia', value: 87, color: '#D97706' },
  { name: 'Other', value: 180, color: '#6B6560' },
];

const visaStatusData = [
  { name: 'Approved', value: 612, color: '#16A34A' },
  { name: 'Pending', value: 138, color: '#D97706' },
  { name: 'Processing', value: 64, color: '#2563EB' },
  { name: 'Rejected', value: 18, color: '#DC2626' },
  { name: 'Not Started', value: 18, color: '#6B6560' },
];

const paymentTrendData = [
  { month: 'Oct', collected: 77200, target: 120000 },
  { month: 'Nov', collected: 95400, target: 120000 },
  { month: 'Dec', collected: 112000, target: 120000 },
  { month: 'Jan', collected: 134000, target: 140000 },
  { month: 'Feb', collected: 98000, target: 110000 },
  { month: 'Mar', collected: 76000, target: 90000 },
];

const groupProgressData = [
  { group: 'GRP-001', total: 45, complete: 42, label: 'Sheikh Ahmed' },
  { group: 'GRP-002', total: 38, complete: 31, label: 'Dr. Fatima' },
  { group: 'GRP-003', total: 52, complete: 48, label: 'Ustaz Khalid' },
  { group: 'GRP-004', total: 29, complete: 20, label: 'Hajja Maryam' },
  { group: 'GRP-005', total: 41, complete: 38, label: 'Sheikh Omar' },
];

const reportTemplates = [
  { id: 'pilgrim-list', label: 'Pilgrim Master List', icon: Users, desc: 'Full pilgrim roster with status', format: 'Excel' },
  { id: 'visa-status', label: 'Visa Status Report', icon: FileText, desc: 'Visa approvals, pending, rejections', format: 'PDF' },
  { id: 'payment-summary', label: 'Payment Summary', icon: CreditCard, desc: 'Collections, outstanding, overdue', format: 'Excel' },
  { id: 'flight-manifest', label: 'Flight Manifest', icon: Plane, desc: 'Passenger list by flight', format: 'PDF' },
  { id: 'hotel-allocation', label: 'Hotel Allocation', icon: Building2, desc: 'Room assignments by hotel', format: 'Excel' },
  { id: 'financial-report', label: 'Financial Report', icon: BarChart3, desc: 'Revenue, expenses, net balance', format: 'PDF' },
];

const kpis = [
  { label: 'Total Pilgrims', value: '850', sub: '612 fully processed', icon: Users, color: 'text-primary', bg: 'bg-primary/10', trend: '+23 this week' },
  { label: 'Visa Approved', value: '72%', sub: '612 of 850', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', trend: '+5% vs last month' },
  { label: 'Payments Collected', value: 'SAR 593K', sub: 'of SAR 850K target', icon: CreditCard, color: 'text-[#C5A028]', bg: 'bg-[#FFFBEB]', trend: '69.8% collected' },
  { label: 'Pending Actions', value: '47', sub: 'across all modules', icon: AlertTriangle, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', trend: '12 urgent' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'export'>('overview');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [dateRange, setDateRange] = useState('last-30');
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (reportId: string) => {
    setExporting(reportId);
    setTimeout(() => setExporting(null), 1800);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Reports &amp; Export</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Hajj 2027 · Campaign analytics and data exports</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
          >
            <option value="last-7">Last 7 days</option>
            <option value="last-30">Last 30 days</option>
            <option value="last-90">Last 90 days</option>
            <option value="campaign">Full Campaign</option>
          </select>
          <button className="btn-primary gap-2 text-xs">
            <Download size={13} /> Export All
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {(['overview', 'export'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' ? 'Analytics Overview' : 'Export Reports'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {kpis.map((k) => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="card-base flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center`}>
                        <Icon size={18} className={k.color} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${k.bg} ${k.color}`}>{k.trend}</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
                      <p className={`text-2xl font-bold font-mono-data mt-0.5 ${k.color}`}>{k.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Payment Trend */}
              <div className="xl:col-span-2 card-base">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Payment Collection Trend</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Monthly collected vs target (SAR)</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-sm bg-primary inline-block" />Collected</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-sm bg-muted-foreground/40 inline-block" />Target</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={paymentTrendData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6560' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6B6560' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [`SAR ${(value / 1000).toFixed(0)}K`, name === 'collected' ? 'Collected' : 'Target']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
                    />
                    <Line type="monotone" dataKey="collected" stroke="#1B6B4A" strokeWidth={2.5} dot={{ r: 4, fill: '#1B6B4A' }} />
                    <Line type="monotone" dataKey="target" stroke="#6B6560" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Visa Status Pie */}
              <div className="card-base">
                <h3 className="text-sm font-semibold text-foreground mb-4">Visa Status Breakdown</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={visaStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {visaStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number, name: string) => [v, name]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {visaStatusData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </span>
                      <span className="text-xs font-mono-data font-semibold text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Nationality Distribution */}
              <div className="card-base">
                <h3 className="text-sm font-semibold text-foreground mb-4">Pilgrims by Nationality</h3>
                <div className="space-y-2.5">
                  {pilgrimsByNationality.map((n) => {
                    const total = pilgrimsByNationality.reduce((s, x) => s + x.value, 0);
                    const pct = Math.round((n.value / total) * 100);
                    return (
                      <div key={n.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-foreground font-medium">{n.name}</span>
                          <span className="text-xs font-mono-data text-muted-foreground">{n.value} · {pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: n.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group Progress */}
              <div className="card-base">
                <h3 className="text-sm font-semibold text-foreground mb-4">Group Completion Progress</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={groupProgressData} layout="vertical" barCategoryGap="25%">
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#6B6560' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#6B6560' }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      formatter={(v: number, name: string) => [v, name === 'complete' ? 'Processed' : 'Total']}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--border)' }}
                    />
                    <Bar dataKey="total" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="complete" fill="#1B6B4A" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            {/* Export Format Selector */}
            <div className="card-base">
              <h3 className="text-sm font-semibold text-foreground mb-3">Export Format</h3>
              <div className="flex gap-3">
                {(['excel', 'pdf', 'csv'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      exportFormat === fmt
                        ? 'border-primary bg-primary/10 text-primary' :'border-border bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {fmt === 'excel' && <FileSpreadsheet size={14} />}
                    {fmt === 'pdf' && <FileText size={14} />}
                    {fmt === 'csv' && <FileBarChart2 size={14} />}
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {reportTemplates.map((r) => {
                const Icon = r.icon;
                const isExporting = exporting === r.id;
                return (
                  <div key={r.id} className="card-base flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        Default: {r.format}
                      </span>
                      <button
                        onClick={() => handleExport(r.id)}
                        disabled={isExporting}
                        className="btn-primary text-xs gap-1.5 py-1.5 px-3"
                      >
                        {isExporting ? (
                          <>
                            <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Generating…
                          </>
                        ) : (
                          <>
                            <Download size={12} /> Export {exportFormat.toUpperCase()}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scheduled Reports */}
            <div className="card-base">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Scheduled Reports</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Automated report delivery</p>
                </div>
                <button className="btn-secondary text-xs gap-1.5">
                  <Clock size={12} /> Schedule New
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Weekly Pilgrim Status', freq: 'Every Monday 08:00', recipient: 'campaign-manager@hajjops.com', active: true },
                  { name: 'Monthly Financial Summary', freq: '1st of each month', recipient: 'finance@hajjops.com', active: true },
                  { name: 'Daily Visa Update', freq: 'Daily 18:00', recipient: 'visa-team@hajjops.com', active: false },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-[#16A34A]' : 'bg-muted-foreground/40'}`} />
                      <div>
                        <p className="text-xs font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.freq} · {s.recipient}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-muted text-muted-foreground'}`}>
                      {s.active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
