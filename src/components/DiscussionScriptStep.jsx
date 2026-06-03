import React, { useEffect, useState } from 'react';
import { FileText, Printer, ArrowLeft, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { generateDiscussionScript } from '../services/aiService';

const DiscussionScriptStep = ({ session, updateSession, onPrev, onComplete }) => {
  const { issue, discussionScript } = session;
  const [loading, setLoading] = useState(false);
  const [scriptData, setScriptData] = useState(null);

  useEffect(() => {
    // Generate script template if empty
    if (!discussionScript?.studentEditedScript) {
      handleGenerateScript();
    } else {
      fetchDataSilently();
    }
  }, []);

  const fetchDataSilently = async () => {
    setLoading(true);
    const result = await generateDiscussionScript(session);
    setScriptData(result);
    setLoading(false);
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    const result = await generateDiscussionScript(session);
    setScriptData(result);
    
    updateSession({
      discussionScript: {
        ...result,
        studentEditedScript: result.fullScript
      }
    });
    setLoading(false);
  };

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
            AI가 도와준 템플릿을 바탕으로 토론에서 바로 참고할 수 있는 최종 발언 자료를 완성하세요.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible">
        {loading && !scriptData ? (
           <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
             <Loader2 className="w-12 h-12 animate-spin mb-4" />
             <p className="font-medium">AI가 전체 스크립트를 작성하고 있습니다...</p>
           </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8 md:p-12 print:shadow-none print:border-none print:p-4 printable-document">
            <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">나의 토론 발언 스크립트</h1>
                <div className="text-slate-600 font-medium">선택한 쟁점: <span className="font-bold text-indigo-700">{issue}</span></div>
              </div>
              <div className="text-right text-slate-500 text-sm font-medium">
                <div>쟁점톡톡</div>
                <div>작성일: {today}</div>
              </div>
            </div>

            <div className="space-y-8">
              
              {scriptData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">쟁점 소개</h3>
                    <p className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{scriptData.issueIntro}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">나의 입장</h3>
                    <p className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{scriptData.positionStatement}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">입장의 이유</h3>
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{scriptData.reasonStatement}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">근거 제시</h3>
                    <p className="text-sm font-medium text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-100">{scriptData.evidenceStatement}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">다양한 관점 고려</h3>
                    <p className="text-sm font-medium text-orange-900 bg-orange-50 p-3 rounded-lg border border-orange-100">{scriptData.perspectiveStatement}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">내 주장 보완</h3>
                    <p className="text-sm font-bold text-indigo-900 bg-indigo-50 p-3 rounded-lg border border-indigo-100">{scriptData.improvedClaimStatement}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">최종 발언</h3>
                    <p className="text-sm font-bold text-indigo-900 bg-indigo-50 p-3 rounded-lg border border-indigo-100">{scriptData.finalStatement}</p>
                  </div>
                  {scriptData.additionalCheck && (
                    <div className="md:col-span-2 print:hidden">
                      <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">추가 확인이 필요한 부분</h3>
                      <p className="text-sm font-bold text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 flex items-center gap-2">
                        {scriptData.additionalCheck}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="print:hidden mt-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    내가 직접 고쳐쓰기 (최종 스크립트 본문)
                  </h3>
                  <button 
                    onClick={handleGenerateScript}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    다시 생성
                  </button>
                </div>
                <textarea 
                  className="w-full p-6 text-base leading-loose text-slate-800 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none resize-none min-h-[400px]"
                  value={discussionScript?.studentEditedScript || ""}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Print-only View for the Script */}
              <div className="hidden print:block mt-8 pt-8 border-t border-slate-300">
                <h3 className="font-bold text-lg text-slate-800 mb-4 pb-2">최종 토론 스크립트</h3>
                <div className="text-base leading-loose text-slate-800 whitespace-pre-wrap">
                  {discussionScript?.studentEditedScript}
                </div>
              </div>
            </div>
          </div>
        )}
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
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-sm disabled:opacity-50"
          >
            <Printer className="w-5 h-5" /> PDF로 저장하기
          </button>
          
          <button 
            onClick={onComplete}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" /> 토론 준비 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionScriptStep;
