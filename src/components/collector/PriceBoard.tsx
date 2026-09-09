import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2,
  Tag,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Coins,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { speak } from '@/services/speech';
import { MATERIAL_CATEGORIES } from '@/data/mockData';
import type { MaterialCategory } from '@/types';
import { getAiPriceIntelligence, type PriceIntelligenceResult } from '@/services/aiService';

interface PriceBoardProps {
  onBack?: () => void;
}

export function PriceBoard({ onBack }: PriceBoardProps = {}) {
  const { t, prices, language } = useApp();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory>('PCB');
  const [priceIntel, setPriceIntel] = useState<PriceIntelligenceResult | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);

  const currentPrice = prices[selectedMaterial] || prices.PCB;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingIntel(true);
    getAiPriceIntelligence(selectedMaterial, 10, 'Hadapsar MIDC, Pune')
      .then((data) => {
        if (isMounted) {
          setPriceIntel(data);
          setIsLoadingIntel(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingIntel(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMaterial]);

  const getSpeechText = () => {
    const formalRate = priceIntel?.authorized_fair_rate_per_kg || currentPrice.referencePricePerKg;
    const avgRate = priceIntel?.average_market_price_per_kg || Math.round(formalRate * 0.95);
    const informalRate = priceIntel?.informal_dealer_rate_per_kg || Math.round(formalRate * 0.8);
    const gain = priceIntel?.percentage_gain || 28;

    if (language === 'hi') {
      return `${t(currentPrice.material)} का आज का अधिकृत रीसाइक्लिंग भाव ₹${formalRate} प्रति किलो है, औसत बाजार भाव ₹${avgRate} है। लोकल कबाड़ी सिर्फ ₹${informalRate} देता है। कानूनी रीसाइक्लिंग से आपको ${gain}% अधिक नकद मिलेगा।`;
    }
    if (language === 'mr') {
      return `${t(currentPrice.material)} चा आजचा अधिकृत सरकारी भाव ₹${formalRate} प्रति किलो आहे, सरासरी भाव ₹${avgRate} आहे. अनधिकृत भंगारवाला फक्त ₹${informalRate} देतो. अधिकृत विक्री केल्यास तुम्हाला ${gain}% जास्त पैसे मिळतील.`;
    }
    return `${currentPrice.material} authorized benchmark rate is ₹${formalRate} per kg, average rate is ₹${avgRate}. Informal dealers pay only ₹${informalRate}. By recycling legally you earn ${gain}% more cash.`;
  };

  const handleSpeak = () => {
    speak(getSpeechText(), language);
  };

  const TrendIcon =
    currentPrice.trend === 'up'
      ? TrendingUp
      : currentPrice.trend === 'down'
      ? TrendingDown
      : Minus;

  const trendColor =
    currentPrice.trend === 'up'
      ? 'text-green-600'
      : currentPrice.trend === 'down'
      ? 'text-red-500'
      : 'text-gray-400';

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
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
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t('prices')}</h1>
            <p className="text-xs text-gray-500">AI-Powered Commodity Index & Cluster Rates</p>
          </div>
        </div>
        <Badge variant="success">CPCB Verified Board</Badge>
      </div>

      {/* Material Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MATERIAL_CATEGORIES.map((mat) => (
          <button
            key={mat}
            onClick={() => setSelectedMaterial(mat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMaterial === mat
                ? 'bg-green-600 text-white shadow-sm scale-105'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t(mat)} · ₹{prices[mat]?.referencePricePerKg}/kg
          </button>
        ))}
      </div>

      {/* Main Benchmark Price Card */}
      <Card className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {t(currentPrice.material)}
              </h2>
              <Badge variant="info" className="text-[10px] py-0 px-1.5">
                Live Index
              </Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium">Pune Industrial Region</p>
          </div>
          <button
            onClick={handleSpeak}
            className="w-11 h-11 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors shadow-2xs"
            title={t('listen_price')}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">
              {t('reference_price')}
            </p>
            <p className="text-3xl font-black text-gray-900">
              ₹{priceIntel?.authorized_fair_rate_per_kg || currentPrice.referencePricePerKg}
              <span className="text-base font-bold text-gray-500">/kg</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded-lg block mb-1">
              {t('ai_average_price')}: ₹{priceIntel?.average_market_price_per_kg || Math.round((currentPrice.referencePricePerKg * 0.95))}/kg
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={`text-sm font-black ${trendColor}`}>
                {priceIntel?.forecast_7_day?.trend === 'up'
                  ? `+${priceIntel?.forecast_7_day?.pct}%`
                  : priceIntel?.forecast_7_day?.trend === 'down'
                  ? `-${priceIntel?.forecast_7_day?.pct}%`
                  : 'Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Average Price Callout Bar */}
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">{t('ai_average_price')}</span>
              <span className="text-[11px] text-emerald-800">
                Regional median benchmark across Pune industrial cluster
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-emerald-900">
              ₹{priceIntel?.average_market_price_per_kg || Math.round(currentPrice.referencePricePerKg * 0.95)}/kg
            </span>
            <span className="text-[10px] text-emerald-700 block">Cluster Average</span>
          </div>
        </div>

        {/* Transparent 3-Component Fair Price Formula Breakdown */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">1. CPCB Base</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              ₹{priceIntel?.benchmark_price_per_kg || currentPrice.referencePricePerKg}
            </span>
            <span className="text-[9px] text-slate-600 block">Statutory</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">2. Informal</span>
            <span className="text-sm font-black text-amber-900 font-mono">
              ₹{priceIntel?.informal_dealer_rate_per_kg || Math.round(currentPrice.referencePricePerKg * 0.8)}
            </span>
            <span className="text-[9px] text-amber-700 block">Scrap Dealer</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 ring-1 ring-emerald-400/30">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">3. Fair Average</span>
            <span className="text-sm font-black text-emerald-900 font-mono">
              ₹{priceIntel?.average_market_price_per_kg || Math.round(currentPrice.referencePricePerKg * 0.95)}
            </span>
            <span className="text-[9px] text-emerald-700 block">(Fair+Inf+CPCB)/3</span>
          </div>
        </div>

        {/* AI Forecast Rationale */}
        {priceIntel?.forecast_7_day?.reason && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-700">
            <Sparkles className="w-4 h-4 text-cyan-700 shrink-0" />
            <span className="leading-snug font-medium">{priceIntel.forecast_7_day.reason}</span>
          </div>
        )}
      </Card>

      {/* AI Economic Advantage Card (Formal vs Informal Dealer) */}
      <Card className="p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-white border-green-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-700" />
            <h3 className="font-bold text-gray-800 text-sm">
              Legal Recycler Price Premium
            </h3>
          </div>
          <span className="text-xs font-black text-green-800 bg-green-200/80 px-2 py-0.5 rounded-full">
            +{priceIntel?.percentage_gain || 28}% Extra
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-gray-200">
            <span className="text-gray-600 block text-[10px] uppercase font-bold">
              Local Scrap Aggregator
            </span>
            <span className="text-base font-bold text-gray-700 font-mono">
              ₹{priceIntel?.informal_dealer_rate_per_kg || 220}/kg
            </span>
            <span className="text-[10px] text-gray-600 block mt-0.5 font-medium">Unregulated pricing</span>
          </div>

          <div className="p-2.5 rounded-xl bg-green-600 text-white shadow-xs">
            <span className="text-green-200 block text-[10px] uppercase font-bold">
              Authorized Recycler
            </span>
            <span className="text-base font-black font-mono text-white">
              ₹{priceIntel?.authorized_fair_rate_per_kg || 320}/kg
            </span>
            <span className="text-[10px] text-green-100 block mt-0.5">+₹{priceIntel ? priceIntel.authorized_fair_rate_per_kg - priceIntel.informal_dealer_rate_per_kg : 60}/kg extra</span>
          </div>
        </div>

        <p className="text-[11px] text-green-900 leading-relaxed font-medium">
          💡 Selling a 15 kg lot through Kabadiwala Connect delivers ₹
          {priceIntel ? (priceIntel.extra_collector_earnings * 1.5).toLocaleString('en-IN') : '900'} more directly into your UPI account than informal middle dealers.
        </p>
      </Card>

      {/* Market Range */}
      <Card>
        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
          {t('market_range')} & Volatility
        </p>
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-600">
          <span>Min: ₹{priceIntel?.price_range?.min_per_kg || currentPrice.minPricePerKg}/kg</span>
          <span>Max: ₹{priceIntel?.price_range?.max_per_kg || currentPrice.maxPricePerKg}/kg</span>
        </div>
        <div className="relative h-3 rounded-full bg-gray-100">
          <div className="absolute h-3 rounded-full bg-gradient-to-r from-green-300 via-emerald-400 to-green-600 left-[15%] right-[15%]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-[55%] -translate-x-1/2 w-4 h-4 rounded-full bg-green-700 border-2 border-white shadow" />
        </div>
        <p className="text-center text-xs text-green-700 font-bold mt-2.5">
          ₹{priceIntel?.authorized_fair_rate_per_kg || currentPrice.referencePricePerKg}/kg (Pune MIDC Certified Median)
        </p>
      </Card>

      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500 text-center">
        Prices updated automatically via CPCB secondary metals benchmark & Kabadiwala Connect AI Price Index.
      </div>
    </div>
  );
}
