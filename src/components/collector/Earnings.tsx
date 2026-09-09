import { Wallet, ArrowDownLeft, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EarningsProps {
  onBack?: () => void;
}

export function Earnings({ onBack }: EarningsProps = {}) {
  const { t, lots, handovers } = useApp();

  // Compute earnings from lots that have been accepted, handed over, or completed
  const transactions = lots
    .filter((lot) => lot.status === 'Completed' || lot.status === 'Accepted' || lot.status === 'HandedOver')
    .map((lot) => {
      const handover = handovers[lot.lotId];
      const amount = handover?.finalValue ?? lot.totalOfferValue ?? lot.estimatedValue;
      const isPaid = lot.status === 'Completed' || handover?.paymentStatus === 'Paid';
      const date = lot.completedAt
        ? new Date(lot.completedAt).toLocaleDateString('en-IN')
        : new Date(lot.createdAt).toLocaleDateString('en-IN');

      return {
        lotId: lot.lotId,
        material: lot.material,
        amount,
        paymentStatus: (isPaid ? 'Paid' : 'Pending') as 'Paid' | 'Pending',
        date,
      };
    });

  const totalPaid = transactions
    .filter((tx) => tx.paymentStatus === 'Paid')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPending = transactions
    .filter((tx) => tx.paymentStatus === 'Pending')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalEarnings = totalPaid + totalPending;

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black border border-gray-200 shadow-2xs"
          >
            <span>←</span>
            <span>{t('back_btn')}</span>
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-800">{t('earnings')}</h1>
      </div>

      {/* Total */}
      <Card className="bg-green-600 border-green-600 p-5">
        <div className="flex items-center gap-2 text-green-100 mb-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-semibold">{t('total_earnings')}</span>
        </div>
        <p className="text-4xl font-bold text-white">
          ₹{totalEarnings.toLocaleString('en-IN')}
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-green-100 text-sm">
          <TrendingUp className="w-4 h-4" />
          Direct authorized recycler rate guarantee
        </div>
      </Card>

      {/* Paid / Pending */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{t('paid')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-sm text-gray-500">{t('pending')}</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
        </Card>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-2">
          {t('transaction_history')}
        </h2>
        {transactions.length === 0 ? (
          <Card className="p-5 text-center text-sm text-gray-500">
            No transactions yet. Complete your first e-waste handover to see payments here.
          </Card>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((transaction) => (
              <Card key={transaction.lotId} className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.paymentStatus === 'Paid'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {transaction.paymentStatus === 'Paid' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {transaction.lotId} — {transaction.material}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    <Badge variant={transaction.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                      {transaction.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
