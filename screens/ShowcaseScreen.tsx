import React from 'react';
import { Palette, Sparkles, Layout, Smartphone, BookOpen, Layers, ArrowLeft, ExternalLink } from 'lucide-react';
import { Screen } from '../types';

interface ShowcaseScreenProps {
  onBack: () => void;
}

const ShowcaseScreen: React.FC<ShowcaseScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to App</span>
          </button>
          <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Palette size={14} />
            <span>Design System v1.0</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter">
            Kinder <span className="text-indigo-600">Trace</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Bridging the gap between rigorous pedagogical data and the magic of early childhood memories.
          </p>
        </div>

        {/* The Thumbnail Mockup */}
        <div className="relative mb-32 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-teal-400 to-orange-400 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-white p-2">
            <div className="aspect-video w-full rounded-[2.8rem] relative overflow-hidden bg-slate-100">
              {/* Using the showcase image as the hero visual */}
              <img 
                src="thumbnail.jpeg" 
                alt="KinderTrace AI Showcase" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                onError={(e) => {
                  // Fallback to a placeholder if thumbnail.jpeg is missing
                  e.currentTarget.src = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=2000";
                }}
              />
              
              {/* Subtle Overlay for context */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-8 left-10 flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Product Vision 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 hover:border-indigo-100 transition-colors group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Agentic Core</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Multi-agent orchestration that handles extraction, compliance, and creativity in real-time.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 hover:border-teal-100 transition-colors group">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Magical Memories</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Transforming complex developmental metrics into Manga-inspired storybooks for parents.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 hover:border-orange-100 transition-colors group">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Staff First</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              A UI designed for the floor—clean, fast, and resilient, with voice-to-structured logs.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-12 border-t border-slate-200 text-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">KinderTrace AI Design Studio</p>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseScreen;