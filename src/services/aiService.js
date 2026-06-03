import { mockPerspectives, mockFinalSpeech, mockDiscussionScript } from '../data/mockResponses';

/**
 * 프론트엔드 환경에서 OpenAI API를 직접 호출합니다.
 * 실제 서비스 배포 시에는 반드시 보안을 위해 백엔드 서버(Proxy)나 
 * Serverless Functions(예: Next.js API Routes)를 거쳐야 합니다.
 */

const callOpenAI = async (messages) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("No API key found");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};

export const generatePerspectives = async (session) => {
  try {
    const prompt = `너는 고등학생의 사회과 쟁점토론 준비를 돕는 AI 스캐폴딩 도우미다.

학생이 선택한 쟁점:
${session.issue || "선택된 쟁점 없음"}

쟁점 배경:
${session.issueBackground || "배경 설명 없음"}

학생의 현재 입장:
${session.positionScale} / 5점

학생이 쓴 주장:
${session.studentClaim || "입력 안 됨"}

학생이 쓴 이유:
${session.studentReason || "입력 안 됨"}

학생이 준비한 근거 유형:
${session.evidence?.type || "입력 안 됨"}

학생이 준비한 근거:
${session.evidence?.evidenceSentence || session.evidence?.sourceContent || "입력 안 됨"}

위 내용을 바탕으로, 학생이 쟁점을 다양한 관점에서 볼 수 있도록 도와줘.

조건:
1. 고등학생이 이해할 수 있는 쉬운 말로 쓴다.
2. 특정 입장을 정답처럼 제시하지 않는다.
3. 학생의 주장을 비난하거나 평가하지 않는다.
4. 학생의 입장과 비슷한 이해관계자 또는 집단을 먼저 알려준다.
5. 쟁점과 관련된 다른 이해관계자 3~5개의 입장을 균형 있게 제시한다.
6. 학생의 입장과 다른 관점도 1~2개 제시한다.
7. 이 쟁점에서 충돌하는 가치 1~2쌍을 제시한다.
8. 없는 통계, 실제 기사 제목, 구체적 수치를 지어내지 않는다.
9. 사실 확인이 필요한 내용은 "확인 필요"라고 표시한다.
10. 마지막에는 학생이 생각해볼 질문 2~3개를 제시한다.
11. 말투는 친근하지만 수업 도구답게 차분하게 쓴다.

출력 형식은 반드시 아래 형태의 JSON 객체로 한다:
{
  "similarPerspective": {
    "group": "",
    "explanation": "",
    "importantValue": ""
  },
  "stakeholders": [
    {
      "name": "",
      "importantValue": "",
      "claim": "",
      "reason": "",
      "concern": ""
    }
  ],
  "differentViews": [
    {
      "viewpoint": "",
      "whyTheyThinkSo": ""
    }
  ],
  "valueConflicts": [
    {
      "values": "",
      "explanation": ""
    }
  ],
  "reflectionQuestions": []
}`;

    const messages = [
      { role: "system", content: "You are a helpful AI assistant that outputs only valid JSON." },
      { role: "user", content: prompt }
    ];

    const result = await callOpenAI(messages);
    return result;
  } catch (error) {
    console.error("AI Perspective Generation Failed, using fallback mock:", error);
    return mockPerspectives;
  }
};

export const generateFinalSpeech = async (session) => {
  try {
    const reflection = session.perspectives?.studentReflection || {};
    const prompt = `너는 고등학생의 사회과 쟁점토론 준비를 돕는 AI 글쓰기 도우미다.

학생이 선택한 쟁점:
${session.issue || "선택된 쟁점 없음"}

학생의 초기 입장:
${session.studentClaim || "입력 안 됨"}

학생이 쓴 이유:
${session.studentReason || "입력 안 됨"}

학생이 준비한 근거:
${session.evidence?.evidenceSentence || "입력 안 됨"}

학생의 의견과 비슷한 관점:
${reflection.similarGroup || "입력 안 됨"}

학생이 새롭게 고려한 관점:
${reflection.newPerspective || "입력 안 됨"}

학생이 일부 받아들인 다른 관점:
${reflection.acceptedView || "입력 안 됨"}

학생이 보완한 주장:
${reflection.improvedClaim || "입력 안 됨"}

위 내용을 바탕으로, 학생이 토론에서 말할 수 있는 발언문 초안을 만들어줘.

조건:
1. 학생의 생각을 과도하게 바꾸지 않는다.
2. 학생이 쓴 내용을 바탕으로 자연스럽게 정리한다.
3. 고등학생이 실제 토론에서 말할 수 있는 문장으로 쓴다.
4. 너무 길게 쓰지 않는다.
5. 특정 입장을 정답처럼 만들지 않는다.
6. 근거와 다양한 관점이 함께 드러나도록 한다.
7. 학생이 직접 수정할 수 있도록 완성본은 예시로 제공한다.
8. 없는 통계나 기사 제목, URL을 만들지 않는다.
9. 사실 확인이 필요한 내용은 "확인 필요"라고 표시한다.

출력 형식은 반드시 아래 형태의 JSON 객체로 한다:
{
  "basicStatement": "저는 ______에 대해 ______라고 생각합니다. 그 이유는 ______ 때문입니다.",
  "evidenceStatement": "이를 뒷받침하는 근거로는 ______을 들 수 있습니다.",
  "perspectiveStatement": "이 문제에서 ______의 입장은 제 생각과 비슷합니다. 하지만 ______의 입장에서는 ______라는 점을 걱정할 수 있습니다.",
  "finalStatement": "이 관점을 고려할 때, 저는 ______라는 점도 함께 생각해야 한다고 봅니다. 따라서 저는 ______라고 생각합니다."
}`;

    const messages = [
      { role: "system", content: "You are a helpful AI assistant that outputs only valid JSON." },
      { role: "user", content: prompt }
    ];

    const result = await callOpenAI(messages);
    return result;
  } catch (error) {
    console.error("AI Speech Generation Failed, using fallback mock:", error);
    return mockFinalSpeech;
  }
};

export const generateDiscussionScript = async (session) => {
  try {
    const reflection = session.perspectives?.studentReflection || {};
    const prompt = `너는 고등학생의 사회과 쟁점토론 준비를 돕는 AI 스크립트 정리 도우미다.

학생이 선택한 쟁점:
${session.issue || "선택된 쟁점 없음"}

쟁점 배경:
${session.issueBackground || "배경 설명 없음"}

학생의 초기 입장:
${session.studentClaim || "입력 안 됨"}

학생이 쓴 이유:
${session.studentReason || "입력 안 됨"}

학생이 준비한 근거:
${session.evidence?.evidenceSentence || "입력 안 됨"}

학생이 참고한 자료 제목:
${session.evidence?.sourceTitle || "입력 안 됨"}

학생이 참고한 자료 내용:
${session.evidence?.sourceContent || "입력 안 됨"}

학생의 의견과 비슷한 관점:
${reflection.similarGroup || "입력 안 됨"}

학생이 새롭게 고려한 관점:
${reflection.newPerspective || "입력 안 됨"}

학생이 일부 받아들인 다른 관점:
${reflection.acceptedView || "입력 안 됨"}

학생이 보완한 주장:
${reflection.improvedClaim || "입력 안 됨"}

위 내용을 바탕으로, 학생이 토론에서 참고할 수 있는 최종 스크립트를 만들어줘.

조건:
1. 고등학생이 실제 토론에서 말할 수 있는 자연스러운 문장으로 쓴다.
2. 너무 길지 않게 쓴다.
3. 학생의 생각을 대신 바꾸지 않는다.
4. 학생이 입력한 내용을 바탕으로 정리한다.
5. 근거와 다양한 관점이 들어가야 한다.
6. 반대 관점이나 다른 이해관계자의 우려를 최소 1개 반영한다.
7. 학생의 최종 입장이 분명하게 드러나야 한다.
8. 없는 통계, 기사 제목, URL, 실제 사례를 지어내지 않는다.
9. 학생이 입력한 자료가 부족할 경우 "추가 확인 필요"라고 표시한다.
10. 그대로 읽는 대본이라기보다 토론 전에 참고할 수 있는 스크립트 형태로 작성한다.

출력 형식은 반드시 아래 형태의 JSON 객체로 한다:
{
  "issueIntro": "오늘 제가 이야기할 쟁점은 ______입니다.",
  "positionStatement": "저는 이 쟁점에 대해 ______라고 생각합니다.",
  "reasonStatement": "그 이유는 ______ 때문입니다.",
  "evidenceStatement": "이를 뒷받침하는 근거로는 ______을 들 수 있습니다.",
  "perspectiveStatement": "이 문제에서 ______의 입장은 제 생각과 비슷합니다. 하지만 ______의 입장에서는 ______라는 점을 걱정할 수 있습니다.",
  "improvedClaimStatement": "이 관점을 고려할 때, 저는 ______라는 점도 함께 생각해야 한다고 봅니다.",
  "finalStatement": "따라서 저는 ______라고 생각합니다.",
  "additionalCheck": "토론 전 더 확인하면 좋은 자료는 ______입니다.",
  "fullScript": "(위 내용을 자연스럽게 이어 붙인 전체 스크립트)"
}`;

    const messages = [
      { role: "system", content: "You are a helpful AI assistant that outputs only valid JSON." },
      { role: "user", content: prompt }
    ];

    const result = await callOpenAI(messages);
    return result;
  } catch (error) {
    console.error("AI Script Generation Failed, using fallback mock:", error);
    return mockDiscussionScript;
  }
};
