import React from 'react';
import { Puzzle, ArrowRight, ArrowLeft } from 'lucide-react';

const RevisionStep = ({ session, updateSession, onNext, onPrev }) => {
  const { perspectives } = session;
  const reflection = perspectives?.studentReflection || {};

  const handleChange = (field, value) => {
    updateSession({
      perspectives: {
        ...perspectives,
        studentReflection: {
          ...reflection,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Puzzle className="text-primary" />
          내 주장 보완하기
        </h2>
        <p className="text-slate-500 mt-2">
          앞에서 살펴본 다양한 관점을 바탕으로 내 주장을 더 탄탄하게 다듬어 보세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-2">
          <p className="text-xs text-indigo-600 font-bold mb-1">참고: 처음에 적었던 나의 주장</p>
          <p className="text-sm text-indigo-900 font-medium">{session.studentClaim || "(입력된 주장이 없습니다)"}</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block font-bold text-slate-700 text-sm mb-2">1. 처음 내 주장과 비교했을 때 달라진 점이 있나요?</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={reflection.changedPoint || ""}
              onChange={(e) => handleChange('changedPoint', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-sm mb-2">2. 새롭게 고려하게 된 관점은 무엇인가요?</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={reflection.newlyConsidered || ""}
              onChange={(e) => handleChange('newlyConsidered', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-sm mb-2">3. 내가 일부 받아들일 수 있는 다른 입장은 무엇인가요?</label>
            <input 
              type="text" 
              placeholder="예: 반대측에서 우려하는 예산 부족 문제는 일리가 있다고 생각합니다."
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={reflection.acceptedView || ""}
              onChange={(e) => handleChange('acceptedView', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-sm mb-2">4. 그래도 유지하고 싶은 내 핵심 주장은 무엇인가요?</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={reflection.coreClaimToKeep || ""}
              onChange={(e) => handleChange('coreClaimToKeep', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-sm mb-2">5. 내 주장을 더 설득력 있게 만들기 위해 추가하고 싶은 조건이나 보완점은 무엇인가요?</label>
            <textarea 
              rows="3"
              placeholder="예: 전면 시행보다는 예외 조항을 두어야 한다고 생각합니다."
              className="w-full p-3 rounded-lg border-2 border-primary/30 bg-primary/5 focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-medium text-slate-800"
              value={reflection.improvedClaim || ""}
              onChange={(e) => handleChange('improvedClaim', e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-between flex-shrink-0">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-100 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> 이전 단계
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          다음 단계 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RevisionStep;
