import React from 'react';
import { Palette, Sparkles, Layout, Smartphone, BookOpen, Layers, ArrowLeft } from 'lucide-react';
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
            Whimsical <span className="text-indigo-600">Professionalism</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Bridging the gap between rigorous pedagogical data and the magic of early childhood memories.
          </p>
        </div>

        {/* The Thumbnail Mockup */}
        <div className="relative mb-32 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-teal-400 to-orange-400 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-white p-4">
            <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
              {/* This represents the visual of the thumbnail prompt provided */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
              
              {/* Visual Mockup Elements */}
              <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
                 <div className="w-64 h-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transform -rotate-6 flex flex-col p-4 space-y-2">
                    <div className="w-1/2 h-2 bg-green-400/50 rounded-full"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40"></div>
                      <div className="flex-1 space-y-1">
                        <div className="w-full h-1.5 bg-white/10 rounded-full"></div>
                        <div className="w-3/4 h-1.5 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                    <div className="mt-auto h-12 w-full bg-indigo-500/10 rounded-lg border border-indigo-500/20"></div>
                 </div>
                 
                 <div className="absolute top-0 right-10 w-12 h-12 bg-yellow-400 rounded-lg rotate-12 shadow-lg flex items-center justify-center text-white">
                   <Sparkles size={24} fill="currentColor" />
                 </div>
                 
                 <div className="absolute bottom-10 left-20 w-16 h-16 bg-orange-400 rounded-xl -rotate-12 shadow-lg flex items-center justify-center text-white font-black text-2xl">
                   A
                 </div>

                 <div className="space-y-2 pt-12">
                   <h2 className="text-3xl font-black text-white tracking-tight">KinderTrace AI</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Showcase Thumbnail Concept</p>
                 </div>
              </div>

              {/* Lighting Effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Design Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Agentic Core</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Multi-agent orchestration that handles extraction, compliance, and creativity in real-time.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Magical Memories</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Transforming complex developmental metrics into Manga-inspired storybooks for parents.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
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