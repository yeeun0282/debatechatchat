import React, { useEffect, useState } from 'react';
import { Users, ArrowRight, ArrowLeft, Loader2, Target, Scale, MessageCircle, AlertCircle } from 'lucide-react';
import { generatePerspectives } from '../services/aiService';

const PerspectiveStep = ({ session, updateSession, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  const { perspectives } = session;
  const reflection = perspectives?.studentReflection || {};

  useEffect(() => {
    const loadPerspectives = async () => {
      setLoading(true);
      const fetchedData = await generatePerspectives(session);
      setData(fetchedData);
      
      // Update session with new questions if they aren't already answered
      if (fetchedData.reflectionQuestions && !reflection.similarGroup) {
        // We just keep the questions in state, don't necessarily need to save them if they are static,
        // but they can be dynamic. Let's just use them for labels.
      }
      setLoading(false);
    };
    loadPerspectives();
  }, [session.issue, session.studentClaim]);

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
          <Users className="text-primary" />
          다양한 관점 살펴보기
        </h2>
        <p className="text-slate-500 mt-2">
          AI가 분석한 다양한 이해관계자의 입장을 살펴보고 시야를 넓혀보세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">다양한 이해관계자의 입장을 분석하는 중입니다...</p>
          </div>
        ) : data ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Card 1: 비슷한 관점 */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-lg">
                <Target className="w-6 h-6" /> 내 의견과 비슷한 관점
              </h3>
              <p className="text-emerald-900 leading-relaxed">
                네 의견은 주로 <strong className="bg-emerald-200 px-2 py-0.5 rounded text-emerald-950">{data.similarPerspective?.group}</strong>의 입장과 비슷해 보여. 
                이들은 <span className="underline decoration-emerald-400 font-bold">{data.similarPerspective?.importantValue}</span>을(를) 중요하게 생각하며, {data.similarPerspective?.explanation}
              </p>
            </div>

            {/* Card 2: 다른 이해관계자들 */}
            <div>
              <h3 className="font-bold text-xl text-slate-800 mb-4">다양한 이해관계자의 입장</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.stakeholders?.map((p, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-indigo-700 flex items-center gap-2 text-lg">
                        <span className="text-2xl">👤</span> {p.name}
                      </h4>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        핵심 가치: {p.importantValue}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p className="bg-slate-50 p-3 rounded-xl text-slate-800 font-bold border border-slate-100 leading-relaxed">
                        "{p.claim}"
                      </p>
                      <p className="text-slate-600 flex gap-2">
                        <MessageCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-slate-700">이유:</strong> {p.reason}</span>
                      </p>
                      <p className="text-rose-600 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-rose-700">우려:</strong> {p.concern}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 3: 다른 관점 */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-orange-800 mb-4 text-lg">내 입장과 다른 생각들</h3>
                <div className="space-y-4">
                  {data.differentViews?.map((view, i) => (
                    <div key={i} className="bg-white/60 p-4 rounded-xl border border-orange-100">
                      <p className="font-bold text-orange-900 mb-1">{view.viewpoint}</p>
                      <p className="text-sm text-orange-800">{view.whyTheyThinkSo}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: 충돌하는 가치 */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-lg">
                  <Scale className="w-6 h-6" /> 충돌하는 가치
                </h3>
                <div className="space-y-3">
                  {data.valueConflicts?.map((conflict, i) => {
                    const parts = conflict.values.split('vs');
                    return (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-3 bg-white py-3 px-4 rounded-xl border border-purple-100 shadow-sm">
                          <span className="font-black text-indigo-600 text-center flex-1">{parts[0]?.trim()}</span>
                          <span className="text-xs font-black text-slate-300 px-2 py-1 bg-slate-50 rounded-lg">VS</span>
                          <span className="font-black text-rose-600 text-center flex-1">{parts[1]?.trim() || "반대 가치"}</span>
                        </div>
                        <p className="text-xs text-purple-700 text-center px-4 leading-relaxed">{conflict.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <hr className="border-slate-200 my-8" />
            
            {/* Student Inputs */}
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-2">
                <Target className="text-primary w-6 h-6" /> 나의 생각 정리하기
              </h3>
              
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">
                  1. {data.reflectionQuestions?.[0] || "내 의견과 비슷하다고 느낀 이해관계자 또는 집단은 누구인가요?"}
                </label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={reflection.similarGroup || ""}
                  onChange={(e) => handleChange('similarGroup', e.target.value)}
                  placeholder="예: 학부모 및 교사 그룹과 비슷한 것 같습니다."
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">
                  2. {data.reflectionQuestions?.[1] || "처음에는 생각하지 못했던 관점은 무엇인가요?"}
                </label>
                <textarea 
                  rows="2"
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                  value={reflection.newPerspective || ""}
                  onChange={(e) => handleChange('newPerspective', e.target.value)}
                  placeholder="예: 자유권 침해 문제에 대해 미처 생각하지 못했습니다."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">
                  3. {data.reflectionQuestions?.[2] || "다른 관점 중 이해되거나 일부 받아들일 수 있는 부분은 무엇인가요?"}
                </label>
                <textarea 
                  rows="2"
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
                  value={reflection.acceptedView || ""}
                  onChange={(e) => handleChange('acceptedView', e.target.value)}
                  placeholder="예: 일률적인 제한이 반발을 부를 수 있다는 점은 동의합니다."
                ></textarea>
              </div>
            </div>
          </div>
        ) : null}
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
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          다음 단계 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PerspectiveStep;
