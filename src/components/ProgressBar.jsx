import React from 'react';
import { Mic } from 'lucide-react';

const ProgressBar = ({ currentStep, totalSteps = 6 }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-primary flex items-center gap-1">
          <Mic className="w-5 h-5 text-primary" />
          쟁점톡톡
        </h1>
        <span className="text-sm font-medium text-slate-500">
          {currentStep} / {totalSteps} 단계
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
