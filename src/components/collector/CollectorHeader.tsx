import { Recycle, Wifi, WifiOff, Globe, X, Building2, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Language } from '@/types';

export function CollectorHeader() {
  const { t, online, setOnline, language, setLanguage, setRole } = useApp();

  const cycleLanguage = () => {
    const order: Language[] = ['en', 'hi', 'mr'];
    const idx = order.indexOf(language);
    setLanguage(order[(idx + 1) % order.length]);
  };

  const langLabel: Record<Language, string> = {
    en: 'EN',
    hi: 'हि',
    mr: 'मर',
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-xs">
            <Recycle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-gray-800 text-base leading-tight block">
              {t('app_name')}
            </span>
            <span className="text-[11px] text-green-700 font-bold tracking-wide block">
              {t('collector_demo')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to Recycler */}
          <button
            onClick={() => setRole('recycler')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-xs font-bold transition-colors shadow-2xs"
            title="Switch to authorized recycler interface"
          >
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline">Recycler</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-bold text-gray-700"
            title="Switch language"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            {langLabel[language]}
          </button>

          {/* Online / Offline Simulation Toggle */}
          <button
            onClick={() => setOnline(!online)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              online
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
            title="Simulate offline field connectivity"
          >
            {online ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden xs:inline">{t('online')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="hidden xs:inline">{t('offline')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function CollectorExitBar() {
  const { setRole, resetDemo } = useApp();

  return (
    <div className="fixed top-2.5 right-2.5 z-50 flex items-center gap-1.5">
      <button
        onClick={() => {
          if (window.confirm('Reset demo data to initial state?')) {
            resetDemo();
          }
        }}
        className="w-8 h-8 rounded-full bg-white/95 shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        title="Reset Demo Data"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={() => setRole(null)}
        className="w-8 h-8 rounded-full bg-white/95 shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        title="Exit role selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
