import React, { useEffect } from 'react';
import { FileText, Printer, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRandomHint } from '../data/mockResponses';

const CompletionScreen = ({ session, updateSession, onViewScript, onReset }) => {
  // Use hint from step 8
  const completionMessage = getRandomHint(8);

  useEffect(() => {
    // Fire confetti when the completion screen is mounted
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handlePrint = () => {
    // Quick switch back to script view and print
    onViewScript();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-amber-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-300/30 rounded-full blur-2xl"></div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 flex flex-col items-center min-h-0">
        
        <div className="max-w-2xl w-full flex flex-col items-center my-auto py-8 space-y-8">
          {/* Header */}
          <div className="text-center w-full flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full shadow-lg border-4 border-amber-200 text-6xl mb-6 relative animate-bounce">
              🐥
              <div className="absolute -top-3 -right-6 bg-white px-4 py-1.5 rounded-2xl rounded-bl-none shadow-md border border-amber-100 text-sm font-bold text-amber-600 rotate-12">
                준비 끝!
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-amber-900 mb-6 leading-tight">이제 토론에 참여해볼까요?</h1>
            
            {/* Cheer Message */}
            <div className="bg-white/90 backdrop-blur-sm px-6 py-5 rounded-3xl shadow-md border-2 border-amber-200 w-full max-w-lg mx-auto transform transition-all hover:scale-105">
              <p className="text-amber-800 font-bold text-base md:text-lg leading-relaxed text-center break-keep">
                {completionMessage}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <button 
              onClick={onViewScript}
              className="flex-1 max-w-[260px] flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-800 font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
              <FileText className="w-5 h-5" /> 토론 스크립트 다시 보기
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 max-w-[260px] flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all shadow-md hover:shadow-lg"
            >
              <Printer className="w-5 h-5" /> PDF로 저장하기
            </button>
          </div>
          
          <div className="text-center mt-2">
            <button 
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 처음부터 다시 준비하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
