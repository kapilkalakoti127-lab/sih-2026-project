import {
  Recycle,
  LayoutDashboard,
  Inbox,
  Receipt,
  UserRound,
  LogOut,
  Smartphone,
  RotateCcw,
  ArrowLeftRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { RecyclerScreen } from '@/types';

interface RecyclerSidebarProps {
  active: RecyclerScreen;
  onNavigate: (screen: RecyclerScreen) => void;
}

const items: { key: RecyclerScreen; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { key: 'incoming', icon: Inbox, labelKey: 'incoming_lot' },
  { key: 'transactions', icon: Receipt, labelKey: 'transactions' },
  { key: 'profile', icon: UserRound, labelKey: 'profile' },
];

export function RecyclerSidebar({ active, onNavigate }: RecyclerSidebarProps) {
  const { t, setRole, lots, resetDemo } = useApp();

  const newLotsCount = lots.filter(
    (l) => l.status === 'Created' || l.status === 'Priced' || l.status === 'Matched'
  ).length;

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-gray-900 min-h-screen flex-col text-white p-4 justify-between">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight block leading-tight">
              {t('app_name')}
            </span>
            <span className="text-[11px] text-green-400 font-semibold tracking-wide">
              Authorized Recycler
            </span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{t(item.labelKey)}</span>
                </div>
                {item.key === 'incoming' && newLotsCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
                    {newLotsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Switch to Collector, Reset Demo, Exit */}
      <div className="space-y-2 pt-4 border-t border-gray-800">
        <button
          onClick={() => setRole('collector')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-green-400 bg-green-950/40 hover:bg-green-950/70 border border-green-800/40 transition-colors"
          title="Switch directly to kabadiwala / collector view"
        >
          <Smartphone className="w-4 h-4" />
          Switch to Collector App
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (window.confirm('Reset demo data to initial state?')) {
                resetDemo();
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={() => setRole(null)}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('exit_demo')}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function RecyclerMobileNav({ active, onNavigate }: RecyclerSidebarProps) {
  const { t, setRole, lots } = useApp();
  const newLotsCount = lots.filter(
    (l) => l.status === 'Created' || l.status === 'Priced' || l.status === 'Matched'
  ).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900 border-t border-gray-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg relative ${
                active === item.key ? 'text-green-400' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{t(item.labelKey)}</span>
              {item.key === 'incoming' && newLotsCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setRole('collector')}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-green-400"
          title="Switch to Collector"
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Collector</span>
        </button>
      </div>
    </div>
  );
}
