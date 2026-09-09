import { ChevronLeft, CheckCircle2, Truck, ShieldCheck, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { demoLot, demoRecycler, demoOffer } from '@/data/mockData';

interface OfferProps {
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
}

import { speak } from '@/services/speech';

export function OfferScreen({ onAccept, onDecline, onBack }: OfferProps) {
  const { t, activeLot, offers, acceptOffer, declineOffer, language } = useApp();

  const currentLot = activeLot || demoLot;
  const currentOffer = offers[currentLot.lotId] || demoOffer;
  const recycler = currentOffer.recycler || demoRecycler;

  const offeredRate = currentOffer.offeredPricePerKg;
  const totalValue = currentOffer.totalValue;
  const baselineValue = currentLot.estimatedValue;
  const extraEarning = Math.max(0, totalValue - baselineValue);

  const getSpeechText = () => {
    if (language === 'hi') {
      return `अधिकृत रीसायकलर ${recycler.name} ने आपके ${currentLot.weightKg} किलो ${currentLot.material} के लिए ${offeredRate} रुपये प्रति किलो का ऑफर दिया है। कुल भुगतान ${totalValue} रुपये होगा और निःशुल्क पिकअप वाहन शामिल है।`;
    }
    if (language === 'mr') {
      return `अधिकृत रीसायकलर ${recycler.name} यांनी आपल्या ${currentLot.weightKg} किलो ${currentLot.material} साठी ${offeredRate} रुपये प्रति किलोचा दर दिला आहे. एकूण रक्कम ${totalValue} रुपये असून मोफत पिकअप वाहन समाविष्ट आहे.`;
    }
    return `Authorized recycler ${recycler.name} has offered ${offeredRate} rupees per kilogram for ${currentLot.weightKg} kilograms of ${currentLot.material}. Total payment is ${totalValue} rupees with free pickup included.`;
  };

  const handleSpeak = () => {
    speak(getSpeechText(), language);
  };

  const handleAccept = () => {
    acceptOffer(currentLot.lotId);
    onAccept();
  };

  const handleDecline = () => {
    declineOffer(currentLot.lotId);
    onDecline();
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('back')}
        </button>
        <button
          onClick={handleSpeak}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold transition-colors border border-green-200 shadow-2xs"
          title="Listen to offer"
        >
          <Volume2 className="w-4 h-4 text-green-600" />
          <span>{t('listen')}</span>
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-800">{t('recycler_offer')}</h1>

      {/* Your Lot */}
      <Card>
        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
          {t('your_lot')}
        </p>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('lot_id')}</span>
            <span className="font-semibold text-gray-800">{currentLot.lotId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('material')}</span>
            <span className="font-semibold text-gray-800">{t(currentLot.material)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('weight')}</span>
            <span className="font-semibold text-gray-800">{currentLot.weightKg} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('reference_price')}</span>
            <span className="font-semibold text-gray-800">
              ₹{currentLot.referencePricePerKg}/kg
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('estimated_value')}</span>
            <span className="font-semibold text-gray-800">
              ₹{baselineValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Card>

      {/* Recycler Offer */}
      <Card className="border-green-200 bg-green-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <p className="text-xs font-semibold text-green-700 uppercase">
              {t('recycler_offer')}
            </p>
          </div>
          <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
            CPCB Registered
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {recycler.name}
        </h2>
        {recycler.eprLicense && (
          <p className="text-xs text-gray-600 font-mono mb-3">
            Lic: {recycler.eprLicense}
          </p>
        )}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t('offer')}</span>
            <span className="font-semibold text-gray-800">
              ₹{offeredRate}/kg
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{t('total')}</span>
            <span className="text-xl font-bold text-green-700">
              ₹{totalValue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Truck className="w-4 h-4 text-green-500" />
            {currentOffer.pickupAvailable ? t('pickup_available') : 'Self drop-off'}
          </div>
          {currentOffer.notes && (
            <p className="text-xs text-gray-500 italic mt-1 pt-1 border-t border-green-100">
              "{currentOffer.notes}"
            </p>
          )}
        </div>
      </Card>

      {/* Extra earning highlight */}
      <Card className="bg-cyan-50 border-cyan-100">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
          <p className="text-sm text-cyan-800 font-medium">
            {extraEarning > 0
              ? `You earn ₹${extraEarning.toLocaleString('en-IN')} more than the informal scrap benchmark!`
              : `Guaranteed legal price with authorized CPCB recycling documentation.`}
          </p>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" fullWidth onClick={handleDecline}>
          {t('decline')}
        </Button>
        <Button size="lg" fullWidth onClick={handleAccept}>
          {t('accept_offer')}
        </Button>
      </div>
    </div>
  );
}
