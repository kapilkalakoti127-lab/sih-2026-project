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

  const handleBack = () => {
    switch (screen) {
      case 'create':
      case 'prices':
      case 'mylot':
      case 'earnings':
      case 'profile':
        setScreen('home');
        break;
      case 'match':
        setScreen('create');
        break;
      case 'offer':
        setScreen('match');
        break;
      case 'handover':
        setScreen('offer');
        break;
      case 'lotDetail':
        setScreen('mylot');
        break;
      default:
        setScreen('home');
    }
  };

  const showBottomNav = ['home', 'mylot', 'prices', 'earnings', 'profile'].includes(screen);

  return (
    <div className="min-h-screen bg-gray-50">
      <CollectorExitBar />
      <CollectorHeader
        currentScreen={screen}
        onBack={handleBack}
        onHome={() => setScreen('home')}
      />
      <main className={`max-w-md mx-auto ${showBottomNav ? 'pb-24' : 'pb-6'}`}>
        {screen === 'home' && <CollectorHome onNavigate={setScreen} />}
        {screen === 'create' && (
          <CreateLot onComplete={handleCreateComplete} onBack={handleBack} />
        )}
        {screen === 'prices' && <PriceBoard onBack={handleBack} />}
        {screen === 'match' && (
          <RecyclerMatch onViewOffer={() => setScreen('offer')} onBack={() => setScreen('create')} />
        )}
        {screen === 'offer' && (
          <OfferScreen onAccept={() => setScreen('handover')} onDecline={() => setScreen('home')} onBack={() => setScreen('match')} />
        )}
        {screen === 'handover' && <HandoverRecord onDone={() => setScreen('earnings')} />}
        {screen === 'mylot' && <MyLot onNavigate={setScreen} onBack={handleBack} />}
        {screen === 'lotDetail' && <LotDetail onBack={() => setScreen('mylot')} />}
        {screen === 'earnings' && <Earnings onBack={handleBack} />}
        {screen === 'profile' && <CollectorProfile onBack={handleBack} />}
      </main>
      {showBottomNav && <BottomNav active={screen} onNavigate={setScreen} />}
    </div>
  );
}
