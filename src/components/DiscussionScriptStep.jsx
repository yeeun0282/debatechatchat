import React, { useEffect } from 'react';
import { FileText, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DiscussionScriptStep = ({ session, updateSession, onPrev, onComplete }) => {
  const { issue, studentClaim, studentReason, evidence, perspectives } = session;
  const discussionScript = session.discussionScript || {};
  const reflection = perspectives?.studentReflection || {};

  useEffect(() => {
    // Generate script template if empty
    if (!discussionScript?.studentEditedScript) {
      const scriptParts = {
        issueIntro: `오늘 제가 이야기할 쟁점은 '${issue}' 입니다.`,
        positionStatement: `저는 이 쟁점에 대해 '${studentClaim}' 라고 생각합니다.`,
        reasonStatement: studentReason ? `그 이유는 '${studentReason}' 때문입니다.` : "",
        evidenceStatement: evidence?.evidenceSentence ? `이를 뒷받침하는 근거로는 '${evidence.evidenceSentence}'을(를) 들 수 있습니다.` : "",
        perspectiveStatement: (reflection.similarGroup || reflection.acceptedView) 
          ? `이 문제에서 '${reflection.similarGroup || '어떤 분들'}'의 입장은 제 생각과 비슷합니다. 하지만 '${reflection.acceptedView || '다른 관점'}'의 입장에서는 그러한 점을 걱정할 수 있습니다.` 
          : "",
        improvedClaimStatement: `이 관점을 고려할 때, 저는 '${reflection.improvedClaim || '이러한 부분'}'라는 점도 함께 생각해야 한다고 봅니다.`,
        finalStatement: `따라서 저는 최종적으로 '${reflection.coreClaimToKeep || studentClaim}' 라고 생각합니다.`,
        additionalCheck: evidence?.neededFutureSource ? `토론 전 더 확인하면 좋은 자료는 '${evidence.neededFutureSource}' 입니다.` : "",
      };

      const fullScript = Object.values(scriptParts).filter(Boolean).join('\n\n');
      
      updateSession({
        discussionScript: {
          ...scriptParts,
          studentEditedScript: fullScript
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    updateSession({
      discussionScript: {
        ...discussionScript,
        studentEditedScript: e.target.value
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Get current date for the PDF document
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">나의 토론 스크립트</h2>
          <p className="text-slate-500 mt-1 text-sm">
            아래 스크립트는 토론에서 바로 참고할 수 있도록 정리한 나의 발언 준비 자료입니다.<br/>
            그대로 읽기보다, 토론 상황에 맞게 자연스럽게 말해보세요.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible">
        {/* Printable Document Area */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8 md:p-12 print:shadow-none print:border-none print:p-4 printable-document">
          <div className="border-b-4 border-indigo-600 pb-6 mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">나의 토론 발언 스크립트</h1>
            <div className="flex justify-between items-end text-slate-600 font-medium">
              <span>쟁점톡톡</span>
              <span>작성일: {today}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 print:bg-white print:border-slate-300">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">내가 선택한 쟁점</h3>
              <p className="text-lg font-bold text-slate-800">{issue}</p>
            </div>

            <div className="print:hidden mt-8">
              <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                내가 직접 고쳐쓰기 (최종본)
              </h3>
              <textarea 
                className="w-full p-6 text-base leading-loose text-slate-800 rounded-xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none resize-none min-h-[400px]"
                value={discussionScript.studentEditedScript || ""}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Print-only View for the Script */}
            <div className="hidden print:block mt-8">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-200 pb-2">최종 토론 스크립트</h3>
              <div className="text-base leading-loose text-slate-800 whitespace-pre-wrap">
                {discussionScript.studentEditedScript}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-slate-200 flex flex-wrap gap-4 justify-between print:hidden">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> 발언 카드로 돌아가기
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-sm"
          >
            <Printer className="w-5 h-5" /> PDF로 저장하기
          </button>
          
          <button 
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow"
          >
            <CheckCircle2 className="w-5 h-5" /> 토론 준비 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionScriptStep;
