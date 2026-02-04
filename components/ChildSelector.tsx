
import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { MOCK_CHILDREN } from '../constants';
import { Child } from '../types';

interface ChildSelectorProps {
  selectedChild: Child | null;
  onSelect: (child: Child) => void;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({ selectedChild, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredChildren = MOCK_CHILDREN.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden mb-8">
      <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">Select Child</h3>
      <div className="relative mb-8">
        <Search className="absolute left-5 top-4 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search for a child..."
          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {filteredChildren.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelect(child)}
            className={`flex-shrink-0 flex flex-col items-center space-y-3 p-3 rounded-3xl transition-all ${
              selectedChild?.id === child.id ? 'bg-indigo-50 scale-105 shadow-sm' : 'hover:bg-slate-50'
            }`}
          >
            <div className={`relative w-16 h-16 rounded-full p-0.5 border-2 transition-all ${
              selectedChild?.id === child.id ? 'border-indigo-500' : 'border-transparent'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
                {!imageErrors[child.id] ? (
                  <img 
                    src={child.avatar} 
                    alt={child.name} 
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(child.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                    {child.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              
              {selectedChild?.id === child.id && (
                <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm z-10">
                  <Star size={12} fill="white" />
                </div>
              )}
            </div>
            <span className={`text-xs font-black ${selectedChild?.id === child.id ? 'text-indigo-600' : 'text-slate-500'}`}>
              {child.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ChildSelector;
