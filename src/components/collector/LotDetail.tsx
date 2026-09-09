import { ChevronLeft, CheckCircle2, MapPin, Calendar, QrCode, Link2, TrendingUp, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { demoLot, demoHandover, getTraceabilityEventsForLot } from '@/data/mockData';

interface LotDetailProps {
  onBack: () => void;
}

export function LotDetail({ onBack }: LotDetailProps) {
  const { t, activeLot, handovers } = useApp();

  const currentLot = activeLot || demoLot;
  const currentHandover = handovers[currentLot.lotId] || {
    ...demoHandover,
    lotId: currentLot.lotId,
    material: currentLot.material,
    weightKg: currentLot.weightKg,
    finalValue: currentLot.totalOfferValue || currentLot.estimatedValue,
    confirmed: currentLot.status === 'Completed',
    paymentStatus: currentLot.paymentStatus || (currentLot.status === 'Completed' ? 'Paid' : 'Pending'),
  };

  const isConfirmed = currentHandover.confirmed || currentLot.status === 'Completed';

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const dynamicTraceability = getTraceabilityEventsForLot(currentLot, currentHandover);

  const baselineValue = currentLot.estimatedValue;
  const finalValue = currentHandover.finalValue || currentLot.totalOfferValue || baselineValue;
  const additionalEarning = Math.max(0, finalValue - baselineValue);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-black text-xs transition-colors shadow-2xs border border-gray-300"
        >
          <span className="text-base font-black">←</span>
          <span>{t('back_btn')}</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">{currentLot.lotId}</h1>
          <Badge variant={isConfirmed ? 'success' : 'info'}>
            <CheckCircle2 className="w-3 h-3" />
            {currentLot.status}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(currentLot.createdAt)}
        </span>
      </div>

      {/* Lot Details */}
      <Card>
        <div className="space-y-2.5 text-sm">
          <Row label={t('material')} value={t(currentLot.material)} />
          <Row label={t('weight')} value={`${currentLot.weightKg} kg`} />
          <Row label={t('location')} value={currentLot.location} />
          <Row label={t('reference_price')} value={`₹${currentLot.referencePricePerKg}/kg`} />
          <Row label={t('estimated_value')} value={`₹${baselineValue.toLocaleString('en-IN')}`} />
          <Row label={t('final_value')} value={`₹${finalValue.toLocaleString('en-IN')}`} highlight />
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('payment_status')}</span>
            <Badge variant={isConfirmed ? 'success' : 'warning'}>
              {currentHandover.paymentStatus || 'Pending'}
            </Badge>
          </div>
          {currentHandover.recyclerName && (
            <Row label={t('recycler')} value={currentHandover.recyclerName} />
          )}
        </div>
      </Card>

      {/* Handover Reference */}
      {(currentLot.handoverRef || currentHandover.handoverRef) && (
        <Card className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-gray-200 flex flex-col items-center justify-center p-1 shrink-0">
            <QrCode className="w-9 h-9 text-gray-400" />
            <span className="text-[7px] font-mono text-gray-400 mt-0.5">VERIFIED</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase">{t('handover_ref')}</p>
            <p className="font-bold text-gray-800 text-sm font-mono truncate">
              {currentLot.handoverRef || currentHandover.handoverRef}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(currentHandover.dateTime)}</p>
            {currentHandover.manifestId && (
              <p className="text-[11px] text-green-700 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Manifest: {currentHandover.manifestId}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Unit Economics */}
      <Card className="bg-cyan-50 border-cyan-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-cyan-600" />
          <p className="text-sm font-semibold text-cyan-800">{t('unit_economics')}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t('existing_value')}</span>
            <span className="font-semibold text-gray-700">₹{baselineValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t('platform_offer')}</span>
            <span className="font-semibold text-gray-700">₹{finalValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-cyan-200">
            <span className="text-cyan-700 font-medium">{t('additional_earning')}</span>
            <span className="font-bold text-green-600">
              +{additionalEarning > 0 ? `₹${additionalEarning.toLocaleString('en-IN')}` : t('fair_legal_premium')}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 font-medium">{t('middleman_loss_desc')}</p>
      </Card>

      {/* Traceability Timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-4 h-4 text-green-600" />
          <p className="text-sm font-semibold text-gray-700">{t('traceability')}</p>
        </div>
        <div className="space-y-0">
          {dynamicTraceability.map((event, i) => (
            <div key={event.step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    event.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {event.completed ? <CheckCircle2 className="w-4 h-4" /> : event.step}
                </div>
                {i < dynamicTraceability.length - 1 && (
                  <div
                    className={`w-0.5 h-6 ${
                      event.completed ? 'bg-green-300' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <p
                className={`text-sm pt-1 ${
                  event.completed ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {event.label}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-green-700 text-lg' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
