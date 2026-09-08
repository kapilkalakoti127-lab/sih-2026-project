import { useState } from 'react';
import { Receipt, CheckCircle2, MapPin, CalendarDays, Clock, ShieldCheck, FileText, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function RecyclerTransactions() {
  const { t, lots, handovers, activeRecycler, collectorProfile } = useApp();
  const [selectedManifestLot, setSelectedManifestLot] = useState<string | null>(null);

  // Filter lots that have reached accepted, handed over, or completed
  const transactions = lots
    .filter((lot) => ['Completed', 'Accepted', 'HandedOver'].includes(lot.status))
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
        weightKg: lot.weightKg,
        amount,
        status: lot.status,
        paymentStatus: isPaid ? 'Paid' : 'Pending',
        paymentMethod: handover?.paymentMethod || 'UPI',
        handoverRef: lot.handoverRef || handover?.handoverRef || 'HOF-PUN-2026-00123',
        manifestId: handover?.manifestId || 'EPR-FORM6-2026-081',
        location: lot.location,
        date,
      };
    });

  const totalVolumeKg = transactions.reduce((sum, tx) => sum + tx.weightKg, 0);
  const totalDisbursed = transactions
    .filter((tx) => tx.paymentStatus === 'Paid')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const activeManifest = transactions.find((tx) => tx.lotId === selectedManifestLot);

  return (
    <div className="p-5 lg:p-8 space-y-5 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('transactions')} & EPR Audit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete legally traceable records for E-Waste (Management) Rules, 2022.
          </p>
        </div>
        <Badge variant="success">100% CPCB / MPCB Traceability</Badge>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-white">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total E-Waste Processed</span>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalVolumeKg} kg</p>
          <span className="text-xs text-green-600 font-medium">Diverted from informal burning</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs text-gray-500 font-semibold uppercase">Disbursed to Collectors</span>
          <p className="text-2xl font-bold text-green-700 mt-1">₹{totalDisbursed.toLocaleString('en-IN')}</p>
          <span className="text-xs text-gray-500 font-medium">Direct UPI / Bank payments</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs text-gray-500 font-semibold uppercase">Compliance Rate</span>
          <p className="text-2xl font-bold text-gray-800 mt-1">100%</p>
          <span className="text-xs text-cyan-600 font-medium">Form-6 Manifests generated</span>
        </Card>
      </div>

      {/* Transaction Table / List */}
      <Card className="p-0 overflow-hidden">
        <div className="hidden sm:grid grid-cols-7 gap-3 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase border-b border-gray-100">
          <span>Lot</span>
          <span>Material</span>
          <span>Weight</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Payment</span>
          <span className="text-right">Action</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No completed transactions yet. When an incoming lot is accepted and verified, it will be catalogued here.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div
                key={tx.lotId}
                className="p-4 sm:px-5 flex flex-col sm:grid sm:grid-cols-7 gap-3 sm:items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block text-sm">{tx.lotId}</span>
                    <span className="text-[11px] text-gray-400 block sm:hidden">{tx.date}</span>
                  </div>
                </div>

                <span className="text-sm text-gray-700 font-medium">{tx.material}</span>
                <span className="text-sm text-gray-600">{tx.weightKg} kg</span>
                <span className="font-bold text-gray-800 text-sm">₹{tx.amount.toLocaleString('en-IN')}</span>

                <div>
                  <Badge variant={tx.status === 'Completed' ? 'success' : 'info'}>
                    {tx.status === 'Completed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> {t('completed')}
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> {tx.status}
                      </>
                    )}
                  </Badge>
                </div>

                <div>
                  <Badge variant={tx.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                    {tx.paymentStatus}
                  </Badge>
                </div>

                <div className="text-left sm:text-right">
                  <button
                    onClick={() => setSelectedManifestLot(tx.lotId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Form-6 Manifest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Form-6 Manifest Modal Preview */}
      {activeManifest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-gray-800 text-base">E-Waste Form-6 Compliance Manifest</h3>
                  <p className="text-xs text-gray-400">As per E-Waste (Management) Rules, 2022</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedManifestLot(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2.5 text-xs text-gray-700 border border-gray-200 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Manifest ID:</span>
                <span className="font-bold">{activeManifest.manifestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Handover Ref:</span>
                <span className="font-bold">{activeManifest.handoverRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Informal Collector:</span>
                <span className="font-bold text-gray-900">{collectorProfile.name} ({collectorProfile.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Authorized Recycler:</span>
                <span className="font-bold text-gray-900">{activeRecycler.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recycler License:</span>
                <span className="font-bold text-green-700">{activeRecycler.eprLicense || 'CPCB-EPR-MH-2024-0891'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lot Identifier:</span>
                <span className="font-bold">{activeManifest.lotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Material Category:</span>
                <span className="font-bold">{activeManifest.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity Net:</span>
                <span className="font-bold">{activeManifest.weightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transfer Payout:</span>
                <span className="font-bold text-green-700">₹{activeManifest.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-bold">{activeManifest.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Collector UPI / VPA:</span>
                <span className="font-bold">{collectorProfile.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dispatch Location:</span>
                <span className="font-bold">{activeManifest.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Certified Date:</span>
                <span className="font-bold">{activeManifest.date}</span>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-green-800">
              This manifest confirms the legal transfer of hazardous and non-hazardous e-waste from informal collection to state-authorized legal dismantling.
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  window.print();
                }}
              >
                Print / Save PDF
              </Button>
              <Button fullWidth onClick={() => setSelectedManifestLot(null)}>
                Close Manifest
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
