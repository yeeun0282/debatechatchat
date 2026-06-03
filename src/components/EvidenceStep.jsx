import React, { useState } from 'react';
import { Search, ArrowRight, ArrowLeft, Link as LinkIcon, FileText, CheckCircle2 } from 'lucide-react';

const evidenceTypes = [
  { id: "실제 사례", desc: "비슷한 일이 있었던 사례나 사건", prefix: "예를 들어…" },
  { id: "통계나 수치", desc: "얼마나 많고 적은지 보여주는 자료", prefix: "자료에 따르면…" },
  { id: "법이나 제도", desc: "현재 법, 학교 규칙, 정책 내용", prefix: "현재 제도는…" },
  { id: "전문가 의견", desc: "연구자, 교사, 의사 등 전문가 의견", prefix: "전문가들은…" },
  { id: "사람들의 경험", desc: "학생, 당사자 등의 실제 경험", prefix: "이 문제를 겪는 사람들은…" },
  { id: "중요한 가치", desc: "안전, 자유, 평등, 인권, 책임 등", prefix: "저는 이 문제에서 ___가 중요하다고 생각합니다." },
];

const EvidenceStep = ({ session, updateSession, onNext, onPrev }) => {
  const { evidence } = session;
  const [hasData, setHasData] = useState(evidence.sourceTitle ? true : false);

  // types is now an array for multi-select
  const selectedTypes = Array.isArray(evidence.types)
    ? evidence.types
    : evidence.type
      ? [evidence.type]
      : [];

  const toggleType = (typeId) => {
    const next = selectedTypes.includes(typeId)
      ? selectedTypes.filter((t) => t !== typeId)
      : [...selectedTypes, typeId];
    updateSession({ evidence: { ...evidence, types: next, type: next[0] || "" } });
  };

  const handleChange = (field, value) => {
    updateSession({ evidence: { ...evidence, [field]: value } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Search className="text-primary" />
          내 주장을 뒷받침할 근거 준비하기
        </h2>
        <p className="text-slate-500 mt-2">
          내 주장을 단단하게 만들어 줄 자료나 근거를 기록해 보세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        <div>
          <label className="block font-bold text-slate-800 mb-1 text-lg">어떤 유형의 근거를 사용할까요?</label>
          <p className="text-xs text-slate-400 mb-4">여러 개 선택 가능합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {evidenceTypes.map((type) => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col h-full ${
                    isSelected
                      ? 'border-primary bg-indigo-50 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{type.id}</h3>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{type.desc}</p>
                  <p className="text-xs font-medium text-indigo-600 mt-auto bg-white p-2 rounded border border-indigo-100">
                    말할 때: "{type.prefix}"
                  </p>
                </div>
              );
            })}
          </div>
          {selectedTypes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTypes.map((t) => (
                <span key={t} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full">
                  ✓ {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="hasData"
                className="text-primary focus:ring-primary w-4 h-4"
                checked={hasData} 
                onChange={() => setHasData(true)} 
              />
              <span className="font-bold text-slate-800">찾은 자료가 있어요</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="hasData"
                className="text-primary focus:ring-primary w-4 h-4"
                checked={!hasData} 
                onChange={() => setHasData(false)} 
              />
              <span className="font-bold text-slate-800">아직 자료를 못 찾았어요</span>
            </label>
          </div>

          {hasData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 자료 제목 (출처)
                  </label>
                  <input 
                    type="text" 
                    placeholder="예: 학교 휴대전화 사용 제한 관련 기사"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={evidence.sourceTitle}
                    onChange={(e) => handleChange('sourceTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> URL 링크 (선택)
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={evidence.sourceUrl}
                    onChange={(e) => handleChange('sourceUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">이 자료에서 확인한 내용 한 줄</label>
                <input 
                  type="text"
                  placeholder="예: 휴대전화 사용 제한 후 수업 집중도가 높아졌다는 사례가 있었다."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={evidence.sourceContent}
                  onChange={(e) => handleChange('sourceContent', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">이 자료가 내 주장에 도움이 되는 이유</label>
                <input 
                  type="text"
                  placeholder="예: 학교의 제한이 학습 환경 개선에 도움이 될 수 있다는 증거가 된다."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={evidence.sourceUsefulness}
                  onChange={(e) => handleChange('sourceUsefulness', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-900 text-sm mb-2 mt-4">최종적으로 토론에서 말할 근거 한 문장</label>
                <textarea 
                  rows="2"
                  placeholder="예: 예를 들어, 휴대전화 사용 제한이 수업 집중도 향상에 도움이 되었다는 실제 사례가 있습니다."
                  className="w-full p-3 rounded-lg border-2 border-indigo-300 bg-indigo-50 focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={evidence.evidenceSentence}
                  onChange={(e) => handleChange('evidenceSentence', e.target.value)}
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">앞으로 찾아보고 싶은 자료</label>
                <input 
                  type="text"
                  placeholder="예: 스마트폰 사용이 뇌 발달에 미치는 영향을 다룬 통계 자료"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"
                  value={evidence.neededFutureSource}
                  onChange={(e) => handleChange('neededFutureSource', e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-sm mb-2">내 주장을 뒷받침하려면 어떤 자료가 필요할까?</label>
                <textarea 
                  rows="3"
                  placeholder="예: 반대하는 사람들을 설득하려면 명확한 수치가 있는 통계가 필요할 것 같다."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none"
                  value={evidence.evidenceSentence}
                  onChange={(e) => handleChange('evidenceSentence', e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
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
          disabled={!evidence.evidenceSentence?.trim() && !evidence.neededFutureSource?.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          다음 단계 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default EvidenceStep;
