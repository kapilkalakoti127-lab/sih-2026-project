import { Home, Package, Tag, Wallet, UserRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { CollectorScreen } from '@/types';

interface BottomNavProps {
  active: CollectorScreen;
  onNavigate: (screen: CollectorScreen) => void;
}

const navItems: {
  key: CollectorScreen;
  icon: typeof Home;
  labelKey: string;
}[] = [
  { key: 'home', icon: Home, labelKey: 'home' },
  { key: 'mylot', icon: Package, labelKey: 'my_lot' },
  { key: 'prices', icon: Tag, labelKey: 'prices' },
  { key: 'earnings', icon: Wallet, labelKey: 'earnings' },
  { key: 'profile', icon: UserRound, labelKey: 'profile' },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { t } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                className="w-6 h-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-semibold tracking-tight">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
