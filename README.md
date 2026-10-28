# 한 달 수영 기록 챌린지 랜딩 페이지

4주 동안 평일(월~금) 중 주 3~5회, 수영 거리나 배운 점을 기록하는 챌린지의 사전 등록 페이지입니다.

- Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · Vitest

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 프로덕션 빌드
npm run typecheck  # 타입 체크
npm test           # 단위 테스트
```

## 구조

```
src/
  app/                 layout(metadata), page, globals.css
  content/landing.ts   페이지의 모든 문구와 예시 데이터
  lib/
    types.ts           Level, SwimLog, SignupData 등 타입
    distance.ts        총 거리 계산 (레인 길이 × 2 × 바퀴 수, 1바퀴 = 왕복)
    validation.ts      이메일·신청 폼 검증
    signup.ts          submitSignup — 1초 뒤 성공하는 mock
    date.ts            기록 날짜 표시
    board.ts           주간 진행판: 주차 날짜, 주간 집계, 기록 많은 순 정렬
  components/
    sections/          SiteHeader, Hero, HowItWorks, WeeklyBoard(오늘의 인증 + 전체 진행판),
                       Faq, SignupCta, Footer
    ui/                CheckInForm, BoardTable, Button, Badge, WaveBackground, Icon, SectionHeading
  tests/               Vitest 단위 테스트
```

## 실제 API로 교체

`src/lib/signup.ts`의 `submitSignup` 내부만 `fetch` 호출로 바꾸면 됩니다. 시그니처
`(data: SignupData) => Promise<SignupResult>`는 유지하세요.
