import { Recycle, Smartphone, Building2, Leaf, Globe, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Language } from '@/types';

export function RoleSelect() {
  const { t, setRole, language, setLanguage } = useApp();

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-cyan-50 flex flex-col items-center justify-center px-5 py-10">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 mb-3">
        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-md shrink-0">
          <Recycle className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {t('app_name')}
          </h1>
          <span className="text-xs sm:text-sm font-bold text-green-700 tracking-wide uppercase">
            E-Waste Digital Bridge
          </span>
        </div>
      </div>
      <p className="text-gray-600 text-base sm:text-lg mb-8 text-center max-w-md font-medium leading-snug">
        {t('tagline')}
      </p>

      {/* Language Selector Bar (Prominent on Menu Page) */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            {t('choose_language')}
          </span>
          <span className="text-xs font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full">
            {languages.find((l) => l.code === language)?.nativeName}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`py-3 px-2 rounded-xl text-center transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-green-600 text-white font-extrabold shadow-md scale-102'
                    : 'text-gray-700 hover:bg-gray-100 font-semibold'
                }`}
              >
                <span className="block text-base sm:text-lg leading-tight">{item.nativeName}</span>
                <span
                  className={`block text-xs mt-0.5 font-medium ${
                    isSelected ? 'text-green-100' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 w-full max-w-md text-left px-1">
        {t('select_role_prompt')}
      </p>

      {/* Role Options */}
      <div className="w-full max-w-md space-y-4">
        {/* Collector Option */}
        <button
          onClick={() => setRole('collector')}
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-400 transition-all duration-200 active:scale-[0.98] text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors shrink-0">
              <Smartphone className="w-8 h-8 text-green-600" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {t('collector_demo')}
                </h2>
                <span className="text-xs bg-green-50 text-green-800 font-bold px-2.5 py-1 rounded-lg border border-green-200 shrink-0">
                  Kabadiwala
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 font-medium">{t('kabadiwala_sub')}</p>
            </div>
          </div>
        </button>

        {/* Recycler Option */}
        <button
          onClick={() => setRole('recycler')}
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-cyan-400 transition-all duration-200 active:scale-[0.98] text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors shrink-0">
              <Building2 className="w-8 h-8 text-cyan-600" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {t('recycler_demo')}
                </h2>
                <span className="text-xs bg-cyan-50 text-cyan-800 font-bold px-2.5 py-1 rounded-lg border border-cyan-200 shrink-0">
                  CPCB Facility
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 font-medium">{t('recycler_sub')}</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-gray-500 text-sm font-medium">
        <Leaf className="w-4 h-4 text-green-600" />
        <span>ECO-LINK Platform · Legal Circular Economy</span>
      </div>
    </div>
  );
}
