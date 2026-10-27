# 30일 수영 기록 챌린지 랜딩 페이지

30일 동안 매일 수영 거리나 배운 점을 기록하는 챌린지의 사전 등록 페이지입니다.

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
  components/
    sections/          Hero, HowItWorks, LogExamples, Benefits, LevelSelect,
                       ProgressPreview, Testimonials, Faq, SignupCta, Footer
                       (+ SiteHeader, LogDemo)
    ui/                LogCard, Button, Badge, WaveBackground, Icon, SectionHeading
    LevelContext.tsx   난이도 선택 ↔ 신청 폼 공유 상태
    Reveal.tsx         스크롤 등장 효과
  tests/               Vitest 단위 테스트
```

## 실제 API로 교체

`src/lib/signup.ts`의 `submitSignup` 내부만 `fetch` 호출로 바꾸면 됩니다. 시그니처
`(data: SignupData) => Promise<SignupResult>`는 유지하세요.
