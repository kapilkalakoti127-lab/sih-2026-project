import { useState } from 'react';
import { ArrowRight, Inbox, MapPin, Package, Clock, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { RecyclerScreen, LotStatus } from '@/types';

interface IncomingProps {
  onNavigate: (screen: RecyclerScreen) => void;
}

export function IncomingLot({ onNavigate }: IncomingProps) {
  const { t, lots, collectorProfile, setActiveLotId } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'unquoted' | 'offered' | 'accepted' | 'completed'>('all');

  const filteredLots = lots.filter((lot) => {
    if (statusFilter === 'unquoted') return lot.status === 'Created' || lot.status === 'Priced' || lot.status === 'Matched';
    if (statusFilter === 'offered') return lot.status === 'Offered';
    if (statusFilter === 'accepted') return lot.status === 'Accepted';
    if (statusFilter === 'completed') return lot.status === 'Completed';
    return true;
  });

  const handleSelectLot = (lotId: string) => {
    setActiveLotId(lotId);
    onNavigate('lotDetail');
  };

  const getStatusBadge = (status: LotStatus) => {
    switch (status) {
      case 'Created':
      case 'Priced':
      case 'Matched':
        return <Badge variant="warning">Needs Offer</Badge>;
      case 'Offered':
        return <Badge variant="info">Offer Sent</Badge>;
      case 'Accepted':
        return <Badge variant="success"><Clock className="w-3 h-3" /> Accepted / Ready for Pickup</Badge>;
      case 'Completed':
        return <Badge variant="neutral"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-5 lg:p-8 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t('incoming_lot')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review, provide authorized pricing, and schedule collection for local collector lots.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: `All (${lots.length})` },
          {
            id: 'unquoted',
            label: `Needs Offer (${lots.filter((l) => ['Created', 'Priced', 'Matched'].includes(l.status)).length})`,
          },
          {
            id: 'offered',
            label: `Offer Sent (${lots.filter((l) => l.status === 'Offered').length})`,
          },
          {
            id: 'accepted',
            label: `Ready for Pickup (${lots.filter((l) => l.status === 'Accepted').length})`,
          },
          {
            id: 'completed',
            label: `Completed (${lots.filter((l) => l.status === 'Completed').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lots Stream */}
      {filteredLots.length === 0 ? (
        <Card className="text-center py-12">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-semibold text-gray-700">No lots in this section</p>
          <p className="text-sm text-gray-400 mt-1">
            When local kabadiwalas register new e-waste lots, they will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLots.map((lot) => {
            const displayValue = lot.totalOfferValue || lot.estimatedValue;
            return (
              <Card key={lot.lotId} className="p-0 overflow-hidden hover:border-gray-300 transition-colors">
                <div
                  className={`h-1.5 ${
                    lot.status === 'Accepted'
                      ? 'bg-green-500'
                      : lot.status === 'Completed'
                      ? 'bg-gray-400'
                      : lot.status === 'Offered'
                      ? 'bg-cyan-500'
                      : 'bg-amber-500'
                  }`}
                />
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-50 overflow-hidden flex items-center justify-center shrink-0 border border-green-100">
                        {lot.photoUrl ? (
                          <img
                            src={lot.photoUrl}
                            alt={lot.material}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Inbox className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold text-gray-800">{lot.lotId}</h2>
                          {getStatusBadge(lot.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Received {new Date(lot.createdAt).toLocaleDateString('en-IN')} · Collector: <span className="font-semibold text-gray-700">{collectorProfile.name}</span> ({collectorProfile.id})
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-600 font-semibold block">
                        {lot.offeredPricePerKg ? 'Offered Value' : t('estimated_value')}
                      </span>
                      <span className="text-xl font-bold text-gray-800">
                        ₹{displayValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <span className="text-gray-600 font-medium block">{t('material')}</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{lot.material}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <span className="text-gray-600 font-medium block">{t('weight')}</span>
                      <span className="font-bold text-gray-800 text-sm mt-0.5 block">{lot.weightKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <span className="text-gray-600 font-medium block">{t('location')}</span>
                      <span className="font-semibold text-gray-800 text-sm mt-0.5 block truncate">{lot.location}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <span className="text-gray-600 font-medium block">Rate / kg</span>
                      <span className="font-bold text-green-700 text-sm mt-0.5 block">
                        ₹{lot.offeredPricePerKg || lot.referencePricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Truck className="w-3.5 h-3.5 text-gray-600" />
                      <span>{lot.pickupAvailable ? 'Doorstep collection available' : 'Drop-off'}</span>
                    </div>
                    <Button size="sm" onClick={() => handleSelectLot(lot.lotId)}>
                      {lot.status === 'Accepted'
                        ? 'Verify Handover & Complete'
                        : lot.status === 'Offered'
                        ? 'Review / Update Offer'
                        : lot.status === 'Completed'
                        ? 'View Compliance Form-6'
                        : 'Review & Send Offer'}{' '}
                      <ArrowRight className="w-4 h-4 inline ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
