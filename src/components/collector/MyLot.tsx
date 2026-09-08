import { useState } from 'react';
import { Package, ChevronRight, CheckCircle2, Clock, Plus, WifiOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { CollectorScreen, LotStatus } from '@/types';

interface MyLotProps {
  onNavigate: (screen: CollectorScreen) => void;
}

export function MyLot({ onNavigate }: MyLotProps) {
  const { t, lots, setActiveLotId } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredLots = lots.filter((lot) => {
    if (filter === 'completed') return lot.status === 'Completed';
    if (filter === 'active') return lot.status !== 'Completed';
    return true;
  });

  const getStatusBadge = (status: LotStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant="success">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </Badge>
        );
      case 'Accepted':
      case 'Offered':
      case 'Matched':
        return (
          <Badge variant="info">
            <Clock className="w-3 h-3" /> {status}
          </Badge>
        );
      default:
        return <Badge variant="warning">{status}</Badge>;
    }
  };

  const handleSelectLot = (lotId: string) => {
    setActiveLotId(lotId);
    onNavigate('lotDetail');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t('my_lot')}</h1>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onNavigate('create')}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> {t('sell_ewaste')}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              filter === tab
                ? 'bg-white text-gray-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all'
              ? `${t('filter_all')} (${lots.length})`
              : tab === 'active'
              ? `${t('filter_active')} (${lots.filter((l) => l.status !== 'Completed').length})`
              : `${t('filter_completed')} (${lots.filter((l) => l.status === 'Completed').length})`}
          </button>
        ))}
      </div>

      {/* Lots List */}
      {filteredLots.length === 0 ? (
        <Card className="text-center py-8">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">{t('no_lots')}</p>
          <div className="mt-4">
            <Button size="sm" onClick={() => onNavigate('create')}>
              {t('sell_ewaste')}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLots.map((lot) => {
            const displayValue = lot.totalOfferValue || lot.estimatedValue;
            return (
              <Card
                key={lot.lotId}
                onClick={() => handleSelectLot(lot.lotId)}
                className="p-4 cursor-pointer hover:border-green-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 overflow-hidden flex items-center justify-center shrink-0 border border-green-100">
                    {lot.photoUrl ? (
                      <img
                        src={lot.photoUrl}
                        alt={lot.material}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-gray-800">{lot.lotId}</h2>
                      {getStatusBadge(lot.status)}
                      {lot.isOfflineDraft && (
                        <Badge variant="warning">
                          <WifiOff className="w-2.5 h-2.5" /> Draft
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {lot.material} · {lot.weightKg} kg · ₹{displayValue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {lot.location}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
