import {
  Camera,
  Tag,
  Wallet,
  Package,
  ShieldAlert,
  Volume2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { CollectorScreen } from '@/types';

import { speak } from '@/services/speech';

interface HomeProps {
  onNavigate: (screen: CollectorScreen) => void;
}

export function CollectorHome({ onNavigate }: HomeProps) {
  const { t, online, lots, handovers, setActiveLotId, language, collectorProfile } = useApp();

  const handleSpeakSafety = () => {
    speak(t('safety_reminder'), language);
  };

  // Compute today's real earnings from completed/paid lots
  const todayEarnings = lots
    .filter((l) => l.status === 'Completed')
    .reduce((sum, l) => {
      const h = handovers[l.lotId];
      return sum + (h?.finalValue || l.totalOfferValue || l.estimatedValue);
    }, 0);

  // Active / ongoing lot: highest priority is one that's Offered or Accepted or Created
  const ongoingLot =
    lots.find((l) => ['Offered', 'Accepted', 'Matched', 'Created'].includes(l.status)) ||
    lots[0];

  const recentLot = lots[0];

  const handleOpenLot = (lotId: string) => {
    setActiveLotId(lotId);
    onNavigate('lotDetail');
  };

  const handleOpenOngoing = () => {
    if (!ongoingLot) {
      onNavigate('create');
      return;
    }
    setActiveLotId(ongoingLot.lotId);
    if (ongoingLot.status === 'Offered') {
      onNavigate('offer');
    } else if (ongoingLot.status === 'Matched') {
      onNavigate('match');
    } else if (ongoingLot.status === 'Accepted') {
      onNavigate('handover');
    } else {
      onNavigate('lotDetail');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)]">
      {/* Subtle, professional low-opacity e-waste / electronics recycling background watermark */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.035] mix-blend-multiply z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=compress&cs=tinysrgb&w=1200")',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 px-4 py-4 space-y-4">
      {/* Greeting & Collector Identity Cardlet */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('namaste')}, {collectorProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">{t('tagline')}</p>
        </div>
        <div className="flex items-center gap-2">
          {!online && (
            <Badge variant="warning">
              <WifiOff className="w-3 h-3" /> Offline
            </Badge>
          )}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
            title="View Scrap Collector Profile & Unique ID"
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-mono text-xs font-bold text-green-800">
              {collectorProfile.id}
            </span>
          </button>
        </div>
      </div>

      {/* Sell E-Waste CTA */}
      <button
        onClick={() => onNavigate('create')}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <Camera className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{t('sell_ewaste')}</h2>
            <p className="text-green-50 text-sm font-medium">{t('legal_price_guarantee')}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* Recycler Offer Banner (if an offer is pending review) */}
      {ongoingLot && ongoingLot.status === 'Offered' && (
        <Card
          onClick={() => {
            setActiveLotId(ongoingLot.lotId);
            onNavigate('offer');
          }}
          className="bg-green-50 border-green-400 p-4 border-2 animate-pulse cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-extrabold text-green-800 uppercase tracking-wide">
                New Recycler Offer Available!
              </span>
              <p className="text-base font-bold text-gray-900 truncate">
                {ongoingLot.lotId}: ₹{ongoingLot.offeredPricePerKg}/kg offer received
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-700 shrink-0" />
          </div>
        </Card>
      )}

      {/* Today's Earnings & Recent Lot */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 cursor-pointer hover:border-green-300 transition-colors" onClick={() => onNavigate('earnings')}>
          <div className="flex items-center gap-2 mb-1.5">
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('todays_earnings')}
            </span>
          </div>
          <p className="text-2xl font-black text-gray-800">
            ₹{todayEarnings.toLocaleString('en-IN')}
          </p>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:border-cyan-300 transition-colors"
          onClick={() => (recentLot ? handleOpenLot(recentLot.lotId) : onNavigate('mylot'))}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Package className="w-5 h-5 text-cyan-600" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('recent_lot')}
            </span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="text-xl font-black text-gray-800 truncate">
              {recentLot ? recentLot.lotId : '0 Lots'}
            </span>
            {recentLot && (
              <Badge variant={recentLot.status === 'Completed' ? 'success' : 'info'}>
                {recentLot.status === 'Completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  recentLot.status
                )}
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Active Lot Card or Fresh Account Welcome */}
      {lots.length === 0 ? (
        <Card className="p-5 border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/40 text-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Welcome to Your Fresh Dashboard!</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
              Your collection ledger is clean and ready. Tap <strong>"Sell E-Waste"</strong> above to take a photo of your scrap, get instant AI categorization and price intelligence, and match with verified CPCB recyclers.
            </p>
          </div>
        </Card>
      ) : ongoingLot ? (
        <Card onClick={handleOpenOngoing} className="cursor-pointer hover:border-green-300 transition-colors p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {t('active_lot')}
            </span>
            <Badge
              variant={
                ongoingLot.status === 'Completed'
                  ? 'success'
                  : ongoingLot.status === 'Offered' || ongoingLot.status === 'Accepted'
                  ? 'info'
                  : 'warning'
              }
            >
              {ongoingLot.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-green-50 overflow-hidden flex items-center justify-center shrink-0 border border-green-100">
              {ongoingLot.photoUrl ? (
                <img
                  src={ongoingLot.photoUrl}
                  alt={ongoingLot.material}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-7 h-7 text-green-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base truncate">
                {ongoingLot.lotId} — {t(ongoingLot.material)}
              </p>
              <p className="text-sm font-semibold text-gray-500">
                {ongoingLot.weightKg} kg · ₹
                {(ongoingLot.totalOfferValue || ongoingLot.estimatedValue).toLocaleString('en-IN')}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 shrink-0" />
          </div>
        </Card>
      ) : null}

      {/* Safety Reminder */}
      <Card className="bg-amber-50 border-amber-200 p-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900 leading-snug">
              {t('safety_reminder')}
            </p>
          </div>
          <button
            onClick={handleSpeakSafety}
            className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 hover:bg-amber-300 transition-colors shadow-2xs"
            title={t('listen')}
          >
            <Volume2 className="w-5 h-5 text-amber-900" />
          </button>
        </div>
      </Card>

      {/* Offline notice */}
      {!online && (
        <Card className="bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-700 font-medium">
            {t('offline_msg')}
          </p>
        </Card>
      )}
      </div>
    </div>
  );
}
