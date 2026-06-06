import { useState } from 'react';
import { Home } from './views/Home';
import { BusinessOnboarding } from './views/BusinessOnboarding';
import Explorar from './views/Explorar';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="h-screen w-full bg-gradient-to-br from-orange-50 via-white to-purple-50 flex flex-col overflow-hidden">
      {currentView === 'home' && (
        <Home onNavigate={setCurrentView} />
      )}
      {currentView === 'register' && (
        <BusinessOnboarding onBack={() => setCurrentView('home')} />
      )}
      {currentView === 'discover' && (
        <Explorar onBack={() => setCurrentView('home')} />
      )}
    </div>
  );
}