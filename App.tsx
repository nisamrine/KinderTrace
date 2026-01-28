
import React, { useState } from 'react';
import { Screen, Child } from './types';
import Layout from './components/Layout';
import AuthScreen from './screens/AuthScreen';
import ObservationScreen from './screens/PulseScreen';
import DashboardScreen from './screens/DashboardScreen';
import MagicScreen from './screens/MagicScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={() => setCurrentScreen('observations')} />;
      case 'observations':
        return <ObservationScreen selectedChild={selectedChild} setSelectedChild={setSelectedChild} onNavigate={setCurrentScreen} />;
      case 'dashboard':
        return <DashboardScreen selectedChild={selectedChild} setSelectedChild={setSelectedChild} onNavigate={setCurrentScreen} />;
      case 'storybook':
        return <MagicScreen selectedChild={selectedChild} setSelectedChild={setSelectedChild} onNavigate={setCurrentScreen} />;
      default:
        return <ObservationScreen selectedChild={selectedChild} setSelectedChild={setSelectedChild} onNavigate={setCurrentScreen} />;
    }
  };

  const getTitle = () => {
    switch (currentScreen) {
      case 'observations': return 'Observation Hub';
      case 'dashboard': return 'Insights';
      case 'storybook': return 'Daily Storybook';
      default: return '';
    }
  };

  return (
    <Layout
      currentScreen={currentScreen}
      setScreen={setCurrentScreen}
      title={getTitle()}
    >
      {renderScreen()}
    </Layout>
  );
};

export default App;
