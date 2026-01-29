
import React, { useState } from 'react';
import { 
  Mic, BookOpen, User, Loader2, Info, Clock, Moon, Smile, ChevronDown, Database, 
  Palette, Plus, ChevronRight, TrendingUp, Edit3
} from 'lucide-react';
import { Child, Screen } from '../types';
import ChildSelector from '../components/ChildSelector';

interface ObservationScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  onNavigate: (screen: Screen) => void;
}

const ObservationScreen: React.FC<ObservationScreenProps> = ({ selectedChild, setSelectedChild, onNavigate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogbook, setShowLogbook] = useState(false);
  const [dictatedText, setDictatedText] = useState('');
  
  const [activeBehaviorTags, setActiveBehaviorTags] = useState<string[]>(['Happy']);
  const [activeActivityTags, setActiveActivityTags] = useState<string[]>(['Paint']);
  const [otherBehavior, setOtherBehavior] = useState('');
  const [otherActivity, setOtherActivity] = useState('');

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      // Simulate transcription result
      setTimeout(() => {
        setIsProcessing(false);
        setDictatedText(`${selectedChild?.name} had a wonderful morning. They played with the wooden blocks for 20 minutes and showed great interest in the new picture book about animals.`);
      }, 2000);
    } else {
      setIsRecording(true);
    }
  };

  const toggleTag = (tag: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  const behaviorTags = ['Happy', 'Calm', 'Active', 'Tired', 'Fussy', 'Playful'];
  const activityTags = ['Dance', 'Baby Yoga', 'Paint', 'Storytime', 'Garden'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

      {selectedChild ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Voice Entry Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#FF5C00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                  <Mic size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#1E293B]">Voice Entry</h4>
                  <p className="text-sm font-bold text-slate-400">Record observations naturally</p>
                </div>
              </div>

              <div className="bg-[#FFF5E6] rounded-[2rem] aspect-[16/9] flex flex-col items-center justify-center space-y-4 border border-orange-50/50">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? 'bg-white text-red-500 animate-pulse' : 'bg-[#FF5C00] text-white'}`}>
                  {isRecording ? <div className="w-8 h-8 bg-red-500 rounded-sm" /> : <Mic size={32} />}
                </div>
                <span className="text-sm font-black text-orange-800 tracking-tight">
                  {isRecording ? 'Listening carefully...' : 'Ready to record'}
                </span>
              </div>

              <button
                onClick={toggleRecording}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-3 ${
                  isRecording ? 'bg-red-500 text-white shadow-red-100' : 'bg-[#FF5C00] text-white shadow-orange-100'
                }`}
              >
                <Mic size={20} />
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </button>

              <div className="bg-[#EBF5FF] rounded-2xl p-4 flex items-center space-x-3 border border-blue-100">
                <Info size={18} className="text-blue-500" />
                <p className="text-[11px] font-bold text-blue-600">AI will transcribe and extract key data points automatically</p>
              </div>
            </div>

            {/* Manual Logbook Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 min-h-full">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-[#00A389] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#1E293B]">Manual Logbook</h4>
                  <p className="text-sm font-bold text-slate-400">Structured data entry</p>
                </div>
              </div>

              {!showLogbook ? (
                <div className="flex flex-col items-center justify-center space-y-8 py-12">
                  <div className="w-24 h-24 bg-[#E0F7F4] text-[#00A389] rounded-[2rem] flex items-center justify-center shadow-inner">
                    <BookOpen size={48} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 text-center max-w-[240px]">
                    Fill out the structured form for detailed logging
                  </p>
                  <button
                    onClick={() => setShowLogbook(true)}
                    className="bg-[#00A389] hover:bg-[#008F78] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-teal-100 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Open Logbook
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                        <Clock size={14} className="text-indigo-500" />
                        <span>Arrival Time</span>
                      </label>
                      <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                        <Clock size={14} className="text-indigo-500" />
                        <span>Departure Time</span>
                      </label>
                      <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                        <Moon size={14} className="text-indigo-500" />
                        <span>Sleep Start</span>
                      </label>
                      <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                        <Moon size={14} className="text-indigo-500" />
                        <span>Sleep End</span>
                      </label>
                      <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                      <Database size={14} className="text-indigo-500" />
                      <span>Stool Type</span>
                    </label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700 appearance-none cursor-pointer">
                        <option>Select type</option>
                        <option>Normal</option>
                        <option>Loose</option>
                        <option>Hard</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                      <Palette size={14} className="text-indigo-500" />
                      <span>Activity</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activityTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, activeActivityTags, setActiveActivityTags)}
                          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                            activeActivityTags.includes(tag) 
                              ? 'bg-[#00A389] text-white shadow-md' 
                              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      <div className="flex items-center bg-slate-50 rounded-full px-4 border border-slate-200 border-dashed">
                        <Plus size={14} className="text-slate-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Add other category..." 
                          className="bg-transparent text-xs font-bold outline-none py-2 w-24 placeholder:text-slate-300"
                          value={otherActivity}
                          onChange={(e) => setOtherActivity(e.target.value)}
                          onBlur={() => { if(otherActivity) { toggleTag(otherActivity, activeActivityTags, setActiveActivityTags); setOtherActivity(''); } }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                      <Smile size={14} className="text-indigo-500" />
                      <span>Behavior Tags</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {behaviorTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, activeBehaviorTags, setActiveBehaviorTags)}
                          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                            activeBehaviorTags.includes(tag) 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-[#EBF5FF] text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      <div className="flex items-center bg-[#EBF5FF] rounded-full px-4 border border-blue-200 border-dashed">
                        <Plus size={14} className="text-blue-400 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Add other category..." 
                          className="bg-transparent text-xs font-bold outline-none py-2 w-24 placeholder:text-blue-300"
                          value={otherBehavior}
                          onChange={(e) => setOtherBehavior(e.target.value)}
                          onBlur={() => { if(otherBehavior) { toggleTag(otherBehavior, activeBehaviorTags, setActiveBehaviorTags); setOtherBehavior(''); } }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#1E293B] uppercase tracking-wider block">Staff Notes</label>
                      <textarea
                        placeholder="Add staff observations..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700 min-h-[80px] resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black text-indigo-600 uppercase tracking-wider block">Parents Notes</label>
                      <textarea
                        placeholder="Add parents observations..."
                        className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-200 font-bold text-slate-700 min-h-[80px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 pb-2">
                    <button
                      onClick={() => setShowLogbook(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(() => {
                          setIsProcessing(false);
                          setShowLogbook(false);
                        }, 1500);
                      }}
                      className="flex-[2] py-4 bg-[#00A389] text-white rounded-2xl font-black shadow-lg shadow-teal-50 hover:bg-[#008F78] transition-all"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TRANSCRIPTION RESULT FIELD (As per mockup) */}
          {dictatedText && (
            <div className="bg-white/90 backdrop-blur rounded-[2.5rem] p-8 border-2 border-dashed border-blue-200 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 text-blue-600">
                  <Edit3 size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Dictated Text Review</span>
                </div>
                <button 
                  onClick={() => setDictatedText('')}
                  className="text-xs font-black text-slate-300 hover:text-slate-500 uppercase"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={dictatedText}
                onChange={(e) => setDictatedText(e.target.value)}
                className="w-full bg-blue-50/30 border-none rounded-2xl p-4 text-slate-700 font-bold text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-100 min-h-[120px] resize-none"
                placeholder="Transcribed text will appear here..."
              />
              <p className="mt-4 text-[10px] font-black text-blue-300 uppercase tracking-widest text-center">
                Tap the text above to edit if needed
              </p>
            </div>
          )}

          {/* NEXT SECTION NAV BUTTON */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group relative flex items-center space-x-4 bg-white/80 backdrop-blur-sm border-2 border-orange-200 px-12 py-5 rounded-[2rem] text-orange-600 font-black text-xl hover:bg-orange-50 hover:border-orange-400 transition-all shadow-xl shadow-orange-100/50"
            >
              <div className="bg-orange-100 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <span>View Analytics & Insights</span>
              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-slate-300 space-y-6 animate-pulse">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
            <User size={48} className="opacity-30" />
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-slate-400">Select a child to begin</p>
        </div>
      )}

      {/* Processing State Overlay */}
      <div className={`fixed bottom-24 left-6 right-6 md:bottom-10 md:left-auto md:right-10 md:w-96 p-6 rounded-[2rem] transition-all duration-700 transform z-50 ${
        isProcessing ? 'translate-y-0 opacity-100 bg-gradient-to-r from-[#00A389] to-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center space-x-5">
          <div className="bg-white/20 p-3 rounded-2xl animate-spin">
            <Loader2 size={24} />
          </div>
          <div>
            <p className="font-black text-lg">Syncing Observation</p>
            <p className="text-xs opacity-90 font-bold uppercase tracking-widest">Processing structured logs...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationScreen;
