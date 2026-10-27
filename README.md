# 워터로그 챌린지 랜딩 페이지

30일 동안 매일 수영 후 배운 점을 기록하는 "워터로그 챌린지" 사전 등록 페이지입니다.
빌드 도구 없이 정적 파일(`index.html`, `styles.css`, `script.js`)로 동작합니다.

- 로컬 확인: `index.html`을 브라우저로 열거나 `python3 -m http.server`
- 이메일 수집: `script.js`의 `SIGNUP_ENDPOINT`에 Formspree / Google Apps Script 등 POST URL을 넣으세요.
  비어 있으면 브라우저 localStorage에만 저장됩니다(데모용).
