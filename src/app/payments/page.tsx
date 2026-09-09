import React from 'react';
import AppLayout from '@/components/AppLayout';
import PaymentHeader from './components/PaymentHeader';
import PaymentMetrics from './components/PaymentMetrics';
import PaymentTable from './components/PaymentTable';
import TransactionHistory from './components/TransactionHistory';
import RefundManagement from './components/RefundManagement';
import FinancialReconciliation from './components/FinancialReconciliation';
import PaymentCalculator from './components/PaymentCalculator';

export default function PaymentsPage() {
  return (
    <AppLayout>
      <PaymentHeader />
      <div className="p-6 space-y-6">
        <PaymentMetrics />

        {/* Payment Calculator */}
        <PaymentCalculator />

        {/* Pilgrim Payment Status */}
        <PaymentTable />

        {/* Transaction History — full width */}
        <TransactionHistory />

        {/* Refund Handling + Reconciliation side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RefundManagement />
          <FinancialReconciliation />
        </div>
      </div>
    </AppLayout>
  );
}
