
import React, { useState, useEffect } from 'react';
import { Sparkles, Share2, RefreshCw, Heart, BookOpen, Quote, ChevronLeft, ChevronRight, Calendar, User, FileText, Download, Book, ChevronDown } from 'lucide-react';
import { generateMonthlyStorybook, generateStoryImage } from '../services/geminiService';
import { StoryPage, Child, Screen, DailyLog } from '../types';
import ChildSelector from '../components/ChildSelector';
import { fetchChildLogs } from '../services/dataService';

interface StorybookScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  onNavigate: (screen: Screen) => void;
}

const StorybookScreen: React.FC<StorybookScreenProps> = ({ selectedChild, setSelectedChild, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [logs, setLogs] = useState<DailyLog[]>([]);

  // Restricted list for now as per data availability instructions
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    const loadLogs = async () => {
      if (selectedChild) {
        // Fetch logs for the selected child. We currently only have January data.
        const data = await fetchChildLogs(selectedChild, selectedMonth.toLowerCase());
        setLogs(data);
      }
    };
    loadLogs();
  }, [selectedChild, selectedMonth]);

  const handleGenerate = async () => {
    if (!selectedChild || logs.length === 0) return;
    setIsGenerating(true);
    setCurrentPage(0);
    setLoadingStep('Reading 31 days of adventures...');
    
    try {
      const realObservations = logs
        .slice(0, 10)
        .map(l => `On day ${l.date}, ${l.observations_professional}`)
        .join(" ");

      const generatedPages = await generateMonthlyStorybook(selectedChild.name, selectedMonth, realObservations);
      
      const pagesWithImages = [...generatedPages];
      
      setLoadingStep(`Painting Page 1 with ${selectedChild.name}'s character...`);
      const img1 = await generateStoryImage(
        pagesWithImages[0].imagePrompt, 
        selectedChild.avatar,
        selectedChild.visualDescription
      );
      if (img1) pagesWithImages[0].imageUrl = img1;
      
      setPages(pagesWithImages);
      setLoadingStep('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const loadRemainingImages = async () => {
      if (pages.length > 0 && selectedChild) {
        const updatedPages = [...pages];
        let changed = false;
        for (let i = 0; i < updatedPages.length; i++) {
          if (!updatedPages[i].imageUrl) {
            const img = await generateStoryImage(
              updatedPages[i].imagePrompt, 
              selectedChild.avatar,
              selectedChild.visualDescription
            );
            if (img) {
              updatedPages[i].imageUrl = img;
              changed = true;
            }
          }
        }
        if (changed) setPages(updatedPages);
      }
    };
    if (!isGenerating && pages.length > 0) {
      loadRemainingImages();
    }
  }, [pages, isGenerating, selectedChild]);

  useEffect(() => {
    setPages([]);
    setCurrentPage(0);
  }, [selectedChild]);

  const activePage = pages[currentPage];

  return (
    <div className="space-y-10 animate-in zoom-in duration-700 max-w-4xl mx-auto pb-24 relative">
      <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
      
      <Heart className="absolute top-20 -left-32 text-pink-300 opacity-40 animate-pulse hidden lg:block" size={80} />
      <Sparkles className="absolute bottom-40 -right-32 text-yellow-300 opacity-40 animate-bounce hidden lg:block" size={100} />

      {selectedChild ? (
        <>
          {/* Period Selector Header */}
          <section className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-500 shadow-inner">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">Select Story Period</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{logs.length} DAYS OF DATA FOUND</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-48 group">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-700 text-xs shadow-inner appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {months.map(m => (
                    <option key={m} value={m} disabled={m !== 'January'}>
                      {m} {m !== 'January' ? '(No Data)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || logs.length === 0}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 flex items-center space-x-2 text-xs hover:scale-[1.02] active:scale-95"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                <span>Generate From Logs</span>
              </button>
            </div>
          </section>

          {isGenerating ? (
            <div className="rainbow-border rounded-[3.5rem] shadow-2xl overflow-hidden h-[600px] flex flex-col items-center justify-center bg-white space-y-8 p-12 text-center">
              <div className="relative">
                 <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <BookOpen size={40} className="animate-pulse" />
                 </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Synthesizing Pedagogical Logs</h2>
                <p className="text-lg font-bold text-indigo-500 italic">{loadingStep}</p>
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] pt-4">Powered by Gemini 3 Pro</p>
              </div>
            </div>
          ) : pages.length > 0 ? (
            <div className="space-y-8">
              <div className="rainbow-border rounded-[3.5rem] shadow-2xl fun-shadow relative">
                <div className="bg-white rounded-[3.25rem] overflow-hidden flex flex-col md:flex-row h-full min-h-[550px]">
                  
                  <div className="w-full md:w-1/2 aspect-square bg-slate-50 relative overflow-hidden group">
                    {activePage?.imageUrl ? (
                      <img
                        src={activePage.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt={`Illustration for page ${currentPage + 1}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-12 text-center bg-indigo-50/30">
                        <RefreshCw className="animate-spin text-indigo-400" size={48} />
                        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Painting your memory...</p>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border-2 border-indigo-50">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Page {currentPage + 1} of 5</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative bg-white">
                    <Quote className="absolute top-10 right-10 text-indigo-50 w-24 h-24 opacity-20" />
                    <div className="relative z-10 space-y-8">
                      <p className="text-2xl font-bold text-slate-700 leading-relaxed italic font-serif">
                        "{activePage?.text}"
                      </p>
                      <div className="flex items-center space-x-4 pt-6">
                        {/* Avatar removed as per request to only show name */}
                        <div className="text-left">
                          <span className="block text-lg font-black text-slate-800">{selectedChild.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 px-10 flex items-center justify-between">
                      <button 
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-4 rounded-2xl bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        disabled={currentPage === 4}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-4 rounded-2xl bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all disabled:opacity-30"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button className="flex-1 flex items-center justify-center space-x-4 py-6 bg-white hover:bg-indigo-50 border-2 border-indigo-50 rounded-[2.5rem] transition-all group shadow-sm text-slate-700">
                  <Download className="group-hover:scale-110 transition-transform text-indigo-500" size={24} />
                  <span className="text-lg font-black">Download PDF Book</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-4 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2.5rem] shadow-2xl transition-all group">
                  <Share2 size={24} />
                  <span className="text-lg font-black">Share Full Month Story</span>
                </button>
              </div>
            </div>
          ) : (
            /* Storybook Ready Section */
            <div className="bg-white/40 backdrop-blur rounded-[3rem] p-20 border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
               <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-400 shadow-inner">
                 <Book size={48} />
               </div>
               <div className="space-y-3">
                 <h3 className="text-3xl font-black text-slate-800 tracking-tight">Storybook Ready</h3>
                 <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed text-sm">
                   We found {logs.length} days of data for {selectedChild.name}. Ready to weave some magic?
                 </p>
               </div>
               
               <div className="space-y-6 w-full max-w-sm">
                 <button 
                  disabled={logs.length === 0}
                  onClick={handleGenerate}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-base"
                 >
                  Generate {selectedMonth} Book
                 </button>
                 {/* Archived Reports removed as per request to simplify the view */}
               </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-slate-300 space-y-6 animate-pulse">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
            <User size={48} className="opacity-30" />
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-slate-400">Select a child to build a storybook</p>
        </div>
      )}
    </div>
  );
};

export default StorybookScreen;
