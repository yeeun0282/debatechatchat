import React, { useState } from 'react';
import { exampleIssues } from '../data/exampleIssues';
import { Compass, ArrowRight, Lightbulb } from 'lucide-react';

const IssueStep = ({ session, updateSession, onNext }) => {
  const [selectedIssueId, setSelectedIssueId] = useState(session.issue ? "custom" : "");
  const [customIssueTitle, setCustomIssueTitle] = useState(session.issue || "");
  const [customIssueBg, setCustomIssueBg] = useState(session.issueBackground || "");

  const handleSelect = (issue) => {
    setSelectedIssueId(issue.id);
    updateSession({
      issue: issue.title,
      issueBackground: issue.background,
    });
  };

  const handleCustomSubmit = () => {
    if (customIssueTitle.trim()) {
      updateSession({
        issue: customIssueTitle,
        issueBackground: customIssueBg,
      });
      onNext();
    }
  };

  const handleNext = () => {
    if (selectedIssueId === "custom") {
      handleCustomSubmit();
    } else if (session.issue) {
      onNext();
    }
  };

  // Pre-select if previously selected
  React.useEffect(() => {
    const found = exampleIssues.find(i => i.title === session.issue);
    if (found) {
      setSelectedIssueId(found.id);
    } else if (session.issue) {
      setSelectedIssueId("custom");
      setCustomIssueTitle(session.issue);
      setCustomIssueBg(session.issueBackground);
    }
  }, []);

  const isNextDisabled = selectedIssueId === "custom" ? !customIssueTitle.trim() : !selectedIssueId;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Compass className="text-primary" />
          오늘의 쟁점 확인하기
        </h2>
        <p className="text-slate-500 mt-2">
          토론할 쟁점을 선택하거나 직접 입력해 보세요.
        </p>
      </div>

      <div className="p-6 md:p-8 flex-1 space-y-4">
        {exampleIssues.map((issue) => (
          <label 
            key={issue.id}
            className={`block p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedIssueId === issue.id 
                ? 'border-primary bg-indigo-50/30 shadow-sm' 
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <input 
                type="radio" 
                name="issue" 
                className="mt-1.5 w-4 h-4 text-primary focus:ring-primary"
                checked={selectedIssueId === issue.id}
                onChange={() => handleSelect(issue)}
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800">{issue.title}</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{issue.background}</p>
                {selectedIssueId === issue.id && (
                  <div className="mt-4 pt-4 border-t border-indigo-100 space-y-3 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">왜 의견이 갈릴까?</span>
                      <p className="text-sm text-slate-700">{issue.reasonOfConflict}</p>
                    </div>
                    <div className="flex items-start gap-2 text-primary bg-indigo-50 p-3 rounded-md">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-bold">{issue.coreQuestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </label>
        ))}

        <label 
          className={`block p-5 rounded-xl border-2 cursor-pointer transition-all ${
            selectedIssueId === "custom" 
              ? 'border-primary bg-indigo-50/30 shadow-sm' 
              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <input 
              type="radio" 
              name="issue" 
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
              checked={selectedIssueId === "custom"}
              onChange={() => {
                setSelectedIssueId("custom");
              }}
            />
            <div className="w-full">
              <h3 className="font-bold text-lg text-slate-800 mb-2">직접 입력하기</h3>
              {selectedIssueId === "custom" && (
                <div className="space-y-3 mt-3">
                  <input 
                    type="text" 
                    placeholder="쟁점 제목 (예: 교내 스마트폰 사용 금지, 찬성인가 반대인가?)"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={customIssueTitle}
                    onChange={(e) => {
                      setCustomIssueTitle(e.target.value);
                      updateSession({ issue: e.target.value, issueBackground: customIssueBg });
                    }}
                  />
                  <textarea 
                    placeholder="한 줄 배경 설명 (선택사항)"
                    rows="3"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    value={customIssueBg}
                    onChange={(e) => {
                      setCustomIssueBg(e.target.value);
                      updateSession({ issue: customIssueTitle, issueBackground: e.target.value });
                    }}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </label>
      </div>

      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          다음 단계 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default IssueStep;
