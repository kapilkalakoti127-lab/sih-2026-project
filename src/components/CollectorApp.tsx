import { useState } from 'react';
import { CollectorHeader, CollectorExitBar } from '@/components/collector/CollectorHeader';
import { BottomNav } from '@/components/collector/BottomNav';
import { CollectorHome } from '@/components/collector/CollectorHome';
import { CreateLot } from '@/components/collector/CreateLot';
import { PriceBoard } from '@/components/collector/PriceBoard';
import { RecyclerMatch } from '@/components/collector/RecyclerMatch';
import { OfferScreen } from '@/components/collector/OfferScreen';
import { HandoverRecord } from '@/components/collector/HandoverRecord';
import { MyLot } from '@/components/collector/MyLot';
import { LotDetail } from '@/components/collector/LotDetail';
import { Earnings } from '@/components/collector/Earnings';
import { CollectorProfile } from '@/components/collector/CollectorProfile';
import type { CollectorScreen, MaterialCategory } from '@/types';

export function CollectorApp() {
  const [screen, setScreen] = useState<CollectorScreen>('home');

  const handleCreateComplete = (_material: MaterialCategory, _weightKg: number) => {
    setScreen('match');
  };

  const showBottomNav = ['home', 'mylot', 'prices', 'earnings', 'profile'].includes(screen);

  return (
    <div className="min-h-screen bg-gray-50">
      <CollectorExitBar />
      <CollectorHeader />
      <main className={`max-w-md mx-auto ${showBottomNav ? 'pb-24' : 'pb-6'}`}>
        {screen === 'home' && <CollectorHome onNavigate={setScreen} />}
        {screen === 'create' && (
          <CreateLot onComplete={handleCreateComplete} onBack={() => setScreen('home')} />
        )}
        {screen === 'prices' && <PriceBoard />}
        {screen === 'match' && (
          <RecyclerMatch onViewOffer={() => setScreen('offer')} onBack={() => setScreen('create')} />
        )}
        {screen === 'offer' && (
          <OfferScreen onAccept={() => setScreen('handover')} onDecline={() => setScreen('home')} onBack={() => setScreen('match')} />
        )}
        {screen === 'handover' && <HandoverRecord onDone={() => setScreen('earnings')} />}
        {screen === 'mylot' && <MyLot onNavigate={setScreen} />}
        {screen === 'lotDetail' && <LotDetail onBack={() => setScreen('mylot')} />}
        {screen === 'earnings' && <Earnings />}
        {screen === 'profile' && <CollectorProfile />}
      </main>
      {showBottomNav && <BottomNav active={screen} onNavigate={setScreen} />}
    </div>
  );
}
