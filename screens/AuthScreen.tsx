import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, Palette } from 'lucide-react';
import { APP_LOGO } from '../constants';

interface AuthScreenProps {
  onLogin: () => void;
  onViewShowcase: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onViewShowcase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-3xl shadow-xl mb-6">
          <span className="text-5xl font-black text-white">K</span>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-400 rounded-full border-4 border-white animate-pulse"></div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">KinderTrace</h2>
        <p className="text-slate-500 text-sm mb-8 text-center font-bold">Secure Daycare Staff Portal</p>

        <div className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Staff Email"
              className="w-full bg-slate-100/80 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Access Password"
              className="w-full bg-slate-100/80 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={onLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:scale-[1.02] active:scale-95 text-lg"
          >
            Login
          </button>

          <div className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex items-center space-x-2 text-slate-400 bg-slate-100/50 px-5 py-2 rounded-full border border-slate-200">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase tracking-widest font-black">Authorized Personnel Only</span>
            </div>
            
            <button 
              onClick={onViewShowcase}
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-colors mt-4 group"
            >
              <Palette size={14} className="group-hover:rotate-12 transition-transform" />
              <span>View Design Showcase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;