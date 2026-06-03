import React, { useEffect, useState } from 'react';
import { Mic, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import CopyButton from './CopyButton';
import { generateFinalSpeech } from '../services/aiService';

const SpeechCardStep = ({ session, updateSession, onPrev, onNext, onReset }) => {
  const { issue, studentClaim, studentReason, evidence, perspectives } = session;
  const reflection = perspectives?.studentReflection || {};
  
  const [speechData, setSpeechData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speech, setSpeech] = useState(session.finalSpeech?.studentEditedSpeech || "");

  // Auto-generate initial speech draft if empty
  useEffect(() => {
    if (!session.finalSpeech?.studentEditedSpeech) {
      handleGenerateDraft();
    } else {
      // If we already have the edited speech, we can try to fetch the structural data silently 
      // or just render the text area. Let's fetch structural data so the top part still shows.
      fetchDataSilently();
    }
  }, []);

  const fetchDataSilently = async () => {
    setLoading(true);
    const result = await generateFinalSpeech(session);
    setSpeechData(result);
    setLoading(false);
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    const result = await generateFinalSpeech(session);
    setSpeechData(result);
    
    // Combine the JSON into a single string for the text area
    const draft = [
      result.basicStatement,
      result.evidenceStatement,
      result.perspectiveStatement,
      result.finalStatement
    ].filter(Boolean).join('\n\n');
    
    setSpeech(draft);
    updateSession({
      finalSpeech: {
        ...session.finalSpeech,
        studentEditedSpeech: draft
      }
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSpeech(val);
    updateSession({
      finalSpeech: {
        ...session.finalSpeech,
        studentEditedSpeech: val
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-indigo-600 text-white flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Mic className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2 relative z-10">
          <Mic className="text-indigo-200" />
          나의 토론 발언 카드 완성하기
        </h2>
        <p className="text-indigo-100 mt-2 relative z-10">
          지금까지 정리한 내용을 바탕으로 실제 토론에서 말할 수 있는 발언 카드를 완성했습니다.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 space-y-6">
        
        {loading && !speechData ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">AI가 나의 의견을 바탕으로 발언문 초안을 작성하고 있습니다...</p>
          </div>
        ) : (
          <>
            {/* AI Generated Parts */}
            {speechData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">1. 기본 발언문</span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{speechData.basicStatement}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">2. 근거 포함 발언문</span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{speechData.evidenceStatement}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">3. 다양한 관점 반영</span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{speechData.perspectiveStatement}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">4. 최종 발언문</span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{speechData.finalStatement}</p>
                </div>
              </div>
            )}

            {/* Speech Editor */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-100 flex justify-between items-center">
                <span className="font-bold text-indigo-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  토론에서 말해볼 문장 (내가 직접 고쳐쓰기)
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleGenerateDraft}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    다시 생성
                  </button>
                  <CopyButton textToCopy={speech} label="복사하기" />
                </div>
              </div>
              <textarea
                className="w-full p-6 text-base leading-relaxed text-slate-800 resize-none outline-none focus:bg-indigo-50/20 transition-colors min-h-[300px]"
                value={speech}
                onChange={handleChange}
                placeholder="이곳에 발언문이 작성됩니다..."
              ></textarea>
            </div>
          </>
        )}
      </div>

      <div className="p-4 md:p-6 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-3 justify-between flex-shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={onPrev}
            className="px-5 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            다시 수정하기
          </button>
          <button 
            onClick={onReset}
            className="px-5 py-3 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition-all shadow-sm hidden md:block"
          >
            처음부터 다시 하기
          </button>
        </div>
        <button 
          onClick={onNext}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow"
        >
          토론 스크립트 보기 <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SpeechCardStep;
