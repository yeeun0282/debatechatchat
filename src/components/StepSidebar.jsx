import React from 'react';
import { CheckCircle2, Circle, Compass, PenTool, Search, Users, Puzzle, Mic } from 'lucide-react';

const steps = [
  { id: 1, name: "쟁점 확인", icon: Compass },
  { id: 2, name: "내 입장", icon: PenTool },
  { id: 3, name: "근거 준비", icon: Search },
  { id: 4, name: "다양한 관점", icon: Users },
  { id: 5, name: "주장 보완", icon: Puzzle },
  { id: 6, name: "발언 카드", icon: Mic },
];

const StepSidebar = ({ currentStep }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 h-full shadow-sm z-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Mic className="text-primary" />
          쟁점톡톡
        </h1>
        <p className="text-xs text-slate-500 mt-2">토론 전, 내 한마디를 준비하는 앱</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-6">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;

            let textColor = "text-slate-400";
            let iconColor = "text-slate-300";
            
            if (isCurrent) {
              textColor = "text-primary font-bold";
              iconColor = "text-primary";
            } else if (isCompleted) {
              textColor = "text-slate-700";
              iconColor = "text-secondary";
            }

            return (
              <li key={step.id} className="relative">
                {/* Connecting line */}
                {step.id !== steps.length && (
                  <div className={`absolute left-3 top-8 bottom-[-24px] w-0.5 ${isCompleted ? 'bg-secondary' : 'bg-slate-200'}`}></div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="relative z-10 bg-white mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-6 h-6 ${iconColor}`} />
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                    ) : (
                      <Circle className={`w-6 h-6 ${iconColor}`} />
                    )}
                  </div>
                  <div className={`flex items-center gap-2 ${textColor}`}>
                    <Icon className="w-5 h-5" />
                    <span>{step.name}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default StepSidebar;
