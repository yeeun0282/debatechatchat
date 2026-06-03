import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import IssueStep from './components/IssueStep';
import PositionStep from './components/PositionStep';
import EvidenceStep from './components/EvidenceStep';
import PerspectiveStep from './components/PerspectiveStep';
import RevisionStep from './components/RevisionStep';
import SpeechCardStep from './components/SpeechCardStep';
import DiscussionScriptStep from './components/DiscussionScriptStep';
import CompletionScreen from './components/CompletionScreen';
import { loadSession, saveSession, defaultSession } from './utils/sessionStorage';
import { getRandomHint } from './data/mockResponses';

function App() {
  const [session, setSession] = useState(defaultSession);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hintText, setHintText] = useState("");

  // Load session on mount
  useEffect(() => {
    const saved = loadSession();
    setSession(saved);
    setIsLoaded(true);
    setHintText(getRandomHint(saved.currentStep));
  }, []);

  // Save session when it changes
  useEffect(() => {
    if (isLoaded) {
      saveSession(session);
    }
  }, [session, isLoaded]);

  // Update hint when step changes
  useEffect(() => {
    if (isLoaded && session.currentStep <= 8) {
      setHintText(getRandomHint(session.currentStep));
    }
  }, [session.currentStep, isLoaded]);

  const updateSession = (data) => {
    setSession((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setSession((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 8)
    }));
  };

  const handlePrev = () => {
    setSession((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };

  const handleReset = () => {
    if (window.confirm("지금까지 작성한 모든 내용이 초기화됩니다. 계속하시겠습니까?")) {
      setSession(defaultSession);
    }
  };

  const handleComplete = () => {
    updateSession({
      completion: {
        isCompleted: true,
        completedAt: new Date().toISOString()
      },
      currentStep: 8
    });
  };

  const handleViewScript = () => {
    updateSession({ currentStep: 7 });
  };

  if (!isLoaded) return null;

  const renderStep = () => {
    switch (session.currentStep) {
      case 1:
        return <IssueStep session={session} updateSession={updateSession} onNext={handleNext} />;
      case 2:
        return <PositionStep session={session} updateSession={updateSession} onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <EvidenceStep session={session} updateSession={updateSession} onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <PerspectiveStep session={session} updateSession={updateSession} onNext={handleNext} onPrev={handlePrev} />;
      case 5:
        return <RevisionStep session={session} updateSession={updateSession} onNext={handleNext} onPrev={handlePrev} />;
      case 6:
        return <SpeechCardStep session={session} updateSession={updateSession} onPrev={handlePrev} onNext={handleNext} onReset={handleReset} />;
      case 7:
        return <DiscussionScriptStep session={session} updateSession={updateSession} onPrev={handlePrev} onComplete={handleComplete} />;
      case 8:
        return <CompletionScreen session={session} updateSession={updateSession} onViewScript={handleViewScript} onReset={handleReset} />;
      default:
        return <IssueStep session={session} updateSession={updateSession} onNext={handleNext} />;
    }
  };

  return (
    <Layout currentStep={session.currentStep} hintText={hintText}>
      {renderStep()}
    </Layout>
  );
}

export default App;
