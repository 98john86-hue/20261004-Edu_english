# 매일 영단어

한국인 영어 학습자를 위한 단어 학습 웹앱(PWA)입니다. 플래시카드와 SM-2 간격 반복 복습으로 매일 단어를 외우는 습관을 돕습니다.

- 로그인과 서버 없이 모든 데이터를 브라우저(IndexedDB)에 저장합니다.
- 처음 열면 직접 작성한 기본 단어 60개(초급·중급·고급 각 20개)로 바로 학습할 수 있습니다.
- 한 번 방문한 뒤에는 오프라인에서도 동작하고, 홈 화면에 설치할 수 있습니다.

## 실행 방법

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev        # 개발 서버: http://localhost:3000
npm run test       # 단위·컴포넌트 테스트 (Vitest)
npm run build      # 프로덕션 빌드
npm run start      # 빌드 결과 실행 (서비스 워커는 이 모드에서만 등록됨)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## 화면

| 경로 | 화면 | 내용 |
|---|---|---|
| `/` | 대시보드 | 오늘 복습 남은 수, 연속 학습일, 전체 단어 수, 최근 7일 학습량 차트 |
| `/study` | 플래시카드 | 오늘 복습할 카드와 새 단어(하루 한도)를 섞어 학습, 4단계 평가 |
| `/quiz` | 퀴즈 | 영어 단어를 보고 한국어 뜻 고르기(4지선다, 10문제) |
| `/words` | 단어 관리 | 검색, 레벨 필터, 내 단어 추가·수정·삭제 |

### 키보드 단축키

| 화면 | 키 | 동작 |
|---|---|---|
| 플래시카드 | `Space` | 카드 뒤집기 |
| 플래시카드 | `1` `2` `3` `4` | 다시 / 어려움 / 보통 / 쉬움 (뒤집은 뒤에만) |
| 플래시카드 | `P` | 발음 듣기 (한글 입력 상태에서도 동작) |
| 퀴즈 | `1`~`4`, `Enter` | 보기 선택, 다음 문제 |

입력창이나 선택 상자에 포커스가 있을 때는 단축키가 동작하지 않습니다.

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Dexie 4 (IndexedDB) · Zustand 5 · Web Speech API · Vitest + React Testing Library + fake-indexeddb

모든 패키지 버전은 `package.json`에 정확한 버전으로 고정되어 있습니다.

## 폴더 구조

```
app/                    라우트 (/, /study, /quiz, /words), manifest, 아이콘
components/             재사용 UI. DB가 필요한 화면은 모두 'use client'
  DbGate.tsx            DB 열기 + 샘플 단어 시드, IndexedDB를 쓸 수 없으면 안내 화면
  StudySession.tsx      플래시카드 화면과 키보드 처리
  QuizSession.tsx       퀴즈 화면과 키보드 처리
  WordManager.tsx       단어 관리 화면
  Dashboard.tsx         대시보드
  ServiceWorkerRegister.tsx
lib/                    순수 로직 (모두 단위 테스트)
  srs.ts                SM-2 review()
  date.ts               로컬 날짜 'YYYY-MM-DD' 계산
  studyQueue.ts         복습 카드 + 새 단어 큐 구성
  quiz.ts               출제 단어·오답 보기 생성
  wordValidation.ts     입력 검증, 중복 찾기, 검색·필터
  stats.ts, dashboard.ts 연속 학습일, 7일 통계, 대시보드 요약
  settings.ts           localStorage 사용자 설정 (하루 새 단어 수)
  speech.ts             speechSynthesis 래퍼 (en-US)
  random.ts             셔플, 시드 난수
db/
  database.ts           Dexie 스키마
  seed.ts               샘플 단어 1회 삽입
  repositories/         저장소 인터페이스(types.ts)와 Dexie 구현체
  index.ts              repository 묶음 생성, initDatabase()
store/                  Zustand 세션 상태 (studySession, quizSession)
data/sampleWords.json   기본 단어 60개 (직접 작성)
public/sw.js            서비스 워커
public/icons/           PWA 아이콘
```

## 데이터 계층

```
컴포넌트 → Zustand store(세션 상태) → repository 인터페이스 → Dexie(IndexedDB)
                     └→ lib/ 순수 함수 (srs, studyQueue, quiz, stats)
```

- 컴포넌트와 store는 Dexie를 직접 호출하지 않고 `getRepositories()`가 돌려주는 인터페이스(`db/repositories/types.ts`)만 사용합니다. 서버 DB로 옮길 때는 같은 인터페이스를 따르는 HTTP 구현체를 만들어 `db/index.ts`의 `createRepositories`만 바꾸면 됩니다.
- 테이블:

  | 테이블 | 키 | 내용 |
  |---|---|---|
  | `words` | `id` | `Word` |
  | `reviews` | `wordId` | `ReviewState`, `dueDate` 인덱스로 오늘 복습할 카드 조회 |
  | `studyLogs` | `date` | `StudyLog`, 플래시카드와 퀴즈 모두 여기에 합산 |
  | `meta` | `key` | 시드 완료 표시, 날짜별 새 단어 학습 수 |

- 기본 단어는 고정 id(`builtin-b01` 등)와 시드 완료 표시를 한 트랜잭션에서 처리해서, 여러 탭에서 동시에 처음 열어도 중복 삽입되지 않습니다.
- 기본 단어는 수정·삭제할 수 없습니다. 사용자 단어를 삭제하면 복습 상태도 함께 지웁니다.
- localStorage에는 사용자 설정(하루 새 단어 수)만 저장합니다.
- IndexedDB를 쓸 수 없는 환경(예: 일부 브라우저의 시크릿 모드)에서는 앱이 깨지지 않고 안내 메시지를 보여 줍니다.

## SM-2 간격 반복

`lib/srs.ts`의 `review(state, grade, today)`는 입력을 바꾸지 않는 순수 함수입니다.

### 평가 버튼과 SM-2 품질 점수

| 버튼 | grade | 품질 q | easeFactor 변화 | 결과 |
|---|---|---|---|---|
| 다시 | 0 | 1 | −0.54 | 실패: 반복 횟수 0, 간격 1일(내일 다시) |
| 어려움 | 1 | 3 | −0.14 | 통과 |
| 보통 | 2 | 4 | 0 | 통과 |
| 쉬움 | 3 | 5 | +0.10 | 통과 |

### 규칙

1. easeFactor(EF)는 2.5에서 시작하고, 복습할 때마다 `EF' = EF + (0.1 − (5−q)(0.08 + (5−q)·0.02))`로 갱신합니다. 최솟값은 1.3입니다.
2. 통과하면 간격이 1일 → 6일 → `round(이전 간격 × EF)`일로 늘어납니다. "보통"만 계속 누르면 1 → 6 → 15 → 38일입니다.
3. 실패하면 반복 횟수를 0으로, 간격을 1일로 되돌립니다. EF는 2.5로 초기화하지 않고 공식대로 줄어들어, 자주 틀리는 단어는 이후 간격이 덜 늘어납니다.
4. 다음 복습일은 `오늘 + 간격`입니다.

### 학습 화면에서의 적용

- 오늘 학습 큐는 `dueDate ≤ 오늘`인 카드와 아직 학습하지 않은 새 단어(하루 한도, 기본 10개, 초급부터)를 섞어 만듭니다.
- "다시"를 누른 카드는 같은 세션에 다시 나오지 않고 내일 복습합니다.
- 오늘 할 카드를 모두 끝내면 "새 단어 더 학습하기"로 새 단어 10개를 추가로 학습할 수 있습니다.
- 퀴즈 결과는 SM-2 상태를 바꾸지 않고 StudyLog에만 기록합니다.

### 날짜 처리

모든 날짜는 사용자 로컬 자정 기준의 `'YYYY-MM-DD'` 문자열입니다. `toISOString()`을 쓰면 UTC로 바뀌어 한국에서는 오전 9시 전 학습이 전날로 기록되기 때문입니다. 날짜 더하기는 달력의 '일'을 더하는 방식이라 월말·연말·윤년·서머타임 경계에서도 정확합니다.

## 대시보드 지표

- **오늘 복습 남은 수:** `dueDate ≤ 오늘`인 카드 수. 오늘 학습할 수 있는 새 단어 수도 함께 안내합니다.
- **연속 학습일:** 하루에 1개 이상 학습(플래시카드나 퀴즈)한 날이 끊김 없이 이어진 일수입니다. 오늘 아직 학습하지 않았더라도 어제까지 이어졌다면 유지됩니다.
- **최근 7일 학습량:** 오늘을 포함한 7일의 학습 수 막대 차트입니다. 막대에 마우스를 올리거나 포커스하면 상세 수치가 나오고, "표로 보기"로 같은 데이터를 표로 볼 수 있습니다.

## PWA와 오프라인

- `app/manifest.ts`가 `/manifest.webmanifest`를 만들고, 일반 아이콘과 maskable 아이콘을 포함합니다.
- `public/sw.js`(라이브러리 없이 직접 작성)는 프로덕션 빌드에서만 등록됩니다.
  - **설치할 때:** 네 화면의 HTML과, 그 HTML이 참조하는 `/_next/static` 파일을 미리 캐시합니다. 그래서 첫 방문 직후 오프라인이 되어도 열어 보지 않은 화면까지 열립니다.
  - **화면(HTML):** 네트워크를 먼저 시도하고, 실패하면 캐시를 씁니다. 그래서 온라인일 때는 항상 최신 배포를 받습니다.
  - **정적 파일:** 캐시를 먼저 씁니다(파일명에 해시가 있어 내용이 바뀌지 않음).
- 캐시 구조를 바꿀 때는 `sw.js`의 `CACHE_VERSION`을 올리면 이전 캐시가 지워집니다.

## 테스트

- `lib/`의 순수 함수는 모두 단위 테스트가 있습니다. SM-2 첫 복습·연속 성공·실패 후 초기화·EF 최솟값·월말·연말, 날짜 경계와 서머타임, 연속 학습일 등을 다룹니다.
- repository와 시드는 `fake-indexeddb` 위의 실제 Dexie로 테스트합니다.
- 컴포넌트 테스트:
  - 플래시카드: 뒤집기, 평가 후 다음 카드, 키보드만으로 세션 완료
  - 단어 추가: 필수값 검증, 중복 경고
  - 퀴즈: SM-2 상태를 바꾸지 않음
  - 대시보드
