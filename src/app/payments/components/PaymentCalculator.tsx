'use client';

import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, Users, Percent, DollarSign } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

const PACKAGE_TYPES = [
  { label: 'Economy', baseSAR: 12000 },
  { label: 'Standard', baseSAR: 15500 },
  { label: 'Premium', baseSAR: 18500 },
  { label: 'VIP', baseSAR: 24000 },
  { label: 'Custom', baseSAR: 0 },
];

export default function PaymentCalculator() {
  const { format, currency } = useCurrency();
  const [open, setOpen] = useState(true);
  const [packageType, setPackageType] = useState(PACKAGE_TYPES[1]);
  const [customBase, setCustomBase] = useState(15500);
  const [pilgrims, setPilgrims] = useState(850);
  const [discountPct, setDiscountPct] = useState(0);
  const [depositPct, setDepositPct] = useState(30);
  const [installments, setInstallments] = useState(3);

  const baseSAR = packageType.label === 'Custom' ? customBase : packageType.baseSAR;
  const priceAfterDiscount = baseSAR * (1 - discountPct / 100);
  const totalRevenue = priceAfterDiscount * pilgrims;
  const depositAmount = priceAfterDiscount * (depositPct / 100);
  const remainingAmount = priceAfterDiscount - depositAmount;
  const installmentAmount = installments > 0 ? remainingAmount / installments : remainingAmount;
  const totalDeposits = depositAmount * pilgrims;
  const totalInstallments = remainingAmount * pilgrims;

  return (
    <div className="card-base">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator size={16} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">Payment Calculator</h3>
            <p className="text-xs text-muted-foreground">Campaign revenue & installment planner</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      {open && (
        <div className="mt-5 space-y-5">
          {/* Inputs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Package Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Package Type</label>
              <select
                value={packageType.label}
                onChange={(e) => {
                  const found = PACKAGE_TYPES.find((p) => p.label === e.target.value);
                  if (found) setPackageType(found);
                }}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {PACKAGE_TYPES.map((p) => (
                  <option key={p.label} value={p.label}>
                    {p.label} {p.baseSAR > 0 ? `(SAR ${p.baseSAR.toLocaleString()})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom base price */}
            {packageType.label === 'Custom' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Base Price (SAR)</label>
                <input
                  type="number"
                  min={1000}
                  value={customBase}
                  onChange={(e) => setCustomBase(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {/* Number of pilgrims */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Users size={12} /> Number of Pilgrims
              </label>
              <input
                type="number"
                min={1}
                max={10000}
                value={pilgrims}
                onChange={(e) => setPilgrims(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Discount */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Percent size={12} /> Discount (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Deposit % */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign size={12} /> Deposit (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Installments */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Installments (after deposit)</label>
              <select
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[1, 2, 3, 4, 6, 12].map((n) => (
                  <option key={n} value={n}>{n} installment{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Calculation Results · {currency.code}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultCard
                label="Price per Pilgrim"
                value={format(priceAfterDiscount)}
                sub={discountPct > 0 ? `${discountPct}% off SAR ${baseSAR.toLocaleString()}` : `Base SAR ${baseSAR.toLocaleString()}`}
                color="text-primary"
              />
              <ResultCard
                label="Total Campaign Revenue"
                value={format(totalRevenue)}
                sub={`${pilgrims} pilgrims`}
                color="text-[#16A34A]"
              />
              <ResultCard
                label="Deposit per Pilgrim"
                value={format(depositAmount)}
                sub={`${depositPct}% upfront · ${format(totalDeposits)} total`}
                color="text-[#D97706]"
              />
              <ResultCard
                label={`Each Installment (×${installments})`}
                value={format(installmentAmount)}
                sub={`Remaining ${format(remainingAmount)} / pilgrim`}
                color="text-primary"
              />
            </div>
          </div>

          {/* Payment schedule bar */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Campaign Cash Flow Breakdown</p>
            <div className="flex rounded-full overflow-hidden h-4 w-full">
              <div
                className="bg-primary transition-all"
                style={{ width: `${depositPct}%` }}
                title={`Deposit: ${depositPct}%`}
              />
              <div
                className="bg-primary/40 transition-all"
                style={{ width: `${100 - depositPct}%` }}
                title={`Installments: ${100 - depositPct}%`}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                Deposit ({depositPct}%) — {format(totalDeposits)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary/40 inline-block" />
                Installments ({100 - depositPct}%) — {format(totalInstallments)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-muted rounded-xl p-3 space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-base font-bold font-mono-data ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
