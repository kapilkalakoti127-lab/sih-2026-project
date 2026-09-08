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
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-800 text-base">ECO-LINK</span>
            <span className="text-[10px] text-cyan-700 font-semibold block">Authorized Recycler</span>
          </div>
          <button
            onClick={() => setRole('collector')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold"
          >
            <Smartphone className="w-3.5 h-3.5 text-green-600" />
            Collector App
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
