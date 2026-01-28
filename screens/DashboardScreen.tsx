
import React, { useState } from 'react';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Activity, Smile, TrendingUp, Moon, Brain, FileText, User
} from 'lucide-react';
import { Child } from '../types';
import ChildSelector from '../components/ChildSelector';

interface DashboardScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ selectedChild, setSelectedChild }) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  const sleepData = [
    { name: 'Goal', value: 100, fill: '#f1f5f9' },
    { name: 'Current', value: 75, fill: '#00A389' },
  ];

  const moodData = [
    { day: 'Mon', calm: 8, energetic: 6, fussy: 2 },
    { day: 'Tue', calm: 7, energetic: 7, fussy: 3 },
    { day: 'Wed', calm: 9, energetic: 5, fussy: 1 },
    { day: 'Thu', calm: 6, energetic: 8, fussy: 2 },
    { day: 'Fri', calm: 8, energetic: 6, fussy: 1 },
  ];

  const physicalData = [
    { day: 'Mon', appetite: 85 },
    { day: 'Tue', appetite: 92 },
    { day: 'Wed', appetite: 78 },
    { day: 'Thu', appetite: 94 },
    { day: 'Fri', appetite: 90 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 pb-24">
      <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      
      {selectedChild ? (
        <>
          {/* Header Profile Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img src={selectedChild.avatar} alt={selectedChild.name} className="w-20 h-20 rounded-full object-cover shadow-md border-4 border-white" />
                <div className="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-4 border-white"></div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">{selectedChild.name}</h2>
                <div className="flex items-center space-x-4 text-sm font-bold text-slate-400 mt-1">
                  <span className="flex items-center"><Moon size={14} className="mr-1 text-indigo-400" /> Age {selectedChild.age.split(' ')[0]}</span>
                  <span className="flex items-center"><Activity size={14} className="mr-1 text-indigo-400" /> {selectedChild.section.split(' ')[0]}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm">
                <FileText size={16} />
                <span>Export for Professional</span>
              </button>
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#00A389] text-white rounded-full text-xs font-black hover:bg-[#008F78] transition-colors shadow-sm">
                <Brain size={16} />
                <span>Pedagogical Recommendations</span>
              </button>
            </div>
          </section>

          {/* Report Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-white p-1.5 rounded-full border border-slate-100 shadow-sm w-full max-w-md">
              <button
                onClick={() => setReportType('weekly')}
                className={`flex-1 py-3 rounded-full text-xs font-black transition-all ${reportType === 'weekly' ? 'bg-[#00A389] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Weekly Summary
              </button>
              <button
                onClick={() => setReportType('monthly')}
                className={`flex-1 py-3 rounded-full text-xs font-black transition-all ${reportType === 'monthly' ? 'bg-[#00A389] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Monthly Report
              </button>
            </div>
          </div>

          {/* Insights Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Sleep Quality Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center">
              <div className="w-full flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 bg-[#00A389] rounded-xl flex items-center justify-center text-white">
                  <Moon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Sleep Quality</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average duration vs. goal</p>
                </div>
              </div>
              
              <div className="h-52 w-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={sleepData} startAngle={90} endAngle={450}>
                    <RadialBar dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                  <span className="text-4xl font-black text-[#1E293B]">75%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of goal</span>
                </div>
              </div>

              <div className="w-full mt-8 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Average Duration:</span>
                  <span className="text-slate-700">2.5 hours</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Goal:</span>
                  <span className="text-slate-700">3.0 hours</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Trend:</span>
                  <span className="text-teal-500 flex items-center"><TrendingUp size={12} className="mr-1" /> Improving</span>
                </div>
              </div>
            </div>

            {/* Mood & Behavior Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col">
              <div className="w-full flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 bg-[#FF5C00] rounded-xl flex items-center justify-center text-white">
                  <Smile size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Mood & Behavior</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emotional patterns</p>
                </div>
              </div>
              
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis hide domain={[0, 12]} />
                    <Line type="monotone" dataKey="calm" stroke="#00A389" strokeWidth={3} dot={{ r: 4, fill: '#00A389' }} />
                    <Line type="monotone" dataKey="energetic" stroke="#FF9F43" strokeWidth={3} dot={{ r: 4, fill: '#FF9F43' }} />
                    <Line type="monotone" dataKey="fussy" stroke="#FF5C5C" strokeWidth={3} dot={{ r: 4, fill: '#FF5C5C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center space-x-6 mt-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#00A389] rounded-full" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">Calm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FF9F43] rounded-full" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">Energetic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FF5C5C] rounded-full" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">Fussy</span>
                </div>
              </div>
            </div>

            {/* Physical Health Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col">
              <div className="w-full flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E293B]">Physical Health</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appetite & consistency</p>
                </div>
              </div>
              
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={physicalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} domain={[0, 100]} />
                    <Line type="monotone" dataKey="appetite" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: '#3B82F6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-8 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Average Appetite:</span>
                  <span className="text-slate-700">86%</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Stool Consistency:</span>
                  <span className="text-slate-700">Normal</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Hydration:</span>
                  <span className="text-green-500">Good</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1E293B]">AI-Generated Insights</h3>
                <p className="text-xs font-bold text-slate-400">Personalized observations and recommendations</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#E6FFFA] border-l-4 border-[#00A389] rounded-2xl p-6">
                <h5 className="text-sm font-black text-[#006B5D] mb-2">Development Progress</h5>
                <p className="text-sm text-[#006B5D] leading-relaxed font-medium">
                  {selectedChild.name} shows consistent improvement in social interactions and communication skills. The increased calm behavior patterns suggest better emotional regulation and comfort in the daycare environment.
                </p>
              </div>

              <div className="bg-[#EBF5FF] border-l-4 border-[#3B82F6] rounded-2xl p-6">
                <h5 className="text-sm font-black text-[#1E3A8A] mb-2">Sleep Patterns</h5>
                <p className="text-sm text-[#1E3A8A] leading-relaxed font-medium">
                  Sleep duration is approaching the recommended goal. Consider maintaining consistent nap times and ensuring a calm pre-sleep routine to further improve sleep quality.
                </p>
              </div>

              <div className="bg-[#FFF5E6] border-l-4 border-[#FF5C00] rounded-2xl p-6">
                <h5 className="text-sm font-black text-[#9A3412] mb-2">Nutritional Observations</h5>
                <p className="text-sm text-[#9A3412] leading-relaxed font-medium">
                  Appetite remains strong and consistent. The child shows healthy eating patterns with a preference for fruits and proteins. Continue offering variety to support balanced nutrition.
                </p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-slate-300 space-y-6 animate-pulse">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
            <User size={48} className="opacity-30" />
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-slate-400">Select a child to view insights</p>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
