import React, { useState, useEffect } from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { Screen, Child } from './types';
import Layout from './components/Layout';
import AuthScreen from './screens/AuthScreen';
import ObservationScreen from './screens/PulseScreen';
import DashboardScreen from './screens/DashboardScreen';
import MagicScreen from './screens/MagicScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Use cast to any to avoid type conflict with existing window.aistudio definition in the environment
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const has = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        // Fallback for environments where aistudio object is not available
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio) {
      await win.aistudio.openSelectKey();
      // Assume success to handle race condition as per instructions
      setHasApiKey(true);
    }
  };

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

  if (!hasApiKey) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white p-10 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto text-indigo-600 mb-4 shadow-inner">
            <Key size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Unlock Magic Mode</h2>
          <p className="text-slate-500 font-bold leading-relaxed">
            To generate personalized Manga storybooks using Gemini 3 Pro, please select a valid API key.
          </p>
          
          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 text-left">
            <p className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">Billing Required</p>
            <p className="text-sm text-orange-800 font-medium leading-snug">
              Please ensure your Google Cloud project has billing enabled to access the premium Image Generation models.
            </p>
          </div>

          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Select API Key
          </button>
          
          <div className="pt-2">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-500 font-bold text-xs transition-colors uppercase tracking-wider"
            >
              <span>View Billing Documentation</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

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