'use client';

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { TrendingUp, TrendingDown, Plus, Download, Search, ChevronDown, ChevronUp, ChevronsUpDown, XCircle, ArrowUpRight, ArrowDownRight, BarChart3, Wallet, Bus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/AppIcon';


interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'revenue' | 'expense';
  amount: number;
  campaign: string;
  reference: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2026-10-01', description: 'Pilgrim Package Payment – Ahmad Al-Rashidi', category: 'Package Revenue', type: 'revenue', amount: 15800, campaign: 'Hajj 2027', reference: 'INV-2027-001', status: 'confirmed' },
  { id: 'TXN-002', date: '2026-10-02', description: 'Hotel Reservation – Makkah Grand', category: 'Accommodation', type: 'expense', amount: 42000, campaign: 'Hajj 2027', reference: 'EXP-HTL-001', status: 'confirmed' },
  { id: 'TXN-003', date: '2026-10-03', description: 'Pilgrim Package Payment – Fatima Al-Zahra (1st installment)', category: 'Package Revenue', type: 'revenue', amount: 8100, campaign: 'Hajj 2027', reference: 'INV-2027-002', status: 'confirmed' },
  { id: 'TXN-004', date: '2026-10-05', description: 'Flight Booking – MEA Group A (85 seats)', category: 'Flights', type: 'expense', amount: 127500, campaign: 'Hajj 2027', reference: 'EXP-FLT-001', status: 'confirmed' },
  { id: 'TXN-005', date: '2026-10-07', description: 'Pilgrim Package Payment – Khadija Noor', category: 'Package Revenue', type: 'revenue', amount: 17500, campaign: 'Hajj 2027', reference: 'REC-2027-001', status: 'confirmed' },
  { id: 'TXN-006', date: '2026-10-08', description: 'Bus Charter – Makkah–Madinah (10 buses)', category: 'Transportation', type: 'expense', amount: 18000, campaign: 'Hajj 2027', reference: 'EXP-BUS-001', status: 'confirmed' },
  { id: 'TXN-007', date: '2026-10-10', description: 'Visa Processing Fees – Batch 1 (120 pilgrims)', category: 'Visa & Admin', type: 'expense', amount: 14400, campaign: 'Hajj 2027', reference: 'EXP-VIS-001', status: 'confirmed' },
  { id: 'TXN-008', date: '2026-10-12', description: 'Pilgrim Package Payment – Amina Diallo', category: 'Package Revenue', type: 'revenue', amount: 15200, campaign: 'Hajj 2027', reference: 'INV-2027-005', status: 'confirmed' },
  { id: 'TXN-009', date: '2026-10-14', description: 'Travel Insurance – Group Policy (200 pilgrims)', category: 'Insurance', type: 'expense', amount: 12000, campaign: 'Hajj 2027', reference: 'EXP-INS-001', status: 'confirmed' },
  { id: 'TXN-010', date: '2026-10-15', description: 'Pilgrim Package Payment – Omar Farouq', category: 'Package Revenue', type: 'revenue', amount: 14800, campaign: 'Hajj 2027', reference: 'REC-2027-002', status: 'confirmed' },
  { id: 'TXN-011', date: '2026-10-18', description: 'Catering Contract – Mina Camp (7 days)', category: 'Catering', type: 'expense', amount: 35000, campaign: 'Hajj 2027', reference: 'EXP-CAT-001', status: 'pending' },
  { id: 'TXN-012', date: '2026-10-20', description: 'Pilgrim Package Payment – Zainab Al-Hussain (partial)', category: 'Package Revenue', type: 'revenue', amount: 5600, campaign: 'Hajj 2027', reference: 'INV-2027-006', status: 'confirmed' },
  { id: 'TXN-013', date: '2026-10-22', description: 'Hotel Reservation – Madinah Al-Noor', category: 'Accommodation', type: 'expense', amount: 28000, campaign: 'Hajj 2027', reference: 'EXP-HTL-002', status: 'confirmed' },
  { id: 'TXN-014', date: '2026-10-25', description: 'Group Leader Coordination Fees', category: 'Staff & Guides', type: 'expense', amount: 9600, campaign: 'Hajj 2027', reference: 'EXP-STF-001', status: 'confirmed' },
  { id: 'TXN-015', date: '2026-10-28', description: 'Miscellaneous Supplies – Ihram kits, luggage tags', category: 'Supplies', type: 'expense', amount: 4200, campaign: 'Hajj 2027', reference: 'EXP-SUP-001', status: 'confirmed' },
  { id: 'TXN-016', date: '2026-11-01', description: 'Flight Booking – MEA Group B (90 seats)', category: 'Flights', type: 'expense', amount: 135000, campaign: 'Hajj 2027', reference: 'EXP-FLT-002', status: 'pending' },
  { id: 'TXN-017', date: '2026-11-03', description: 'Visa Processing Fees – Batch 2 (80 pilgrims)', category: 'Visa & Admin', type: 'expense', amount: 9600, campaign: 'Hajj 2027', reference: 'EXP-VIS-002', status: 'pending' },
  { id: 'TXN-018', date: '2026-11-05', description: 'Pilgrim Package Payment – Tariq Noor (installment)', category: 'Package Revenue', type: 'revenue', amount: 8200, campaign: 'Hajj 2027', reference: 'INV-2027-004', status: 'confirmed' },
];

const monthlyData = [
  { month: 'Oct 26', revenue: 77200, expenses: 163200 },
  { month: 'Nov 26', revenue: 95400, expenses: 144600 },
  { month: 'Dec 26', revenue: 112000, expenses: 88000 },
  { month: 'Jan 27', revenue: 134000, expenses: 72000 },
  { month: 'Feb 27', revenue: 98000, expenses: 56000 },
  { month: 'Mar 27', revenue: 76000, expenses: 48000 },
];

const categoryExpenses = [
  { name: 'Flights', amount: 262500, color: '#1B6B4A' },
  { name: 'Accommodation', amount: 70000, color: '#C5A028' },
  { name: 'Transportation', amount: 18000, color: '#2563EB' },
  { name: 'Catering', amount: 35000, color: '#7C3AED' },
  { name: 'Visa & Admin', amount: 24000, color: '#D97706' },
  { name: 'Insurance', amount: 12000, color: '#16A34A' },
  { name: 'Staff & Guides', amount: 9600, color: '#DC2626' },
  { name: 'Supplies', amount: 4200, color: '#6B6560' },
];

type SortKey = 'date' | 'description' | 'amount' | 'type' | 'status';
type SortDir = 'asc' | 'desc';

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  pending: { label: 'Pending', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
  cancelled: { label: 'Cancelled', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
};

export default function RevenueExpensesPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'revenue' | 'expense'>('expense');

  const filtered = useMemo(() => {
    let rows = [...mockTransactions];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q));
    }
    if (filterType !== 'all') rows = rows.filter((r) => r.type === filterType);
    if (filterCategory !== 'all') rows = rows.filter((r) => r.category === filterCategory);
    rows.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [search, filterType, filterCategory, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={11} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-primary" /> : <ChevronDown size={11} className="text-primary" />;
  };

  const totalRevenue = mockTransactions.filter((t) => t.type === 'revenue' && t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = mockTransactions.filter((t) => t.type === 'expense' && t.status === 'confirmed').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalRevenue - totalExpenses;
  const pendingExpenses = mockTransactions.filter((t) => t.type === 'expense' && t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  const categories = Array.from(new Set(mockTransactions.map((t) => t.category)));

  const kpis = [
    { label: 'Total Revenue', value: `SAR ${(totalRevenue / 1000).toFixed(0)}K`, sub: 'confirmed receipts', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', icon: TrendingUp, trend: '+12%' },
    { label: 'Total Expenses', value: `SAR ${(totalExpenses / 1000).toFixed(0)}K`, sub: 'confirmed payments', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', icon: TrendingDown, trend: '+8%' },
    { label: 'Net Balance', value: `SAR ${Math.abs(netBalance / 1000).toFixed(0)}K`, sub: netBalance >= 0 ? 'surplus' : 'deficit', color: netBalance >= 0 ? 'text-primary' : 'text-[#DC2626]', bg: netBalance >= 0 ? 'bg-primary/10' : 'bg-[#FEF2F2]', icon: Wallet, trend: netBalance >= 0 ? 'Surplus' : 'Deficit' },
    { label: 'Pending Expenses', value: `SAR ${(pendingExpenses / 1000).toFixed(0)}K`, sub: 'awaiting confirmation', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', icon: BarChart3, trend: `${mockTransactions.filter((t) => t.status === 'pending').length} items` },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Revenue &amp; Expenses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Hajj 2027 · Campaign financial tracking and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary gap-2">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary gap-2">
            <Plus size={14} /> Add Entry
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Monthly Revenue vs Expenses */}
          <div className="xl:col-span-2 card-base">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Monthly Revenue vs Expenses</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Campaign financial flow (SAR)</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#1B6B4A] inline-block" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#DC2626] inline-block" />Expenses</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} barGap={4} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6560' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B6560' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value: number, name: string) => [`SAR ${(value / 1000).toFixed(0)}K`, name === 'revenue' ? 'Revenue' : 'Expenses']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
                />
                <Bar dataKey="revenue" fill="#1B6B4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#DC2626" radius={[4, 4, 0, 0]} opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="card-base">
            <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
            <div className="space-y-2.5">
              {categoryExpenses.map((cat) => {
                const totalExp = categoryExpenses.reduce((s, c) => s + c.amount, 0);
                const pct = Math.round((cat.amount / totalExp) * 100);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground font-medium">{cat.name}</span>
                      <span className="text-xs font-mono-data text-muted-foreground">SAR {(cat.amount / 1000).toFixed(0)}K · {pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="card-base p-0 overflow-hidden">
          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
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
                  className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-40"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="revenue">Revenue</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left">
                    <button onClick={() => toggleSort('date')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground">
                      Date <SortIcon col="date" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <button onClick={() => toggleSort('description')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground">
                      Description <SortIcon col="description" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</span>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <button onClick={() => toggleSort('type')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground mx-auto">
                      Type <SortIcon col="type" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-right">
                    <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground ml-auto">
                      Amount <SortIcon col="amount" />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left hidden md:table-cell">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reference</span>
                  </th>
                  <th className="px-3 py-2.5 text-center">
                    <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground mx-auto">
                      Status <SortIcon col="status" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn, i) => {
                  const sc = statusConfig[txn.status];
                  return (
                    <tr
                      key={txn.id}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 !== 0 ? 'bg-muted/10' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-mono-data text-foreground">{txn.date}</p>
                        <p className="text-xs text-muted-foreground font-mono-data">{txn.id}</p>
                      </td>
                      <td className="px-3 py-3 max-w-[240px]">
                        <p className="text-sm font-medium text-foreground leading-tight truncate">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">{txn.campaign}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{txn.category}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${txn.type === 'revenue' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
                          {txn.type === 'revenue' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {txn.type === 'revenue' ? 'Revenue' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className={`font-mono-data text-sm font-semibold ${txn.type === 'revenue' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {txn.type === 'revenue' ? '+' : '-'}SAR {txn.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="text-xs font-mono-data text-muted-foreground">{txn.reference}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <BarChart3 size={32} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No transactions match your filters</p>
            </div>
          )}

          {/* Footer summary */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">{filtered.length} transactions shown</p>
            <div className="flex items-center gap-4 text-xs font-mono-data">
              <span className="text-[#16A34A] font-semibold">
                +SAR {filtered.filter((t) => t.type === 'revenue').reduce((s, t) => s + t.amount, 0).toLocaleString()}
              </span>
              <span className="text-[#DC2626] font-semibold">
                -SAR {filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Add Financial Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <XCircle size={18} />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-border mb-5">
              <button
                onClick={() => setNewType('revenue')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${newType === 'revenue' ? 'bg-[#16A34A] text-white' : 'bg-muted text-muted-foreground hover:bg-input'}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setNewType('expense')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${newType === 'expense' ? 'bg-[#DC2626] text-white' : 'bg-muted text-muted-foreground hover:bg-input'}`}
              >
                Expense
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
                <input type="date" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
                <input type="text" placeholder="Enter description…" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
                  <select className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none">
                    {newType === 'revenue' ? (
                      <>
                        <option>Package Revenue</option>
                        <option>Visa Fees</option>
                        <option>Other Revenue</option>
                      </>
                    ) : (
                      <>
                        <option>Flights</option>
                        <option>Accommodation</option>
                        <option>Transportation</option>
                        <option>Catering</option>
                        <option>Visa & Admin</option>
                        <option>Insurance</option>
                        <option>Staff & Guides</option>
                        <option>Supplies</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Amount (SAR)</label>
                  <input type="number" placeholder="0.00" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Reference</label>
                <input type="text" placeholder="INV-XXX or EXP-XXX" className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="btn-primary flex-1 justify-center">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
