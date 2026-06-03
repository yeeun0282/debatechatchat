import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const HintPanel = ({ hintText }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile view: Collapsible Card */}
      <div className="md:hidden w-full bg-indigo-50 border border-indigo-100 rounded-xl mb-6 shadow-sm overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-indigo-100/50 text-indigo-900 font-semibold"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🐣</span>
            <span>톡톡이의 힌트</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isOpen && (
          <div className="p-4 flex items-start gap-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-indigo-50 text-slate-700 text-sm leading-relaxed">
              {hintText}
            </div>
          </div>
        )}
      </div>

      {/* Desktop view: Right sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-slate-50 border-l border-slate-200 p-6 h-full">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-primary w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-800">톡톡이 힌트</h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm border-2 border-white">
            🐣
          </div>
          <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-md border border-slate-100 text-slate-700 relative w-full">
            <div className="absolute top-0 left-[-8px] w-4 h-4 bg-white border-t border-l border-slate-100 transform -skew-x-12 z-0"></div>
            <p className="relative z-10 text-sm leading-relaxed whitespace-pre-line">
              {hintText}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HintPanel;
