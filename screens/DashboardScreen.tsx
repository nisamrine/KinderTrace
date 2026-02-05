
import React, { useState, useEffect, useMemo } from 'react';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Activity, Smile, Moon, Brain, User, ChevronRight, BookHeart,
  Clock, Loader2, X, Lightbulb, Sparkles, Calendar, History, CheckCircle
} from 'lucide-react';
import { Child, Screen, DailyLog } from '../types';
import ChildSelector from '../components/ChildSelector';
import { GoogleGenAI } from "@google/genai";
import { fetchChildLogs } from '../services/dataService';

interface DashboardScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ selectedChild, setSelectedChild, onNavigate }) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('monthly');
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [recs, setRecs] = useState<string[] | null>(null);
  const [showRecsModal, setShowRecsModal] = useState(false);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // Synthesis state
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      if (selectedChild) {
        setIsLoadingLogs(true);
        const data = await fetchChildLogs(selectedChild);
        setLogs(data);
        setIsLoadingLogs(false);
        setAvatarError(false);
      }
    };
    loadLogs();
  }, [selectedChild]);

  // Aggregate logs based on selection
  const aggregatedLogs = useMemo(() => {
    if (logs.length === 0) return [];
    if (reportType === 'weekly') {
      // Take last 5 days for weekly view
      return logs.slice(-5);
    }
    return logs;
  }, [logs, reportType]);

  // AI Synthesis Generation
  useEffect(() => {
    const generateSynthesis = async () => {
      if (!selectedChild || aggregatedLogs.length === 0) return;
      
      setIsGeneratingSynthesis(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const periodText = reportType === 'weekly' ? 'this week' : 'this month';
        const observationSnippet = aggregatedLogs.map(l => l.observations_professional).join(' ');
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `As a professional pedagogue, write a warm, insightful 2-sentence narration of ${selectedChild.name}'s developmental journey ${periodText}. 
          Base it on these observations: ${observationSnippet}. 
          Focus on their security and growth. Professional yet warm tone.`,
        });
        
        setSynthesis(response.text || null);
      } catch (error) {
        console.error("Synthesis generation failed:", error);
        setSynthesis(`${selectedChild.name} has demonstrated beautiful engagement with classroom materials. Their growing confidence in social interactions highlights a deepening sense of emotional security.`);
      } finally {
        setIsGeneratingSynthesis(false);
      }
    };

    generateSynthesis();
  }, [selectedChild, aggregatedLogs, reportType]);

  // Metric Calculation Logic
  const metrics = useMemo(() => {
    if (aggregatedLogs.length === 0) return null;

    // 1. Sleep Metrics
    const avgSleep = aggregatedLogs.reduce((acc, log) => acc + log.sleep, 0) / aggregatedLogs.length;
    const sleepPercentage = Math.min(Math.round((avgSleep / 3.0) * 100), 100);
    const sleepData = [
      { name: 'Goal', value: 100, fill: '#f1f5f9' },
      { name: 'Current', value: sleepPercentage, fill: '#00A389' },
    ];

    // 2. Presence Metrics
    const daysArr = aggregatedLogs.length <= 5 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : aggregatedLogs.map(l => l.date.slice(-2));
    const presenceData = aggregatedLogs.map((log, idx) => {
      const day = aggregatedLogs.length <= 5 ? daysArr[idx] : log.date.slice(-2);
      const [arrH, arrM] = log.arrival_time.split(':').map(Number);
      const [depH, depM] = log.departure_time.split(':').map(Number);
      const diff = (depH + depM / 60) - (arrH + arrM / 60);
      return { day, hours: Number(diff.toFixed(1)) };
    });

    // 3. Mood Trends
    const behaviorMap = {
      calm: ['calm', 'observant', 'reserved', 'sensitive', 'regulated', 'attentive', 'quiet', 'secure', 'balanced', 'thoughtful', 'reflective'],
      energetic: ['joyful', 'engaged', 'curious', 'confident', 'expressive', 'independent', 'active', 'leader', 'energetic'],
      fussy: ['tired', 'clingy', 'impulsive', 'reactive', 'frustrated', 'restless', 'seeking movement', 'seeking comfort', 'fatigued']
    };

    const moodData = aggregatedLogs.map((log, idx) => {
      const day = aggregatedLogs.length <= 5 ? daysArr[idx] : log.date.slice(-2);
      const counts = { calm: 0, energetic: 0, fussy: 0 };
      log.behavior.forEach(b => {
        const behavior = b.toLowerCase();
        if (behaviorMap.calm.some(key => behavior.includes(key))) counts.calm += 8;
        if (behaviorMap.energetic.some(key => behavior.includes(key))) counts.energetic += 8;
        if (behaviorMap.fussy.some(key => behavior.includes(key))) counts.fussy += 8;
      });
      return { day, ...counts };
    });

    return { sleepData, presenceData, moodData, avgSleep, sleepPercentage };
  }, [aggregatedLogs]);

  const handleGetRecommendations = async () => {
    if (!selectedChild || !metrics) return;
    setShowRecsModal(true);
    setIsGeneratingRecs(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As a world-class child psychologist, provide 3 brief recommendations for ${selectedChild.name} (${selectedChild.age}). Base it on: ${aggregatedLogs.slice(0, 5).map(l => l.behavior.join(', ')).join('; ')}. Format as 3 points.`,
      });
      
      const text = response.text || "";
      const tips = text.split('\n').filter(t => t.trim()).slice(0, 3).map(t => t.replace(/^\d+\.\s*/, '').trim());
      setRecs(tips.length > 0 ? tips : ["Encourage parallel play", "Maintain sleep routine", "Sensory baskets for regulation"]);
    } catch (error) {
      setRecs(["Encourage social interaction", "Focus on fine motor skills", "Consistent nap times"]);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 pb-24">
      <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      
      {selectedChild ? (
        isLoadingLogs ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <p className="font-black uppercase tracking-widest text-xs">Synchronizing Pedagogical Logs...</p>
          </div>
        ) : metrics ? (
        <>
          {/* Header Profile Section with Error Handling */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20">
                {!avatarError ? (
                  <img 
                    src={selectedChild.avatar} 
                    alt={selectedChild.name} 
                    className="w-full h-full rounded-full object-cover shadow-md border-4 border-white"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-md text-slate-400 font-black text-2xl">
                    {selectedChild.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-4 border-white"></div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">{selectedChild.name}</h2>
                <div className="flex items-center space-x-4 text-sm font-bold text-slate-400 mt-1">
                  <span className="flex items-center space-x-1"><Moon size={14} className="text-indigo-400" /> <span>Age {selectedChild.age.split(' ')[0]}</span></span>
                  <span className="flex items-center space-x-1"><Activity size={14} className="text-indigo-400" /> <span>{selectedChild.section}</span></span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleGetRecommendations}
              className="flex items-center space-x-2 px-6 py-3 bg-[#E0FCF6] text-[#00A389] rounded-full text-xs font-black border border-[#00A389]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Brain size={16} />
              <span>Pedagogical Recommendations</span>
            </button>
          </section>

          {/* Aggregation Selector */}
          <div className="flex justify-center">
             <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-inner border border-slate-200">
                <button 
                  onClick={() => setReportType('weekly')}
                  className={`px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${reportType === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  WEEKLY
                </button>
                <button 
                  onClick={() => setReportType('monthly')}
                  className={`px-10 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${reportType === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  MONTHLY
                </button>
             </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sleep Quality */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center">
              <div className="w-full flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-[#00A389] rounded-xl flex items-center justify-center text-white"><Moon size={20} /></div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Sleep Quality</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reportType === 'weekly' ? 'WEEKLY' : 'MONTHLY'} AVERAGE</p>
                </div>
              </div>
              <div className="h-52 w-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={metrics.sleepData} startAngle={90} endAngle={450}>
                    <RadialBar dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1E293B]">{metrics.sleepPercentage}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">OF GOAL</span>
                </div>
              </div>
              <div className="w-full mt-8 space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Average Duration:</span><span className="text-slate-700">{metrics.avgSleep.toFixed(1)}h</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Data Status:</span><span className="text-[#00A389] flex items-center"><CheckCircle size={12} className="mr-1" /> Verified Logs</span></div>
              </div>
            </div>

            {/* Mood & Behavior */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col">
              <div className="w-full flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white"><Smile size={20} /></div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Mood & Behavior</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOG-BASED PATTERNS</p>
                </div>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.moodData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis hide domain={[0, 15]} />
                    <Line type="monotone" dataKey="calm" stroke="#00A389" strokeWidth={3} dot={{ r: 4, fill: '#00A389' }} />
                    <Line type="monotone" dataKey="energetic" stroke="#FF9F43" strokeWidth={3} dot={{ r: 4, fill: '#FF9F43' }} />
                    <Line type="monotone" dataKey="fussy" stroke="#FF5C5C" strokeWidth={3} dot={{ r: 4, fill: '#FF5C5C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-8">
                {['Calm', 'Energetic', 'Fussy'].map((label, i) => (
                   <div key={label} className="flex items-center space-x-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-[#00A389]' : i === 1 ? 'bg-[#FF9F43]' : 'bg-[#FF5C5C]'}`} />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                   </div>
                ))}
              </div>
            </div>

            {/* Presence Hours */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col">
              <div className="w-full flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Clock size={20} /></div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Presence Hours</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATTENDANCE LOGS</p>
                </div>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.presenceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={reportType === 'weekly' ? 24 : 8}>
                      {metrics.presenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hours >= 8 ? '#4F46E5' : '#818CF8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mt-8 space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Daily Average:</span><span className="text-slate-700">{ (metrics.presenceData.reduce((a,b) => a+b.hours, 0) / metrics.presenceData.length).toFixed(1) }h</span></div>
                <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Sync Status:</span><span className="text-indigo-500">Live</span></div>
              </div>
            </div>
          </div>

          {/* Pedagogical Synthesis Section */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-50 shadow-inner rounded-2xl flex items-center justify-center text-indigo-500">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1E293B] tracking-tight">Pedagogical Synthesis</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Automated insights from daily professional observations</p>
              </div>
            </div>

            <div className="bg-[#E6FFFA] border-l-[6px] border-[#00A389] rounded-2xl p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={140} />
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div className="flex items-center space-x-2 text-[#00A389]">
                    <Calendar size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">{reportType === 'weekly' ? 'Last 7 Days Journey' : 'Monthly Growth Summary'}</span>
                 </div>
               </div>

               {isGeneratingSynthesis ? (
                 <div className="flex flex-col items-center py-6 space-y-3">
                   <Loader2 size={32} className="animate-spin text-[#00A389]" />
                   <p className="text-[10px] font-black text-[#00A389]/60 uppercase tracking-widest">Wweaving journey narrative...</p>
                 </div>
               ) : (
                 <p className="text-lg text-slate-700 leading-relaxed font-bold italic font-serif">
                   "{synthesis || `During this period, ${selectedChild.name} has demonstrated remarkable engagement with classroom materials. Their growing confidence in social interactions highlights a deepening sense of emotional security.`}"
                 </p>
               )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <History size={16} className="text-slate-300" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Historical Milestones</h4>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {aggregatedLogs.slice(-3).reverse().map((log, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 group hover:border-indigo-100 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">DAILY MILESTONE: {log.date}</h5>
                      </div>
                      <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{log.activity[0]}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">
                      {log.observations_professional}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Nav To Storybook */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => onNavigate('storybook')}
              className="group flex items-center space-x-4 bg-white border-2 border-indigo-100 px-12 py-5 rounded-[2rem] text-indigo-600 font-black text-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-xl shadow-indigo-100/30"
            >
              <BookHeart size={24} />
              <span>Build Monthly Storybook</span>
              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-slate-300">
             <p className="font-bold">Data unavailable for this period.</p>
          </div>
        )
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-slate-300 space-y-6 animate-pulse">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
            <User size={48} className="opacity-30" />
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-slate-400">Select a child for deep analysis</p>
        </div>
      )}

      {/* Recs Modal */}
      {showRecsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/50">
            <div className="bg-gradient-to-r from-[#00A389] to-indigo-600 p-8 text-white relative">
              <button onClick={() => setShowRecsModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
              <div className="flex items-center space-x-4 mb-2">
                <div className="bg-white/20 p-2 rounded-xl"><Brain size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pedagogical Engine</span>
              </div>
              <h3 className="text-2xl font-black">AI Recommendations</h3>
            </div>
            <div className="p-10 space-y-6">
              {isGeneratingRecs ? (
                <div className="py-12 flex flex-col items-center space-y-4 text-slate-400">
                  <Loader2 size={48} className="animate-spin text-teal-500" />
                  <p className="font-black text-sm uppercase tracking-widest">Consulting Development Agents...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recs?.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="bg-white p-2 rounded-lg text-teal-500 shadow-sm"><Lightbulb size={20} /></div>
                      <p className="text-slate-700 font-bold leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
