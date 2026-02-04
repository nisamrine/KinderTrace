
import React, { useState, useRef } from 'react';
import { 
  Mic, BookOpen, User, Loader2, Clock, 
  Palette, Plus, ChevronRight, TrendingUp, CheckCircle2,
  StopCircle, Smile
} from 'lucide-react';
import { Child, Screen } from '../types';
import ChildSelector from '../components/ChildSelector';

interface ObservationScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  onNavigate: (screen: Screen) => void;
}

const ObservationScreen: React.FC<ObservationScreenProps> = ({ selectedChild, setSelectedChild, onNavigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');
  const [parentNotes, setParentNotes] = useState('');
  const [isRecordingNote, setIsRecordingNote] = useState<'staff' | 'parent' | null>(null);

  const [activeBehaviorTags, setActiveBehaviorTags] = useState<string[]>(['Happy']);
  const [activeActivityTags, setActiveActivityTags] = useState<string[]>(['Paint']);
  const [otherBehavior, setOtherBehavior] = useState('');
  const [otherActivity, setOtherActivity] = useState('');

  // Ref to store the recognition instance and initial text for the session
  const recognitionRef = useRef<any>(null);
  const initialTextRef = useRef<string>('');

  const handleVoiceNote = (type: 'staff' | 'parent') => {
    // If already recording the same type, stop it
    if (isRecordingNote === type) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    // Stop existing if switching
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use a modern browser like Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    // Capture the text state at the start of recording
    initialTextRef.current = type === 'staff' ? staffNotes : parentNotes;

    recognition.onstart = () => {
      setIsRecordingNote(type);
    };

    recognition.onresult = (event: any) => {
      // Collect the full transcript for this session (both finalized and interim)
      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        sessionTranscript += event.results[i][0].transcript;
      }

      // Combine initial text with the current session transcript
      const currentInitial = initialTextRef.current.trim();
      const currentSession = sessionTranscript.trim();
      const newText = currentInitial ? `${currentInitial} ${currentSession}` : currentSession;

      if (type === 'staff') {
        setStaffNotes(newText);
      } else {
        setParentNotes(newText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecordingNote(null);
    };

    recognition.onend = () => {
      setIsRecordingNote(null);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleTag = (tag: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  const behaviorTags = ['Happy', 'Calm', 'Active', 'Tired', 'Fussy', 'Playful'];
  const activityTags = ['Dance', 'Baby Yoga', 'Paint', 'Storytime', 'Garden'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 max-w-4xl mx-auto">
      <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />

      {selectedChild ? (
        <div className="flex flex-col space-y-8">
          {/* Manual Logbook - Primary Interface */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-50">
            <div className="flex items-center space-x-5 mb-10">
              <div className="w-14 h-14 bg-[#00A389] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                <BookOpen size={28} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#1E293B]">Manual Logbook</h4>
                <p className="text-sm font-bold text-slate-400">Structured data entry</p>
              </div>
            </div>

            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Arrival & Departure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                    <Clock size={14} className="text-[#00A389]" />
                    <span>Arrival Time</span>
                  </label>
                  <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#00A389]/20 font-bold text-slate-700 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                    <Clock size={14} className="text-[#00A389]" />
                    <span>Departure Time</span>
                  </label>
                  <input type="time" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-[#00A389]/20 font-bold text-slate-700 transition-all" />
                </div>
              </div>

              {/* Activity Tags */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                  <Palette size={14} className="text-[#00A389]" />
                  <span>Activity</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {activityTags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => toggleTag(tag, activeActivityTags, setActiveActivityTags)} 
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeActivityTags.includes(tag) 
                        ? 'bg-[#00A389] text-white shadow-md' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <div className="flex items-center bg-white rounded-full px-5 border border-slate-200 border-dashed hover:border-[#00A389] transition-colors">
                    <Plus size={14} className="text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Add other category..." 
                      className="bg-transparent text-sm font-bold outline-none py-2 w-36 placeholder:text-slate-300"
                      value={otherActivity}
                      onChange={(e) => setOtherActivity(e.target.value)}
                      onBlur={() => { if(otherActivity) { toggleTag(otherActivity, activeActivityTags, setActiveActivityTags); setOtherActivity(''); } }}
                      onKeyDown={(e) => { if(e.key === 'Enter' && otherActivity) { toggleTag(otherActivity, activeActivityTags, setActiveActivityTags); setOtherActivity(''); } }}
                    />
                  </div>
                </div>
              </div>

              {/* Behavior Tags */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-xs font-black text-[#1E293B] uppercase tracking-wider">
                  <Smile size={14} className="text-indigo-500" />
                  <span>Behavior Tags</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {behaviorTags.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => toggleTag(tag, activeBehaviorTags, setActiveBehaviorTags)} 
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeBehaviorTags.includes(tag) 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <div className="flex items-center bg-white rounded-full px-5 border border-slate-200 border-dashed hover:border-indigo-400 transition-colors">
                    <Plus size={14} className="text-indigo-300 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Add other category..." 
                      className="bg-transparent text-sm font-bold outline-none py-2 w-36 placeholder:text-indigo-200"
                      value={otherBehavior}
                      onChange={(e) => setOtherBehavior(e.target.value)}
                      onBlur={() => { if(otherBehavior) { toggleTag(otherBehavior, activeBehaviorTags, setActiveBehaviorTags); setOtherBehavior(''); } }}
                      onKeyDown={(e) => { if(e.key === 'Enter' && otherBehavior) { toggleTag(otherBehavior, activeBehaviorTags, setActiveBehaviorTags); setOtherBehavior(''); } }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes Sections */}
              <div className="space-y-8 pt-4">
                {/* STAFF NOTES */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#1E293B] uppercase tracking-wider block">Staff Notes</label>
                  <div className="relative group">
                    <textarea
                      disabled={isRecordingNote === 'staff'}
                      placeholder="Add staff observations..."
                      value={staffNotes}
                      onChange={(e) => setStaffNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-6 pr-16 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700 min-h-[140px] resize-none transition-all disabled:bg-slate-100 disabled:opacity-75"
                    />
                    <div className="absolute bottom-5 right-5 flex items-center space-x-2">
                      <button 
                        onClick={() => handleVoiceNote('staff')}
                        className={`p-3 rounded-2xl border-2 border-dashed transition-all shadow-sm ${
                          isRecordingNote === 'staff' 
                          ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                          : 'bg-white border-blue-200 text-blue-500 hover:bg-blue-50'
                        }`}
                        title={isRecordingNote === 'staff' ? "Stop recording" : "Speak to write notes"}
                      >
                        {isRecordingNote === 'staff' ? <StopCircle size={20} /> : <Mic size={20} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pl-2">ai will transcribe automatically</p>
                </div>
                
                {/* PARENT NOTES */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-indigo-600 uppercase tracking-wider block">Parents Notes</label>
                  <div className="relative group">
                    <textarea
                      disabled={isRecordingNote === 'parent'}
                      placeholder="Add parents observations..."
                      value={parentNotes}
                      onChange={(e) => setParentNotes(e.target.value)}
                      className="w-full bg-indigo-50/20 border border-indigo-100 rounded-[2rem] py-5 pl-6 pr-16 outline-none focus:ring-2 focus:ring-indigo-200 font-bold text-slate-700 min-h-[140px] resize-none transition-all disabled:bg-indigo-50/20 disabled:opacity-75"
                    />
                    <div className="absolute bottom-5 right-5 flex items-center space-x-2">
                      <button 
                        onClick={() => handleVoiceNote('parent')}
                        className={`p-3 rounded-2xl border-2 border-dashed transition-all shadow-sm ${
                          isRecordingNote === 'parent' 
                          ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                          : 'bg-white border-blue-200 text-blue-500 hover:bg-blue-50'
                        }`}
                        title={isRecordingNote === 'parent' ? "Stop recording" : "Speak to write notes"}
                      >
                        {isRecordingNote === 'parent' ? <StopCircle size={20} /> : <Mic size={20} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] pl-2">ai will transcribe automatically</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-10">
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="w-full sm:flex-1 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-200 transition-all text-lg shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { 
                    setIsProcessing(true); 
                    setTimeout(() => { 
                      setIsProcessing(false); 
                      onNavigate('dashboard');
                    }, 1500); 
                  }} 
                  className="w-full sm:flex-[2] py-5 bg-[#00A389] text-white rounded-[1.5rem] font-black shadow-xl shadow-teal-100 hover:bg-[#008F78] hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center space-x-3"
                >
                  <CheckCircle2 size={24} />
                  <span>Save Entry</span>
                </button>
              </div>
            </div>
          </div>

          {/* NEXT SECTION NAV BUTTON (Small footer navigation) */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="group flex items-center space-x-4 bg-white/60 backdrop-blur-sm border border-slate-100 px-10 py-4 rounded-full text-slate-400 font-black text-sm hover:bg-white hover:text-[#00A389] transition-all shadow-sm"
            >
              <TrendingUp size={18} />
              <span>Jump to Analytics</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[600px] flex flex-col items-center justify-center text-slate-300 space-y-8 animate-pulse bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
            <User size={56} className="opacity-20" />
          </div>
          <div className="text-center">
            <p className="font-black text-2xl uppercase tracking-[0.2em] text-slate-300">Observation Mode</p>
            <p className="text-sm font-bold text-slate-400 mt-2">Select a child from the list above to start documenting</p>
          </div>
        </div>
      )}

      {/* Processing State Overlay */}
      <div className={`fixed bottom-24 left-6 right-6 md:bottom-10 md:left-auto md:right-10 md:w-96 p-6 rounded-[2rem] transition-all duration-700 transform z-50 ${isProcessing ? 'translate-y-0 opacity-100 bg-gradient-to-r from-[#00A389] to-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center space-x-5">
          <div className="bg-white/20 p-3 rounded-2xl animate-spin"><Loader2 size={24} /></div>
          <div><p className="font-black text-lg">Syncing Observation</p><p className="text-xs opacity-90 font-bold uppercase tracking-widest">Processing structured logs...</p></div>
        </div>
      </div>
    </div>
  );
};

export default ObservationScreen;
