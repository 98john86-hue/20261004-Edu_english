import type { Level, ReferralSource, Stroke, SwimFrequency } from '@/lib/types';

/** 페이지의 모든 문구와 예시 데이터. 컴포넌트에는 문구를 하드코딩하지 않는다. */

export const site = {
  name: '한 달 수영 기록 챌린지',
  title: '한 달 수영 기록 챌린지 | 매일 한 줄씩 쌓이는 나의 수영',
  description:
    '한 달(4주) 동안 평일 주 3~5회, 수영 거리나 배운 점을 기록하는 챌린지. 많이 못 헤엄친 날도 배운 점 한 줄이면 성공이에요. 지금 사전 등록하세요.',
  ogDescription: '거리 또는 배운 점, 하나만 기록하면 오늘도 성공. 평일 주 3~5회 한 달 수영 기록 챌린지 사전 등록 중.',
  locale: 'ko_KR',
} as const;

export const header = {
  homeLabel: '한 달 수영 기록 챌린지 홈',
  nav: [
    { href: '#how', label: '참여 방법' },
    { href: '#board', label: '인증·진행판' },
    { href: '#faq', label: 'FAQ' },
  ],
  navLabel: '주요 메뉴',
  cta: '사전 등록',
} as const;

export const hero = {
  eyebrow: '사전 등록 중',
  headlineLines: ['한 달, 매일 한 줄씩', '쌓이는 나의 수영'],
  subcopy: '오늘 익힌 기술은 한 줄로 남기고, 내일 물속에서 다시 꺼내 써요.',
  body: '거리 또는 기술, 하나만 기록해도 인증 완료. 4주 동안 평일 주 3~5회, 주말은 쉬어요.',
  primaryCta: '챌린지 사전 등록하기',
} as const;

export const howItWorks = {
  eyebrow: '참여 방법',
  title: '수영하고, 한 줄 남기면 끝',
  steps: [
    { title: '사전 등록', description: '시작 전에 일정과 참여 방법을 알려드려요.' },
    {
      title: '평일 주 3~5회 인증',
      description: '거리나 습득한 기술, 하나만 남겨도 인증돼요.',
      examples: ['거리: 25m × 6바퀴 = 300m', '기술: 자유형 팔은 옆으로 돌린다'],
    },
    { title: '4주 완주', description: '한 달의 기록이 나만의 수영 노트가 돼요.' },
  ],
  lapNote: '1바퀴는 왕복 기준(25m 레인 = 50m)이에요.',
} as const;

export const levelOrder: readonly Level[] = ['beginner', 'intermediate', 'advanced'];


/** 챌린지 일정 (예시 일정: 시작일은 1주차 월요일) */
export const challenge = {
  startDate: '2026-11-02',
  weeks: 4,
  weeklyMin: 3,
  weeklyMax: 5,
} as const;

export type SampleParticipant = {
  id: string;
  name: string;
  /** 참여자가 정한 주간 목표 인증 횟수 (3~5) */
  goal: number;
  /** 주차별 월~금 기록 패턴. D=거리, L=배운 점, B=둘 다, -=없음 */
  weeks: readonly string[];
};

export const board = {
  eyebrow: '오늘의 인증',
  title: '수영하고, 바로 인증해요',
  description: '평일(월~금) 23:59까지 인증해요. 예전 날짜를 골라 이미 낸 인증도 고칠 수 있어요.',
  sampleBadge: '체험용',
  form: {
    dateLabel: '인증할 날짜',
    dateOption: (week: number, date: string) => `${week}주차 · ${date}`,
    nameLabel: '참여 아이디',
    nameHint: '진행판에 보일 이름이에요. 비워 두면 “나”로 보여요.',
    namePlaceholder: '예: 물개',
    goalLabel: '나의 주간 목표',
    goalHint: '한 주에 몇 번 인증할지 정해요. 채우면 진행판에 🏅가 붙어요.',
    goalOption: (n: number) => `주 ${n}회`,
    distanceLabel: '오늘의 거리 기록',
    laneLabel: '레인 길이',
    laneOptions: [25, 50] as const,
    lapsLabel: '바퀴 수 (왕복)',
    lapsPlaceholder: '예: 6',
    skillLabel: '오늘 습득한 기술',
    strokeLabel: '영법',
    skillPlaceholder: '예: 자유형 팔을 뒤로 돌리지 말고 옆으로 돌리니 균형이 잡혔다',
    oneIsEnough: '거리나 기술 중 하나만 적어도 인증돼요.',
    submit: '인증하기',
    update: '인증 수정하기',
    remove: '이 날 인증 지우기',
    emptyError: '거리(바퀴 수)나 습득한 기술 중 하나는 적어 주세요.',
    success: (date: string) => `${date} 인증 완료! 아래 진행판에 반영됐어요.`,
    removed: (date: string) => `${date} 인증을 지웠어요.`,
    notSaved: '체험용이라 입력한 기록은 저장되지 않아요.',
  },
  boardTitle: '전체 진행판',
  boardDescription: '주간 목표를 달성한 참여자부터, 기록이 많은 순으로 보여요. 다른 참여자 이름과 기록은 예시예요.',
  sampleNotice: '예시 데이터',
  weekTabsLabel: '주차 선택',
  weekLabel: (n: number) => `${n}주차`,
  tableCaption: (n: number) => `${n}주차 참여자별 인증 기록 (월~금, 목표 달성자와 기록이 많은 순)`,
  participantHeader: '참여자',
  weekdayHeaders: ['월', '화', '수', '목', '금'],
  meName: '나',
  meTag: '나',
  weeklyCount: (count: number, goal: number) => `${count}/${goal}회`,
  goalMedal: '🏅',
  goalMetLabel: '주간 목표 달성',
  goalProgressLabel: (count: number, goal: number) => `주간 목표 ${goal}회 중 ${count}회 인증`,
  goalHint: '각자 정한 주간 목표(주 3~5회)를 채우면 🏅',
  emptyCell: '기록 없음',
  zoomLabel: '글자 크기',
  zoomOptions: ['작게', '보통', '크게'] as const,
  zoomHint: '표는 옆으로 밀어 월~금을 볼 수 있어요. 글자가 작으면 “크게”를 누르거나 두 손가락으로 확대해 보세요.',
  samplePools: {
    distances: [
      [25, 8],
      [25, 12],
      [50, 10],
      [25, 6],
      [50, 16],
      [25, 20],
      [50, 8],
    ] as const satisfies ReadonlyArray<readonly [number, number]>,
    notes: [
      { stroke: '자유형', note: '호흡할 때 고개를 너무 들지 않기' },
      { stroke: '평영', note: '발차기는 팔을 뻗은 뒤에 차야 앞으로 나간다' },
      { stroke: '배영', note: '귀가 물에 잠길 만큼 머리를 뒤로 눕힌다' },
      { stroke: '자유형', note: '팔 입수는 어깨 너비로' },
      { stroke: '접영', note: '웨이브는 가슴으로 누르는 느낌에서 시작' },
      { stroke: '기타', note: '킥판 잡고 발차기만 해도 다리 힘이 많이 든다' },
      { stroke: '자유형', note: '글라이드를 1초 더 길게 하니 덜 지친다' },
      { stroke: '평영', note: '당기고-숨-차고-뻗기 순서를 지키기' },
    ] as const satisfies ReadonlyArray<{ stroke: Stroke; note: string }>,
  },
  participants: [
    { id: 'a', name: '참가자 A', goal: 4, weeks: ['DLB-L', 'BLD-B', 'D-L-D', 'LB---'] },
    { id: 'b', name: '참가자 B', goal: 5, weeks: ['BBDBL', 'BDBLB', 'DBBDL', 'BB---'] },
    { id: 'c', name: '참가자 C', goal: 3, weeks: ['L-L-D', '-L-D-', 'LD-L-', 'L----'] },
    { id: 'd', name: '참가자 D', goal: 4, weeks: ['D-D-D', 'DDL-D', 'B-D-D', 'D-D--'] },
    { id: 'e', name: '참가자 E', goal: 3, weeks: ['-L---', 'L-L-L', '-BL-B', '-L---'] },
  ] as const satisfies ReadonlyArray<SampleParticipant>,
} as const;

/** 사전 등록 폼 위에 들어가는 이야기. 한 항목이 화면에서 한 줄 */
export const story = {
  title: '워터로그 챌린지',
  stanzas: [
    ['평생 일만 하고 돈만 버는,', '수동적인 사람으로 살아왔어요.'],
    ['그런데 수영을 하며 건강해지면서,', '내가 좋아하는 게 무엇인지 알게 되었습니다.'],
    ['거창한 목표는 필요 없어요.', '매일의 수영 기록, 그 작은 성취가 쌓이면,', '자신감은 반드시 따라옵니다.'],
  ],
  closing: ['당신의 변화도,', '오늘도 한 걸음 나아가며 시작돼요.'],
} as const;

export const faq = {
  eyebrow: 'FAQ',
  title: '자주 묻는 질문',
  items: [
    {
      question: '하루를 놓치면 어떻게 되나요?',
      answer:
        '괜찮아요. 평일(월~금) 중 주 3~5회만 인증하면 그 주는 성공이에요. 주말은 쉬고, 하루 놓쳐도 같은 주의 다른 평일에 채우면 돼요.',
    },
    {
      question: '다른 참여자가 제 기록을 볼 수 있나요?',
      answer:
        '네. 서로 자극을 주고받을 수 있도록 진행판에 참여 아이디와 기록이 함께 보여요. 공개 범위 등 세부 정책은 시작 전 안내드릴게요. (플레이스홀더 답변)',
    },
    {
      question: '비용이 드나요?',
      answer: '아니요, 사전 등록부터 챌린지 참여까지 모두 무료예요.',
    },
    {
      question: '안전을 위해 주의할 점이 있나요?',
      answer:
        '참여 전 건강 상태를 확인하고, 불편함이 있다면 전문가와 먼저 상담해 주세요. 안전요원이 있는 수영장에서, 컨디션이 좋지 않은 날은 무리하지 말고 쉬어 주세요.',
    },
  ],
} as const;

export const signup = {
  eyebrow: '사전 등록',
  description: '사전 신청하신 분께 챌린지 일정과 참여 방법을 가장 먼저 알려드려요.',
  requiredNotice: '* 표시는 필수 질문이에요',
  requiredMark: '필수',
  answerPlaceholder: '내 답변',
  nameLabel: '이름 또는 닉네임',
  phoneLabel: '연락받을 휴대폰 번호',
  phonePlaceholder: '010-1234-5678',
  emailLabel: '이메일',
  emailPlaceholder: 'you@example.com',
  frequencyLabel: '지금 수영은 어느 정도 하고 계세요?',
  frequencyOptions: {
    once: '주 1회',
    'two-three': '주 2~3회',
    five: '주 5회',
    six: '주 6회',
  } satisfies Record<SwimFrequency, string>,
  levelLabel: '지금 수영 강습 등록을 하셨다면 레벨은?',
  levelHint: '강습을 듣지 않으면 비워 두셔도 돼요.',
  levelOptions: {
    beginner: '초급',
    intermediate: '중급',
    advanced: '상급',
  } satisfies Record<Level, string>,
  goalLabel: '이번 한 달 동안 가장 바꾸고 싶은 건 뭐예요?',
  goalPlaceholder: '예: 자유형 호흡이 편해졌으면 좋겠어요',
  referralLabel: '어디서 보고 오셨어요?',
  referralOptions: {
    youtube: '유튜브 영상',
    threads: '스레드',
    blog: '블로그',
    friend: '지인 소개',
    other: '기타',
  } satisfies Record<ReferralSource, string>,
  agreeLabel: '개인정보 수집·이용에 동의합니다.',
  agreeDetail:
    '수집 항목: 이름(닉네임), 휴대폰 번호, 이메일, 수영 빈도, 강습 레벨, 목표, 유입 경로 · 이용 목적: 챌린지 일정 안내 · 보유 기간: 챌린지 종료 시까지',
  clearLabel: '양식 지우기',
  submit: '사전 신청 제출하기',
  submitting: '등록하는 중…',
  success: '사전 등록이 완료되었어요! 챌린지 시작 전 이메일로 알려드릴게요.',
  resetLabel: '다른 정보로 다시 신청하기',
  genericError: '등록 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
  errors: {
    nameRequired: '이름 또는 닉네임을 입력해 주세요.',
    nameTooLong: '이름 또는 닉네임은 20자 이내로 입력해 주세요.',
    phoneRequired: '휴대폰 번호를 입력해 주세요.',
    phoneInvalid: '올바른 휴대폰 번호가 아니에요. 예: 010-1234-5678',
    emailRequired: '이메일을 입력해 주세요.',
    frequencyRequired: '수영하는 빈도를 선택해 주세요.',
    emailInvalid: '올바른 이메일 형식이 아니에요. 예: you@example.com',
    agreeRequired: '개인정보 수집·이용에 동의해 주세요.',
    goalTooLong: '200자 이내로 입력해 주세요.',
  },
  limits: { name: 20, goal: 200 },
} as const;

export const strokeOptions: readonly Stroke[] = ['자유형', '배영', '평영', '접영', '기타'];

export const footer = {
  contactLabel: '문의',
  contactEmail: 'hello@example.com',
  contactNote: '(플레이스홀더)',
  safety: '수영 전 건강 상태를 확인하고, 안전요원이 있는 곳에서 무리하지 않고 수영해 주세요.',
  copyright: (year: number) => `© ${year} 한 달 수영 기록 챌린지. All rights reserved.`,
} as const;

export const weekdays = ['일', '월', '화', '수', '목', '금', '토'] as const;
