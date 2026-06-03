import { mockPerspectives } from '../data/mockResponses';

/**
 * 나중에 OpenAI API를 연결할 함수
 * 현재는 mock 데이터를 반환합니다.
 */
export const fetchPerspectives = async (issueId, studentClaim) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 해당 쟁점의 목업 데이터가 있으면 반환, 없으면 기본값 반환
      const data = mockPerspectives[issueId] || mockPerspectives["default"];
      if (data) {
        resolve(data);
      } else {
        // Fallback should not be reached with default
        resolve(mockPerspectives["default"]);
      }
    }, 1000); // 1초 지연으로 API 통신 흉내
  });
};
