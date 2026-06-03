import React, { useEffect, useState } from 'react';
import { Mic, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import CopyButton from './CopyButton';

const SpeechCardStep = ({ session, updateSession, onPrev, onNext, onReset }) => {
  const { issue, studentClaim, studentReason, evidence, perspectives } = session;
  const reflection = perspectives?.studentReflection || {};
  
  const [speech, setSpeech] = useState(session.finalSpeech?.studentEditedSpeech || "");

  // Auto-generate initial speech draft if empty
  useEffect(() => {
    if (!session.finalSpeech?.studentEditedSpeech) {
      generateDraft();
    }
  }, []);

  const generateDraft = () => {
    let draft = `저는 '${issue}' 쟁점에 대해 '${studentClaim}'라고 생각합니다.\n그 이유는 ${studentReason} 때문입니다.\n\n`;
    
    if (evidence?.evidenceSentence) {
      draft += `이를 뒷받침하는 근거로는 ${evidence.evidenceSentence}을 들 수 있습니다.\n`;
      if (evidence?.sourceUsefulness) {
        draft += `이 자료는 ${evidence.sourceUsefulness}라는 점에서 제 주장에 도움이 됩니다.\n\n`;
      } else {
        draft += `\n`;
      }
    }

    if (reflection.similarGroup || reflection.acceptedView) {
      draft += `이 문제에서 ${reflection.similarGroup || '어떤 분들'}의 입장은 제 생각과 비슷합니다.\n하지만 ${reflection.acceptedView || '반대측'}의 입장에서는 그러한 점을 걱정할 수 있습니다.\n\n`;
    }

    draft += `이 관점을 고려할 때, 저는 ${reflection.improvedClaim || studentClaim}라는 점도 함께 생각해야 한다고 봅니다.\n따라서 저는 최종적으로 '${reflection.coreClaimToKeep || studentClaim}'라고 생각합니다.`;
    
    setSpeech(draft);
    updateSession({
      finalSpeech: {
        ...session.finalSpeech,
        studentEditedSpeech: draft
      }
    });
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

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 space-y-6">
        
        {/* Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">나의 토론 준비 요약</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">1. 오늘의 쟁점</strong> <span className="text-slate-600">{issue}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">2. 초기 입장</strong> <span className="text-slate-600">{studentClaim}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">3. 입장의 이유</strong> <span className="text-slate-600">{studentReason}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">4. 준비한 근거</strong> <span className="text-slate-600">{evidence?.evidenceSentence}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">5. 비슷한 관점</strong> <span className="text-slate-600">{reflection.similarGroup}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">6. 고려한 관점</strong> <span className="text-slate-600">{reflection.newlyConsidered || reflection.acceptedView}</span></li>
            <li className="flex gap-2"><strong className="w-24 flex-shrink-0 text-slate-700">7. 보완된 주장</strong> <span className="text-slate-600">{reflection.improvedClaim}</span></li>
          </ul>
        </div>

        {/* Speech Editor */}
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
            <span className="font-bold text-indigo-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              8. 토론에서 말해볼 문장 (내가 직접 고쳐쓰기)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={generateDraft}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors"
                title="초기 템플릿으로 다시 생성하기"
              >
                <RefreshCw className="w-3 h-3" /> 다시 생성
              </button>
              <CopyButton textToCopy={speech} label="복사하기" />
            </div>
          </div>
          <textarea
            className="w-full p-6 text-base leading-relaxed text-slate-800 resize-none outline-none focus:bg-indigo-50/20 transition-colors min-h-[250px]"
            value={speech}
            onChange={handleChange}
            placeholder="이곳에 발언문이 작성됩니다..."
          ></textarea>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-3 justify-between flex-shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={onPrev}
            className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            다시 수정하기
          </button>
          <button 
            onClick={onReset}
            className="px-5 py-2.5 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition-all shadow-sm hidden md:block"
          >
            처음부터 다시 하기
          </button>
        </div>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
        >
          토론 스크립트 보기 <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SpeechCardStep;
