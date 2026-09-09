'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateFromSAR: number; // 1 SAR = X currency
}

export const CURRENCIES: Currency[] = [
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rateFromSAR: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rateFromSAR: 0.2667 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateFromSAR: 0.2453 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateFromSAR: 0.2103 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateFromSAR: 0.9796 },
  { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound', rateFromSAR: 13.12 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rateFromSAR: 74.5 },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateFromSAR: 29.3 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rateFromSAR: 4120 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rateFromSAR: 1.245 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rateFromSAR: 8.72 },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham', rateFromSAR: 2.67 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (amountSAR: number) => number;
  format: (amountSAR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  convert: (v) => v,
  format: (v) => `SAR ${v.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  const convert = (amountSAR: number) =>
    Math.round(amountSAR * currency.rateFromSAR * 100) / 100;

  const format = (amountSAR: number) => {
    const converted = convert(amountSAR);
    if (converted >= 1_000_000) {
      return `${currency.symbol} ${(converted / 1_000_000).toFixed(2)}M`;
    }
    if (converted >= 1_000) {
      return `${currency.symbol} ${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `${currency.symbol} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
