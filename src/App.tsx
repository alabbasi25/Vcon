import { useState, useEffect } from 'react';
import { Dashboard } from './components/layout/Dashboard';
import { PlanetProvider } from './context/KokabContext';
import { Onboarding } from './components/ui/Onboarding';
import { GlobalErrorBoundary } from './components/ui/GlobalErrorBoundary';
import { UserID } from './types';

export default function App() {
  const [userId, setUserId] = useState<UserID>('F');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('kokab_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('kokab_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  return (
    <GlobalErrorBoundary>
      <div className="antialiased min-h-screen bg-[var(--color-bg-deep)] text-[var(--color-text-primary)] font-sans" dir="rtl">
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
        <PlanetProvider key={userId} userId={userId}>
          <Dashboard onSwitchUser={(id?: UserID) => setUserId(prev => id || (prev === 'F' ? 'B' : 'F'))} />
        </PlanetProvider>
      </div>
    </GlobalErrorBoundary>
  );
}
