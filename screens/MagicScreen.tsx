
import React, { useState, useEffect } from 'react';
import { Sparkles, Share2, RefreshCw, Heart, BookOpen, Quote, ChevronLeft, ChevronRight, Calendar, User, ClipboardList, FileText, Download } from 'lucide-react';
import { generateMonthlyStorybook, generateStoryImage } from '../services/geminiService';
import { StoryPage, Child, Screen } from '../types';
import ChildSelector from '../components/ChildSelector';

interface StorybookScreenProps {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  onNavigate: (screen: Screen) => void;
}

const StorybookScreen: React.FC<StorybookScreenProps> = ({ selectedChild, setSelectedChild, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleGenerate = async () => {
    if (!selectedChild) return;
    setIsGenerating(true);
    setCurrentPage(0);
    setLoadingStep('Writing the 5 chapters of magic...');
    
    try {
      const mockObservations = `${selectedChild.name} loved the outdoor garden, painted a rainbow, learned about ladybugs, shared a snack with friends, and had very peaceful nap times.`;
      const generatedPages = await generateMonthlyStorybook(selectedChild.name, selectedMonth, mockObservations);
      
      const pagesWithImages = [...generatedPages];
      
      setLoadingStep(`Painting Page 1 with ${selectedChild.name}'s avatar...`);
      // Pass the child's avatar and visual description as reference
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
            // Pass the child's avatar and visual description as reference for consistency
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
          {/* Configuration Header */}
          <section className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 tracking-tight">Select Adventure Month</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identify the story's period</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 md:w-48 bg-slate-100 border-none rounded-2xl px-6 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{pages.length > 0 ? 'Regenerate' : 'Create Book'}</span>
              </button>
            </div>
          </section>

          {isGenerating ? (
            <div className="rainbow-border rounded-[3.5rem] shadow-2xl overflow-hidden h-[600px] flex flex-col items-center justify-center bg-white space-y-8 p-12 text-center">
              <div className="relative">
                 <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="text-indigo-600 animate-pulse" size={40} />
                 </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Preparing the Digital Book</h2>
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
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar size={16} className="text-pink-400" />
                        <span className="text-xs font-black text-pink-400 uppercase tracking-[0.2em]">{selectedMonth} Adventures</span>
                      </div>
                      
                      <p className="text-2xl font-bold text-slate-700 leading-relaxed italic font-serif">
                        "{activePage?.text}"
                      </p>
                      
                      <div className="flex items-center space-x-4 pt-6">
                        <img src={selectedChild.avatar} alt="" className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg transform -rotate-6" />
                        <div className="text-left">
                          <span className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest">Explorer</span>
                          <span className="block text-lg font-black text-slate-800">{selectedChild.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 px-10 flex items-center justify-between">
                      <button 
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-4 rounded-2xl bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <div className="flex space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full transition-all ${i === currentPage ? 'bg-indigo-600 w-8' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <button 
                        disabled={currentPage === 4}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-4 rounded-2xl bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 transition-all"
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
                <button className="flex-1 flex items-center justify-center space-x-4 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95 group">
                  <Share2 className="text-white group-hover:rotate-12 transition-transform" size={24} />
                  <span className="text-lg font-black">Share Full Month Story</span>
                </button>
              </div>

              {/* NEXT SECTION NAV BUTTON (Back to Start) */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => onNavigate('observations')}
                  className="group relative flex items-center space-x-4 bg-white/80 backdrop-blur-sm border-2 border-blue-200 px-12 py-5 rounded-[2rem] text-blue-600 font-black text-xl hover:bg-blue-50 hover:border-blue-400 transition-all shadow-xl shadow-blue-100/50"
                >
                  <div className="bg-blue-100 p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <ClipboardList size={24} />
                  </div>
                  <span>Start New Observation</span>
                  <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur rounded-[3rem] p-20 border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-300">
                 <BookOpen size={48} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-800">No Storybook Found</h3>
                 <p className="text-slate-500 font-bold">Select a month above and let Gemini 3 Pro weave some magic for {selectedChild.name}!</p>
               </div>
               
               <div className="space-y-8 w-full max-w-sm">
                 <button 
                  onClick={handleGenerate}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
                 >
                  Generate {selectedMonth} Book
                 </button>

                 {/* EXPORT TO PDF FIELD (NEW - Based on mockup) */}
                 <div className="relative group">
                   <div className="absolute inset-0 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 group-hover:border-indigo-400 transition-colors" />
                   <button className="relative w-full py-6 flex flex-col items-center justify-center space-y-2 text-indigo-400 group-hover:text-indigo-600 transition-colors">
                     <FileText size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Export to PDF field</span>
                   </button>
                 </div>
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

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] bg-white inline-block px-10 py-3 rounded-full shadow-sm border border-slate-50">
          KinderTrace AI • Fun Story Synthesis
        </p>
      </div>
    </div>
  );
};

export default StorybookScreen;
