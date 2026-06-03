const STORAGE_KEY = 'jaengjeom_toktok_session';

export const defaultSession = {
  currentStep: 1,
  issue: "",
  issueBackground: "",
  positionScale: 3,
  studentClaim: "",
  studentReason: "",
  evidence: {
    type: "",
    sourceTitle: "",
    sourceUrl: "",
    sourceContent: "",
    sourceUsefulness: "",
    evidenceSentence: "",
    neededFutureSource: ""
  },
  perspectives: {
    similarPerspective: null,
    stakeholders: [],
    differentViews: [],
    valueConflicts: [],
    studentReflection: {
      similarGroup: "",
      newPerspective: "",
      acceptedView: "",
      improvedClaim: ""
    }
  },
  finalSpeech: {
    basicStatement: "",
    evidenceStatement: "",
    perspectiveStatement: "",
    finalStatement: "",
    studentEditedSpeech: ""
  },
  discussionScript: {
    issueIntro: "",
    positionStatement: "",
    reasonStatement: "",
    evidenceStatement: "",
    perspectiveStatement: "",
    improvedClaimStatement: "",
    finalStatement: "",
    additionalCheck: "",
    studentEditedScript: ""
  },
  completion: {
    isCompleted: false,
    completedAt: ""
  }
};

export const loadSession = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultSession,
        ...parsed,
        evidence: { ...defaultSession.evidence, ...(parsed.evidence || {}) },
        perspectives: { ...defaultSession.perspectives, ...(parsed.perspectives || {}) },
        finalSpeech: { ...defaultSession.finalSpeech, ...(parsed.finalSpeech || {}) },
        discussionScript: { ...defaultSession.discussionScript, ...(parsed.discussionScript || {}) },
        completion: { ...defaultSession.completion, ...(parsed.completion || {}) },
      };
    }
  } catch (e) {
    console.error("Failed to load session", e);
  }
  return defaultSession;
};

export const saveSession = (session) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Failed to save session", e);
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear session", e);
  }
};
