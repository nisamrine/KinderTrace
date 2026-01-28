
import React from 'react';
import { LayoutDashboard, LogOut, ClipboardList, BookHeart } from 'lucide-react';
import { Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  setScreen: (s: Screen) => void;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentScreen, setScreen, title }) => {
  if (currentScreen === 'auth') return <>{children}</>;

  const NavItem = ({ icon: Icon, label, screen, colorClass }: { icon: any, label: string, screen: Screen, colorClass: string }) => (
    <button
      onClick={() => setScreen(screen)}
      className={`flex flex-col items-center justify-center space-y-1 transition-all transform active:scale-90 ${
        currentScreen === screen ? `${colorClass}` : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={26} strokeWidth={2.5} />
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pt-16">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 h-16 px-6 flex items-center justify-between z-30 md:hidden">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <button onClick={() => setScreen('auth')} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
          <LogOut size={22} />
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b h-16 items-center justify-between px-10 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">K</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">KinderTrace <span className="text-indigo-600">AI</span></h1>
        </div>
        <div className="flex items-center space-x-10">
          <button onClick={() => setScreen('observations')} className={`font-bold transition-colors ${currentScreen === 'observations' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-400'}`}>Observations</button>
          <button onClick={() => setScreen('dashboard')} className={`font-bold transition-colors ${currentScreen === 'dashboard' ? 'text-orange-500' : 'text-slate-400 hover:text-orange-400'}`}>Insights</button>
          <button onClick={() => setScreen('storybook')} className={`font-bold transition-colors ${currentScreen === 'storybook' ? 'text-purple-600' : 'text-slate-400 hover:text-purple-400'}`}>Storybook</button>
          <button onClick={() => setScreen('auth')} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={22} /></button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full mt-16 md:mt-0 relative">
        {children}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 flex items-center justify-around z-30 md:hidden px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
        <NavItem icon={ClipboardList} label="Observe" screen="observations" colorClass="text-blue-600 scale-110" />
        <NavItem icon={LayoutDashboard} label="Insights" screen="dashboard" colorClass="text-orange-500 scale-110" />
        <NavItem icon={BookHeart} label="Story" screen="storybook" colorClass="text-purple-600 scale-110" />
      </nav>
    </div>
  );
};

export default Layout;
