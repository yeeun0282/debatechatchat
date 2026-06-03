import React, { useEffect, useState } from 'react';
import { Users, ArrowRight, ArrowLeft, Loader2, Target, Scale } from 'lucide-react';
import { fetchPerspectives } from '../services/aiService';
import { exampleIssues } from '../data/exampleIssues';

const PerspectiveStep = ({ session, updateSession, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  const { perspectives } = session;
  const reflection = perspectives?.studentReflection || {};

  useEffect(() => {
    const loadPerspectives = async () => {
      setLoading(true);
      const issueObj = exampleIssues.find(i => i.title === session.issue);
      const issueId = issueObj ? issueObj.id : "custom";
      const fetchedData = await fetchPerspectives(issueId, session.studentClaim);
      setData(fetchedData);
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
          나와 다른 입장에 있는 사람들은 어떤 생각을 할지 살펴보고 시야를 넓혀보세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">다양한 이해관계자의 입장을 분석하는 중입니다...</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Card 1: 비슷한 관점 */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" /> 내 의견과 비슷한 관점
              </h3>
              <p className="text-emerald-900 text-sm">
                네 의견은 이 쟁점에서 <strong className="bg-emerald-200 px-1 rounded">{data.similarGroup}</strong>의 입장과 비슷해 보여. 이들은 주로 이 쟁점에서 중요한 가치를 보호하려 해.
              </p>
            </div>

            {/* Card 2: 다른 이해관계자들 */}
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-4">다른 이해관계자들의 입장</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.stakeholders.map((p, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-indigo-700 flex items-center gap-2">
                        <span className="text-xl">👤</span> {p.role}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        중요 가치: {p.value}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p className="bg-indigo-50 p-3 rounded-lg text-slate-800 font-medium">"{p.view}"</p>
                      <p className="text-slate-600"><strong className="text-slate-700">이유:</strong> {p.reason}</p>
                      <p className="text-slate-600"><strong className="text-slate-700">걱정하는 점:</strong> {p.concern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 3: 다른 관점 */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="font-bold text-orange-800 mb-3">내 입장과 다른 주장</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-orange-900">
                  {data.opposingViews.map((view, i) => (
                    <li key={i}>{view}</li>
                  ))}
                </ul>
              </div>

              {/* Card 4: 충돌하는 가치 */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5" /> 충돌하는 가치
                </h3>
                <div className="space-y-2">
                  {data.valueConflicts.map((conflict, i) => {
                    const [v1, v2] = conflict.split('vs');
                    return (
                      <div key={i} className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg border border-purple-100">
                        <span className="font-bold text-purple-700">{v1?.trim()}</span>
                        <span className="text-xs text-slate-400 font-bold">VS</span>
                        <span className="font-bold text-rose-600">{v2?.trim()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <hr className="border-slate-200" />
            
            {/* Student Inputs */}
            <div className="space-y-6">
              <h3 className="font-bold text-xl text-slate-800">나의 생각 정리하기</h3>
              
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">1. 내 의견과 비슷하다고 느낀 이해관계자 또는 집단은 누구인가요?</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"
                  value={reflection.similarGroup || ""}
                  onChange={(e) => handleChange('similarGroup', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">2. 처음에는 생각하지 못했던 관점은 무엇인가요?</label>
                <textarea 
                  rows="2"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={reflection.newPerspective || ""}
                  onChange={(e) => handleChange('newPerspective', e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">3. 다른 관점 중 이해되거나 일부 받아들일 수 있는 부분은 무엇인가요?</label>
                <textarea 
                  rows="2"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={reflection.acceptedView || ""}
                  onChange={(e) => handleChange('acceptedView', e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">4. 이 관점을 고려했을 때 내 주장을 어떻게 보완할 수 있을까요?</label>
                <textarea 
                  rows="2"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={reflection.improvedClaim || ""}
                  onChange={(e) => handleChange('improvedClaim', e.target.value)}
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
