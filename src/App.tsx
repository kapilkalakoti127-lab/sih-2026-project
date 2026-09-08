import { AppProvider, useApp } from '@/context/AppContext';
import { RoleSelect } from '@/components/RoleSelect';
import { CollectorApp } from '@/components/CollectorApp';
import { RecyclerApp } from '@/components/RecyclerApp';

function AppContent() {
  const { role } = useApp();
  if (!role) return <RoleSelect />;
  if (role === 'collector') return <CollectorApp />;
  return <RecyclerApp />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
