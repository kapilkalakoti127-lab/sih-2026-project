import {
  MapPin,
  CheckCircle2,
  Truck,
  Star,
  ChevronLeft,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { demoRecycler } from '@/data/mockData';

interface RecyclerMatchProps {
  onViewOffer: () => void;
  onBack: () => void;
}

export function RecyclerMatch({ onViewOffer, onBack }: RecyclerMatchProps) {
  const { t, activeLot, offers, recyclers, selectRecyclerForLot } = useApp();

  const compatibleRecyclers = activeLot
    ? recyclers.filter((r) => r.materialsAccepted.includes(activeLot.material))
    : recyclers;

  const currentOffer = activeLot ? offers[activeLot.lotId] : null;
  const currentRecyclerId = activeLot?.matchedRecyclerId || currentOffer?.recycler?.id || recyclers[0].id;
  const matchedRecycler =
    recyclers.find((r) => r.id === currentRecyclerId) ||
    currentOffer?.recycler ||
    compatibleRecyclers[0] ||
    demoRecycler;

  const offeredPrice = currentOffer?.offeredPricePerKg ?? matchedRecycler.offeredPricePerKg;

  const matchReasons = [
    {
      icon: CheckCircle2,
      label: `${activeLot?.material || 'Material'} authorized processing facility`,
    },
    {
      icon: Star,
      label: `Competitive legal quote: ₹${offeredPrice}/kg (Above informal scrap benchmark)`,
    },
    { icon: MapPin, label: `Nearby facility: ${matchedRecycler.location}` },
    {
      icon: Truck,
      label: matchedRecycler.pickupAvailable ? t('pickup_available') : 'Drop-off required',
    },
    {
      icon: ShieldCheck,
      label: matchedRecycler.eprLicense
        ? `Verified EPR Lic: ${matchedRecycler.eprLicense}`
        : t('verified_authorized'),
    },
  ];

  return (
    <div className="px-4 py-4 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('back')}
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t('find_recycler')}</h1>
        {activeLot && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
            Lot: {activeLot.lotId} ({activeLot.material} · {activeLot.weightKg} kg)
          </span>
        )}
      </div>

      {/* Recycler Selection Carousel / Tabs */}
      {compatibleRecyclers.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
              {t('available_recyclers_label')} ({compatibleRecyclers.length})
            </label>
            <span className="text-[11px] text-gray-500 font-medium">
              Compare prices & pickup distance
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {compatibleRecyclers.slice(0, 3).map((r) => {
              const isSelected = r.id === matchedRecycler.id;
              const proximityTag = r.proximityKey || (r.distanceKm && r.distanceKm < 5 ? 'near' : r.distanceKm && r.distanceKm < 20 ? 'mid' : 'far');
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    if (activeLot) selectRecyclerForLot(activeLot.lotId, r.id);
                  }}
                  className={`p-3 rounded-2xl text-left border-2 transition-all ${
                    isSelected
                      ? 'border-green-600 bg-green-50/90 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      proximityTag === 'near'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : proximityTag === 'mid'
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}>
                      {t(proximityTag)} · {r.distanceKm} km
                    </span>
                    <span className="text-sm font-black text-green-700">
                      ₹{r.offeredPricePerKg}/kg
                    </span>
                  </div>
                  <p className={`font-bold text-xs truncate ${isSelected ? 'text-green-900' : 'text-gray-800'}`}>
                    {r.name.split(' ')[0]} {r.name.split(' ')[1] || ''}
                  </p>
                  <span className="text-[11px] text-gray-500 block truncate mt-0.5">
                    {r.location.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Match Score Badge */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200 shadow-xs">
            <span className="text-2xl font-bold text-green-600">
              {matchedRecycler.matchScore}%
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded shadow-xs uppercase whitespace-nowrap">
            {t('match_score')}
          </div>
        </div>
      </div>

      {/* Recycler Card */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {matchedRecycler.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="success">
                <CheckCircle2 className="w-3 h-3" />
                {t('verified_authorized')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-gray-700 bg-gray-50 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">{matchedRecycler.location}</span>
            </div>
            <span className="text-xs font-bold text-gray-600">
              {matchedRecycler.distanceKm} km ({t(matchedRecycler.proximityKey || 'near')})
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-700 bg-green-50/70 p-2.5 rounded-xl border border-green-200">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">{t('direct_legal_rate')}</span>
            </div>
            <span className="text-base font-black text-green-700">₹{offeredPrice}/kg</span>
          </div>

          <div className="flex items-center justify-between text-gray-700 p-1 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="font-medium">
                {matchedRecycler.pickupAvailable ? t('doorstep_collection') : t('drop_off_only')}
              </span>
            </div>
            {matchedRecycler.notes && (
              <span className="text-[11px] text-green-700 font-bold bg-green-100/80 px-2 py-0.5 rounded-md">
                {matchedRecycler.notes}
              </span>
            )}
          </div>

          {matchedRecycler.contactPerson && (
            <div className="flex items-center gap-2 text-gray-500 text-xs pt-2 border-t border-gray-100">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span>Contact: {matchedRecycler.contactPerson} · {matchedRecycler.phone}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Why Matched */}
      <Card>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          {t('why_matched')}
        </p>
        <div className="space-y-2">
          {matchReasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs sm:text-sm">{reason.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Button fullWidth size="lg" onClick={onViewOffer}>
        {t('view_offer')}
      </Button>
    </div>
  );
}
