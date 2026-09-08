import {
  CheckCircle2,
  MapPin,
  Calendar,
  QrCode,
  Link2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  demoLot,
  demoHandover,
  getTraceabilityEventsForLot,
} from '@/data/mockData';

interface HandoverProps {
  onDone: () => void;
}

export function HandoverRecord({ onDone }: HandoverProps) {
  const { t, activeLot, handovers, completeHandover } = useApp();

  const currentLot = activeLot || demoLot;
  const currentHandover = handovers[currentLot.lotId] || {
    ...demoHandover,
    lotId: currentLot.lotId,
    material: currentLot.material,
    weightKg: currentLot.weightKg,
    finalValue: currentLot.totalOfferValue || currentLot.estimatedValue,
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

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Status Banner */}
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
            isConfirmed ? 'bg-green-100' : 'bg-cyan-100 animate-pulse'
          }`}
        >
          {isConfirmed ? (
            <CheckCircle2 className="w-9 h-9 text-green-600" strokeWidth={2.5} />
          ) : (
            <Clock className="w-9 h-9 text-cyan-600" strokeWidth={2.5} />
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          {isConfirmed ? t('handover_confirmed') : 'Offer Accepted & Scheduled'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isConfirmed
            ? `Lot ${currentLot.lotId} successfully handed over & paid`
            : `Lot ${currentLot.lotId} ready for authorized recycler pickup / weighing`}
        </p>
      </div>

      {/* Handover Details */}
      <Card>
        <div className="space-y-3 text-sm">
          <Row label={t('lot_id')} value={currentHandover.lotId} />
          <Row label={t('material')} value={t(currentHandover.material)} />
          <Row label={t('weight')} value={`${currentHandover.weightKg} kg`} />
          <Row label={t('recycler')} value={currentHandover.recyclerName} />
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('location')}</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {currentHandover.location}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('date_time')}</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(currentHandover.dateTime)}
            </span>
          </div>
          <Row
            label={t('final_value')}
            value={`₹${currentHandover.finalValue.toLocaleString('en-IN')}`}
            highlight
          />
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('payment_status')}</span>
            <Badge variant={isConfirmed ? 'success' : 'warning'}>
              {isConfirmed ? 'Paid via UPI' : 'Pending Physical Verification'}
            </Badge>
          </div>
          {currentHandover.vehicleNumber && (
            <Row label="Collection Vehicle" value={currentHandover.vehicleNumber} />
          )}
          {currentHandover.driverName && (
            <Row label="Assigned Driver" value={currentHandover.driverName} />
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('recycler_confirmation')}</span>
            <Badge variant={isConfirmed ? 'success' : 'info'}>
              {isConfirmed ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  {t('confirmed')}
                </>
              ) : (
                'Awaiting Physical Weighing'
              )}
            </Badge>
          </div>
          {currentHandover.manifestId && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                {t('compliance_manifest')}
              </span>
              <span className="text-xs font-mono font-bold text-gray-700">
                {currentHandover.manifestId}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Handover Reference + QR */}
      <Card className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl bg-gray-50 border-2 border-gray-200 flex flex-col items-center justify-center p-1 shrink-0">
          <QrCode className="w-12 h-12 text-green-700" />
          <span className="text-[8px] font-mono text-gray-500 uppercase mt-0.5">VERIFIED</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase">
            {t('handover_ref')}
          </p>
          <p className="font-bold text-gray-800 text-sm truncate font-mono">
            {currentHandover.handoverRef}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Show this QR / Ref to the authorized collector vehicle driver
          </p>
        </div>
      </Card>

      {/* Traceability Timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-4 h-4 text-green-600" />
          <p className="text-sm font-semibold text-gray-700">
            {t('traceability')} Chain (CPCB Guidelines)
          </p>
        </div>
        <div className="space-y-0">
          {dynamicTraceability.map((event, i) => (
            <div key={event.step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    event.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {event.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    event.step
                  )}
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

      {/* If not confirmed yet, allow direct simulated confirmation on collector side */}
      {!isConfirmed && (
        <Card className="bg-green-50 border-green-200">
          <p className="text-xs text-green-800 font-medium mb-3">
            Simulate on-the-spot physical weighing & instant UPI payment:
          </p>
          <Button
            fullWidth
            variant="primary"
            onClick={() => completeHandover(currentLot.lotId, 'UPI')}
          >
            Confirm Physical Handover & Disburse Payment
          </Button>
        </Card>
      )}

      <Button fullWidth size="lg" onClick={onDone}>
        {t('earnings')}
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-semibold ${highlight ? 'text-green-700 text-lg' : 'text-gray-800'}`}
      >
        {value}
      </span>
    </div>
  );
}
