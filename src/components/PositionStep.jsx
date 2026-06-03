import React from 'react';
import { PenTool, ArrowRight, ArrowLeft } from 'lucide-react';

const PositionStep = ({ session, updateSession, onNext, onPrev }) => {
  const { positionScale, studentClaim, studentReason } = session;

  const handleScaleChange = (val) => {
    updateSession({ positionScale: val });
  };

  const scaleLabels = {
    1: "매우 반대",
    2: "반대에 가까움",
    3: "아직 잘 모르겠음",
    4: "찬성에 가까움",
    5: "매우 찬성"
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <PenTool className="text-primary" />
          처음 내 생각 정리하기
        </h2>
        <p className="text-slate-500 mt-2">
          선택한 쟁점에 대해 나의 생각은 어떤지 간단히 정리해 보세요.
        </p>
      </div>

      <div className="p-6 md:p-8 flex-1 space-y-8">
        {/* Scale */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-4">현재 나의 입장은 어느 쪽에 가깝나요?</h3>
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm font-semibold text-rose-600 w-20 text-center">매우 반대</span>
            <span className="text-sm font-semibold text-slate-500 w-20 text-center">잘 모르겠음</span>
            <span className="text-sm font-semibold text-indigo-600 w-20 text-center">매우 찬성</span>
          </div>
          <div className="flex justify-between relative px-6">
            <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4, 5].map((val) => (
              <div key={val} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => handleScaleChange(val)}
                  className={`w-10 h-10 rounded-full font-bold transition-all shadow-sm flex items-center justify-center ${
                    positionScale === val 
                      ? 'bg-primary text-white scale-110 ring-4 ring-indigo-200' 
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-indigo-50'
                  }`}
                >
                  {val}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm font-bold text-primary bg-indigo-100/50 py-2 rounded-lg">
            선택한 입장: {scaleLabels[positionScale]}
          </p>
        </div>

        {/* Text Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              1. 나는 왜 그렇게 생각하나요?
            </label>
            <textarea 
              rows="3"
              placeholder="자유롭게 적어보세요. 아직 잘 모르겠다면 어떤 점이 고민되는지 적어도 좋아요."
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              value={studentReason}
              onChange={(e) => updateSession({ studentReason: e.target.value })}
            ></textarea>
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              2. 토론에서 꼭 말하고 싶은 생각은 무엇인가요? (나의 주장)
            </label>
            <textarea 
              rows="2"
              placeholder="예: 휴대전화 사용 제한이 수업 집중도에 도움이 된다고 생각합니다."
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              value={studentClaim}
              onChange={(e) => updateSession({ studentClaim: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-between">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-100 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> 이전 단계
        </button>
        <button 
          onClick={onNext}
          disabled={!studentClaim.trim() && !studentReason.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          다음 단계 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PositionStep;
