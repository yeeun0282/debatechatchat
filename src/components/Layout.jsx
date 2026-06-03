import React from 'react';
import StepSidebar from './StepSidebar';
import ProgressBar from './ProgressBar';
import HintPanel from './HintPanel';

const Layout = ({ children, currentStep, hintText }) => {
  const isResultStep = currentStep >= 7;

  if (isResultStep) {
    return (
      <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
        <main className="flex-1 overflow-hidden w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <StepSidebar currentStep={currentStep} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Progress Bar */}
        <ProgressBar currentStep={currentStep} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto flex flex-col pb-10">
            {/* Mobile Hint Panel (rendered inside main scrollable area on mobile) */}
            <div className="md:hidden flex-shrink-0 mb-6">
              <HintPanel hintText={hintText} />
            </div>
            
            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Desktop Hint Panel */}
      <HintPanel hintText={hintText} />
    </div>
  );
};

export default Layout;
