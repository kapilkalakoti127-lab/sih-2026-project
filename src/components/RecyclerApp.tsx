import { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RecyclerSidebar, RecyclerMobileNav } from '@/components/recycler/RecyclerSidebar';
import { RecyclerDashboard } from '@/components/recycler/RecyclerDashboard';
import { IncomingLot } from '@/components/recycler/IncomingLot';
import { RecyclerLotDetail } from '@/components/recycler/RecyclerLotDetail';
import { RecyclerTransactions } from '@/components/recycler/RecyclerTransactions';
import { RecyclerProfile } from '@/components/recycler/RecyclerProfile';
import type { RecyclerScreen } from '@/types';

export function RecyclerApp() {
  const { setRole } = useApp();
  const [screen, setScreen] = useState<RecyclerScreen>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RecyclerSidebar active={screen} onNavigate={setScreen} />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <div>
            <span className="font-black text-gray-900 text-base">Kabadiwala Connect</span>
            <span className="text-[10px] text-cyan-800 font-bold block">Authorized Recycler Portal</span>
          </div>
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-black"
          >
            ← Main Menu
          </button>
        </header>

        {screen === 'dashboard' && <RecyclerDashboard onNavigate={setScreen} />}
        {screen === 'incoming' && <IncomingLot onNavigate={setScreen} />}
        {screen === 'lotDetail' && (
          <RecyclerLotDetail
            onSendOffer={() => setScreen('incoming')}
            onBack={() => setScreen('incoming')}
          />
        )}
        {screen === 'transactions' && <RecyclerTransactions />}
        {screen === 'profile' && <RecyclerProfile />}
      </div>
      <RecyclerMobileNav active={screen} onNavigate={setScreen} />
    </div>
  );
}
