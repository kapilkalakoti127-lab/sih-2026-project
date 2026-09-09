import { useState } from 'react';
import {
  Recycle,
  Smartphone,
  Building2,
  Leaf,
  Globe,
  Check,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Lock,
  Phone,
  Building,
  KeyRound,
  Sparkles,
  UserPlus,
  LogIn,
  MapPin,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Language } from '@/types';

export function RoleSelect() {
  const {
    t,
    setRole,
    language,
    setLanguage,
    collectorProfile,
    updateCollectorProfile,
    registerCollector,
    registerRecycler,
    recyclers,
    activeRecyclerId,
    setActiveRecyclerId,
  } = useApp();

  // Mode: 'choose' | 'collector_auth' | 'recycler_auth'
  const [mode, setMode] = useState<'choose' | 'collector_auth' | 'recycler_auth'>('choose');

  // Sub-tabs: 'login' | 'register'
  const [collectorTab, setCollectorTab] = useState<'login' | 'register'>('login');
  const [recyclerTab, setRecyclerTab] = useState<'login' | 'register'>('login');

  // Collector Existing Login form fields
  const [collectorId, setCollectorId] = useState(collectorProfile.id || 'KAB-PUN-7721');
  const [collectorPhone, setCollectorPhone] = useState(collectorProfile.phone || '+91 98220 14829');
  const [collectorName, setCollectorName] = useState(collectorProfile.name || 'Santosh Shinde');

  // Collector New Account form fields
  const [newCollectorName, setNewCollectorName] = useState('');
  const [newCollectorPhone, setNewCollectorPhone] = useState('');
  const [newCollectorLocation, setNewCollectorLocation] = useState('Pune City');
  const [newCollectorUpi, setNewCollectorUpi] = useState('');

  // Recycler Existing Login form fields
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(activeRecyclerId || 'REC-002');
  const [eprLicense, setEprLicense] = useState(
    recyclers.find((r) => r.id === selectedRecyclerId)?.eprLicense || 'CPCB-EPR-MH-2024-0891'
  );
  const [officerPass, setOfficerPass] = useState('cpcb-auth-2026');

  // Recycler New Facility Registration form fields
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityEpr, setNewFacilityEpr] = useState('');
  const [newFacilityOfficer, setNewFacilityOfficer] = useState('');
  const [newFacilityPhone, setNewFacilityPhone] = useState('');
  const [newFacilityLocation, setNewFacilityLocation] = useState('Bhosari MIDC, Pune');
  const [newFacilityBaseRate, setNewFacilityBaseRate] = useState<number>(335);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  ];

  // Collector: Existing Sign In
  const handleCollectorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollectorProfile({
      id: collectorId.trim() || collectorProfile.id,
      name: collectorName.trim() || collectorProfile.name,
      phone: collectorPhone.trim() || collectorProfile.phone,
    });
    setRole('collector');
  };

  // Collector: Create Brand New Account with 100% Refreshed Data
  const handleCollectorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectorName.trim()) return;
    setLoading(true);

    try {
      await registerCollector(
        {
          name: newCollectorName.trim(),
          phone: newCollectorPhone.trim() || '+91 98000 12345',
          location: newCollectorLocation.trim() || 'Pune City',
          upiId: newCollectorUpi.trim() || `${newCollectorName.trim().toLowerCase().replace(/\s+/g, '')}@okaxis`,
        },
        true // freshData = true: clears previous lots for clean new user experience
      );
      setSuccessMsg('Account created with fresh lot registry!');
      setTimeout(() => {
        setRole('collector');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  // Recycler: Existing Facility Sign In
  const handleRecyclerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveRecyclerId(selectedRecyclerId);
    setRole('recycler');
  };

  // Recycler: Register Brand New Facility Account
  const handleRecyclerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName.trim()) return;
    setLoading(true);

    try {
      const created = await registerRecycler({
        name: newFacilityName.trim(),
        eprLicense: newFacilityEpr.trim() || `CPCB-EPR-MH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        contactPerson: newFacilityOfficer.trim() || 'Chief Plant Inspector',
        phone: newFacilityPhone.trim() || '+91 98220 12345',
        location: newFacilityLocation.trim() || 'Pune Industrial Corridor',
        offeredPricePerKg: newFacilityBaseRate || 335,
      });
      setActiveRecyclerId(created.id);
      setSuccessMsg(`Facility ${created.name} onboarded successfully!`);
      setTimeout(() => {
        setRole('recycler');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoCollector = () => {
    setCollectorId('KAB-PUN-7721');
    setCollectorPhone('+91 98220 14829');
    setCollectorName('Santosh Shinde');
    updateCollectorProfile({
      id: 'KAB-PUN-7721',
      name: 'Santosh Shinde',
      phone: '+91 98220 14829',
    });
    setRole('collector');
  };

  const handleQuickDemoRecycler = (recId: string) => {
    setSelectedRecyclerId(recId);
    setActiveRecyclerId(recId);
    setRole('recycler');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-white to-cyan-50 flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Subtle, professional low-opacity e-waste background watermark */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.035] mix-blend-multiply z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=compress&cs=tinysrgb&w=1400")',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full flex flex-col items-center">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-md shrink-0">
          <Recycle className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {t('app_name')}
          </h1>
          <span className="text-xs sm:text-sm font-bold text-green-700 tracking-wide block">
            {t('subtitle')}
          </span>
        </div>
      </div>
      <p className="text-gray-700 text-sm sm:text-base mb-6 text-center max-w-md font-semibold leading-snug">
        {t('tagline')}
      </p>

      {/* Language Selector Bar (Always prominent on Menu Page) */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-green-600" />
            {t('choose_language')}
          </span>
          <span className="text-xs font-bold text-green-900 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
            {languages.find((l) => l.code === language)?.nativeName}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl shadow-xs border border-gray-200">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`py-2.5 px-2 rounded-xl text-center transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-green-600 text-white font-extrabold shadow-sm'
                    : 'text-gray-800 hover:bg-gray-100 font-bold'
                }`}
              >
                <span className="block text-sm sm:text-base leading-tight">{item.nativeName}</span>
                <span
                  className={`block text-[11px] mt-0.5 font-semibold ${
                    isSelected ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 absolute top-1.5 right-1.5 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: Main Menu Portal Selector (Clean separation between collector & recycler) */}
      {mode === 'choose' && (
        <div className="w-full max-w-md space-y-4">
          <p className="text-xs font-black text-gray-700 uppercase tracking-wider px-1">
            {t('choose_portal_prompt')}
          </p>

          {/* Scrap Collector Portal Button */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-green-200 hover:border-green-500 hover:shadow-md transition-all text-left">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-100 border border-green-300 flex items-center justify-center shrink-0">
                <Smartphone className="w-9 h-9 text-green-700" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-black text-gray-900">
                    {t('login_collector_portal')}
                  </h2>
                  <span className="text-xs font-black bg-green-100 text-green-800 px-2.5 py-1 rounded-lg border border-green-200">
                    Kabadiwala
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed">
                  {t('collector_portal_desc')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRole('collector');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{t('enter_portal')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMode('collector_auth');
                      setCollectorTab('login');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-900 font-bold text-xs transition-colors"
                  >
                    Login / Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Authorized Recycler Portal Button */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-cyan-200 hover:border-cyan-500 hover:shadow-md transition-all text-left">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center shrink-0">
                <Building2 className="w-9 h-9 text-cyan-700" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-black text-gray-900">
                    {t('login_recycler_portal')}
                  </h2>
                  <span className="text-xs font-black bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-lg border border-cyan-200">
                    CPCB Facility
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed">
                  {t('recycler_portal_desc')}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveRecyclerId(selectedRecyclerId || recyclers[0]?.id || 'REC-002');
                      setRole('recycler');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{t('enter_portal')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMode('recycler_auth');
                      setRecyclerTab('login');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 font-bold text-xs transition-colors"
                  >
                    Login / Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Scrap Collector Portal (Login & Create Account Tabs) */}
      {mode === 'collector_auth' && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
          {/* Back to Menu Bar */}
          <div className="px-5 py-3.5 bg-green-50 border-b border-green-200 flex items-center justify-between">
            <button
              onClick={() => setMode('choose')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-green-300 text-xs font-black text-green-900 hover:bg-green-100 transition-colors shadow-2xs"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>← {t('main_menu')}</span>
            </button>
            <span className="text-xs font-black text-green-800 bg-green-200/60 px-2.5 py-1 rounded-full">
              Kabadiwala Portal
            </span>
          </div>

          {/* Tab Switcher: Existing Login vs Create Account */}
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                onClick={() => setCollectorTab('login')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  collectorTab === 'login'
                    ? 'bg-white text-green-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Sign In</span>
              </button>
              <button
                onClick={() => setCollectorTab('register')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  collectorTab === 'register'
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Existing Collector Login */}
          {collectorTab === 'login' && (
            <form onSubmit={handleCollectorLogin} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('login_collector_portal')}
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Sign in with your registered collector badge ID
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Collector Unique Badge ID
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={collectorId}
                    onChange={(e) => setCollectorId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. KAB-PUN-7721"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. Santosh Shinde"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Registered Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={collectorPhone}
                    onChange={(e) => setCollectorPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. +91 98220 14829"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('sign_in')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoCollector}
                  className="w-full py-2 px-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-900 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-green-600" />
                  <span>Instant 1-Tap Demo: Santosh Shinde (KAB-PUN-7721)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Create Brand New Collector Account (Fresh Clean Lots) */}
          {collectorTab === 'register' && (
            <form onSubmit={handleCollectorRegister} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-1.5">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <span>Register as New Collector</span>
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Create a new profile. Starts with fresh clean records & clean lot registry.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newCollectorName}
                    onChange={(e) => setNewCollectorName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={newCollectorPhone}
                    onChange={(e) => setNewCollectorPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                    placeholder="+91 98111 22233"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Operating City / Ward
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newCollectorLocation}
                      onChange={(e) => setNewCollectorLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                      placeholder="Hadapsar, Pune"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    UPI ID for Payments
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newCollectorUpi}
                      onChange={(e) => setNewCollectorUpi(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-green-600 bg-gray-50 focus:bg-white"
                      placeholder="ramesh@upi"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic Clean Slate Provisioning</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Your new profile will receive an authorized Kabadiwala Badge ID and an empty lot table ready for your first collection.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Profile...' : 'Complete Registration & Open Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* VIEW 3: Authorized Recycler Portal (Login & Register Facility Tabs) */}
      {mode === 'recycler_auth' && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
          {/* Back to Menu Bar */}
          <div className="px-5 py-3.5 bg-cyan-50 border-b border-cyan-200 flex items-center justify-between">
            <button
              onClick={() => setMode('choose')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-cyan-300 text-xs font-black text-cyan-900 hover:bg-cyan-100 transition-colors shadow-2xs"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>← {t('main_menu')}</span>
            </button>
            <span className="text-xs font-black text-cyan-800 bg-cyan-200/60 px-2.5 py-1 rounded-full">
              Industrial Facility
            </span>
          </div>

          {/* Tab Switcher: Existing Facility Sign In vs Onboard New Facility */}
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                onClick={() => setRecyclerTab('login')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  recyclerTab === 'login'
                    ? 'bg-white text-cyan-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Sign In</span>
              </button>
              <button
                onClick={() => setRecyclerTab('register')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  recyclerTab === 'register'
                    ? 'bg-cyan-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Onboard New Plant</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Existing Facility Sign In */}
          {recyclerTab === 'login' && (
            <form onSubmit={handleRecyclerLogin} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {t('login_recycler_portal')}
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Sign in to manage authorized dismantling facility operations
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Select Operating Processing Facility
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedRecyclerId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedRecyclerId(id);
                      const rec = recyclers.find((r) => r.id === id);
                      if (rec?.eprLicense) setEprLicense(rec.eprLicense);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                  >
                    {recyclers.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.name} ({rec.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  CPCB / MPCB EPR License Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={eprLicense}
                    onChange={(e) => setEprLicense(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. CPCB-EPR-MH-2024-0891"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Facility Officer Access Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={officerPass}
                    onChange={(e) => setOfficerPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                    placeholder="Enter officer security passkey"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('sign_in')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-[11px] font-bold text-gray-500 block text-center">
                  1-Tap Demo Facilities:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {recyclers.slice(0, 2).map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => handleQuickDemoRecycler(rec.id)}
                      className="py-1.5 px-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-950 text-[11px] font-bold truncate transition-colors"
                    >
                      {rec.name.split(' ')[0]} ({rec.id})
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Onboard Brand New Facility */}
          {recyclerTab === 'register' && (
            <form onSubmit={handleRecyclerRegister} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-1.5">
                  <Building className="w-5 h-5 text-cyan-700" />
                  <span>Onboard New Recycler Facility</span>
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Register a new CPCB authorized processing center into Kabadiwala Connect
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Facility / Enterprise Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newFacilityName}
                    onChange={(e) => setNewFacilityName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                    placeholder="e.g. Apex Circular Metals Pvt Ltd"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    CPCB EPR License *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newFacilityEpr}
                      onChange={(e) => setNewFacilityEpr(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-mono text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                      placeholder="CPCB-EPR-MH-2026-99"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Facility Officer
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newFacilityOfficer}
                      onChange={(e) => setNewFacilityOfficer(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                      placeholder="Dr. Kulkarni"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Plant Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newFacilityLocation}
                      onChange={(e) => setNewFacilityLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                      placeholder="Chakan MIDC Phase 2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Benchmark Offer (₹/kg)
                  </label>
                  <input
                    type="number"
                    value={newFacilityBaseRate}
                    onChange={(e) => setNewFacilityBaseRate(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-cyan-600 bg-gray-50 focus:bg-white"
                    placeholder="340"
                  />
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs text-cyan-950 font-medium flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0" />
                <span>Authorized for all 10 CPCB E-Waste categories with instant Form-6 manifest generation.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Activating Facility...' : 'Register Facility & Launch Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Trust Footer */}
      <div className="mt-8 flex items-center gap-2 text-gray-600 text-xs font-semibold text-center">
        <Leaf className="w-4 h-4 text-green-600 shrink-0" />
        <span>Kabadiwala Connect — Bringing the Informal Collector into the Formal Recycling Chain · CPCB Certified</span>
      </div>
      </div>
    </div>
  );
}
