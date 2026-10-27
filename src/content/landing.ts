import type { DayStatus, DistanceLog, LearningLog, Level, ReferralSource, Stroke } from '@/lib/types';

/** 페이지의 모든 문구와 예시 데이터. 컴포넌트에는 문구를 하드코딩하지 않는다. */

export const site = {
  name: '30일 수영 기록 챌린지',
  title: '30일 수영 기록 챌린지 | 매일 한 줄씩 쌓이는 나의 수영',
  description:
    '30일 동안 매일 수영 거리나 배운 점을 기록하는 챌린지. 많이 못 헤엄친 날도 배운 점 한 줄이면 성공이에요. 지금 이메일로 사전 등록하세요.',
  ogDescription: '거리 또는 배운 점, 하나만 기록하면 오늘도 성공. 30일 수영 기록 챌린지 사전 등록 중.',
  locale: 'ko_KR',
} as const;

export const header = {
  homeLabel: '30일 수영 기록 챌린지 홈',
  nav: [
    { href: '#how', label: '참여 방법' },
    { href: '#examples', label: '기록 예시' },
    { href: '#levels', label: '난이도' },
    { href: '#faq', label: 'FAQ' },
  ],
  navLabel: '주요 메뉴',
  cta: '사전 등록',
} as const;

export const hero = {
  eyebrow: '30일 수영 기록 챌린지 · 사전 등록 중',
  headlineLines: ['30일, 매일 한 줄씩', '쌓이는 나의 수영'],
  subcopy: '거리 또는 배운 점, 하나만 기록하면 오늘도 성공.',
  body: '많이 못 헤엄친 날도 배운 점 한 줄이면 충분해요. 거리보다 꾸준함과 성장을 목표로 함께 30일을 채워 봐요.',
  primaryCta: '챌린지 사전 등록하기',
  secondaryCta: '기록 예시 보기',
  chips: ['초급 · 중급 · 상급', '하루 1분 기록', '무료 사전 등록'],
} as const;

export const howItWorks = {
  eyebrow: '참여 방법',
  title: '세 단계면 충분해요',
  steps: [
    {
      icon: 'level',
      title: '난이도 선택',
      description: '초급·중급·상급 중 지금 나에게 맞는 단계를 골라요. 언제든 바꿀 수 있어요.',
    },
    {
      icon: 'note',
      title: '매일 수영 후 기록',
      description: '헤엄친 거리 또는 오늘 배운 점, 둘 중 하나만 남기면 그날은 성공이에요.',
    },
    {
      icon: 'flag',
      title: '30일 완주',
      description: '한 줄씩 쌓인 30일의 기록이 나만의 수영 노트가 됩니다.',
    },
  ],
} as const;

export const distanceExample: DistanceLog = {
  type: 'distance',
  date: '2026-11-12',
  laneLength: 25,
  laps: 6,
};

export const learningExample: LearningLog = {
  type: 'learning',
  date: '2026-11-12',
  stroke: '자유형',
  note: '팔을 너무 뒤로 돌리면 균형 잡기 어려우니 옆으로 돌린다',
};

export const logCard = {
  distanceTitle: '거리 기록',
  learningTitle: '배움 기록',
  laneLabel: '레인 길이',
  lapsLabel: '바퀴 수',
  totalLabel: '총 거리',
  lapsUnit: '바퀴',
  lapsHint: '왕복 기준',
  strokeLabel: '영법',
  noteLabel: '오늘 배운 점',
  successBadge: '오늘 성공',
  emptyNote: '배운 점을 입력하면 여기에 표시돼요.',
} as const;

export const logExamples = {
  eyebrow: '기록 예시',
  title: '이렇게 기록해요',
  description: '수영을 마치고 1분이면 충분해요. 둘 중 하나만 남겨도 그날은 성공입니다.',
  bothNote: '거리와 배운 점을 같은 날 함께 남길 수도 있어요. 둘 다 기록한 날은 달력에 따로 표시돼요.',
  orLabel: '또는',
  lapNote: '1바퀴는 왕복 기준이에요. 25m 레인이면 1바퀴 = 50m, 총 거리는 자동으로 계산돼요.',
} as const;

export const benefits = {
  eyebrow: '참여 효과',
  title: '30일 뒤, 이런 변화가 생겨요',
  items: [
    {
      icon: 'calendar',
      title: '습관 형성',
      description: '매일 기록하는 작은 행동이 수영장 가는 발걸음을 꾸준하게 만들어요.',
    },
    {
      icon: 'chart',
      title: '실력 성장 체감',
      description: '쌓인 거리와 배운 점을 돌아보면 어제보다 나아진 내가 보여요.',
    },
    {
      icon: 'book',
      title: '나만의 수영 노트',
      description: '30개의 배움이 모이면 다시 꺼내 볼 수 있는 나만의 교과서가 돼요.',
    },
    {
      icon: 'spark',
      title: '동기 유지',
      description: '“한 줄만 쓰면 성공”이라는 낮은 기준 덕분에 지치지 않고 이어갈 수 있어요.',
    },
  ],
} as const;

export type LevelContent = {
  label: string;
  title: string;
  target: string;
  distanceExample: string;
  learningExample: string;
};

export const levelOrder: readonly Level[] = ['beginner', 'intermediate', 'advanced'];

export const levelContent: Record<Level, LevelContent> = {
  beginner: {
    label: '초급',
    title: '물과 친해지는 중',
    target: '수영을 배우기 시작했거나 오랜만에 다시 시작하는 분',
    distanceExample: '25m 4바퀴',
    learningExample: '호흡할 때 고개를 너무 들지 않기',
  },
  intermediate: {
    label: '중급',
    title: '영법을 다듬는 중',
    target: '네 가지 영법을 배웠고 꾸준히 거리를 늘리고 싶은 분',
    distanceExample: '25m 10바퀴 (500m)',
    learningExample: '평영 발차기 타이밍 맞추기',
  },
  advanced: {
    label: '상급',
    title: '기록을 끌어올리는 중',
    target: '인터벌 훈련을 하며 효율과 기록을 다듬고 싶은 분',
    distanceExample: '1,500m 인터벌',
    learningExample: '접영 웨이브 리듬 교정',
  },
};

export const levels = {
  eyebrow: '난이도 선택',
  title: '나에게 맞는 난이도를 골라요',
  description: '선택한 난이도는 아래 사전 등록 폼에 자동으로 반영돼요.',
  legend: '챌린지 난이도',
  targetLabel: '이런 분께 추천해요',
  examplesLabel: '권장 기록 예시',
  distancePrefix: '거리',
  learningPrefix: '배움',
  selectedLabel: '선택됨',
} as const;

// 예시 데이터: 22일차까지 기록, 이후는 남은 날
const progressPattern: DayStatus[] = [
  'distance', 'learning', 'both', 'distance', 'learning', 'distance', 'both',
  'learning', 'distance', 'learning', 'both', 'distance', 'learning', 'learning',
  'both', 'distance', 'learning', 'both', 'distance', 'learning', 'both', 'learning',
  'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming',
];

export const progress = {
  eyebrow: '30일 진행 미리보기',
  title: '하루하루 채워지는 30칸',
  description: '기록한 날은 색으로 채워지고, 무엇을 기록했는지 한눈에 보여요.',
  sampleBadge: '예시 데이터',
  gridLabel: '30일 기록 예시 달력',
  dayLabel: (day: number) => `${day}일차`,
  summary: (done: number, total: number) => `${total}일 중 ${done}일 기록 (예시)`,
  days: progressPattern,
  legend: {
    distance: '거리 기록',
    learning: '배움 기록',
    both: '둘 다 기록',
    upcoming: '남은 날',
  } satisfies Record<DayStatus, string>,
} as const;

export const testimonials = {
  eyebrow: '참가자 후기',
  title: '먼저 해 본 분들의 이야기',
  notice: '아래 후기는 이해를 돕기 위한 예시이며, 실제 참가자의 후기가 아닙니다.',
  badge: '예시 후기',
  items: [
    {
      name: '참가자 A (예시)',
      meta: '초급 · 30일 중 OO일 기록',
      quote: '거리가 적은 날에도 배운 점 한 줄을 쓰니 “오늘도 했다”는 기분이 들었어요.',
    },
    {
      name: '참가자 B (예시)',
      meta: '중급 · 누적 OO,OOOm',
      quote: '기록을 다시 읽어 보니 같은 실수를 반복하고 있었다는 걸 알게 됐어요.',
    },
    {
      name: '참가자 C (예시)',
      meta: '상급 · 30일 완주',
      quote: '인터벌 기록과 교정 포인트를 함께 남기니 훈련의 방향이 분명해졌어요.',
    },
  ],
} as const;

export const faq = {
  eyebrow: 'FAQ',
  title: '자주 묻는 질문',
  items: [
    {
      question: '하루를 놓치면 어떻게 되나요?',
      answer:
        '괜찮아요. 챌린지는 중단되지 않고 다음 날부터 다시 이어가면 돼요. 놓친 날은 달력에 빈칸으로 남고, 완주 기준 등 세부 규칙은 시작 전 안내 메일로 알려드릴 예정이에요. (플레이스홀더 답변)',
    },
    {
      question: '수영장에 못 가는 날은요?',
      answer:
        '수영장 휴무나 일정이 있는 날을 위한 운영 방식(예: 휴식일 지정)을 준비 중이에요. 확정되면 사전 등록하신 분들께 먼저 안내드릴게요. (플레이스홀더 답변)',
    },
    {
      question: '초급인데 배운 게 없으면요?',
      answer:
        '그런 날은 헤엄친 거리만 기록해도 성공이에요. 그래도 “오늘 물에 뜨는 느낌이 조금 달랐다”처럼 작은 감각도 훌륭한 배움 기록이 될 수 있어요.',
    },
    {
      question: '비용이 드나요?',
      answer: '사전 등록은 무료예요. 챌린지 운영 방식과 비용 여부는 시작 전 이메일로 안내드릴게요. (플레이스홀더 답변)',
    },
    {
      question: '안전을 위해 주의할 점이 있나요?',
      answer:
        '참여 전 자신의 건강 상태를 확인하고, 지병이 있거나 불편함이 있다면 전문가와 먼저 상담해 주세요. 수영은 반드시 안전요원이 있는 수영장에서 하시길 권장하며, 컨디션이 좋지 않은 날은 무리하지 말고 쉬어 주세요.',
    },
  ],
} as const;

export const signup = {
  eyebrow: '사전 등록',
  title: '오늘부터 한 줄씩, 함께 시작해요',
  description: '사전 신청하신 분께 챌린지 일정과 참여 방법을 가장 먼저 알려드려요. 신청만으로는 비용이 청구되지 않아요.',
  requiredNotice: '* 표시는 필수 질문이에요',
  requiredMark: '필수',
  answerPlaceholder: '내 답변',
  nameLabel: '이름 또는 닉네임',
  phoneLabel: '연락받을 휴대폰 번호',
  phonePlaceholder: '010-1234-5678',
  emailLabel: '이메일',
  emailPlaceholder: 'you@example.com',
  levelLabel: '지금 수영은 어느 정도 하고 계세요?',
  levelHint: '위에서 고른 난이도가 기본으로 선택돼요.',
  levelOptions: {
    beginner: '초급 · 물에 뜨는 연습 중이거나 오랜만에 다시 시작해요',
    intermediate: '중급 · 네 가지 영법을 배웠고 거리를 늘리는 중이에요',
    advanced: '상급 · 인터벌 훈련을 하며 기록을 다듬고 있어요',
  } satisfies Record<Level, string>,
  goalLabel: '이번 30일 동안 가장 바꾸고 싶은 건 뭐예요?',
  goalPlaceholder: '예: 자유형 호흡이 편해졌으면 좋겠어요',
  referralLabel: '어디서 보고 오셨어요?',
  referralOptions: {
    'youtube-shorts': '유튜브 쇼츠',
    youtube: '유튜브 영상',
    threads: '스레드',
    instagram: '인스타그램',
    friend: '지인 소개',
    other: '기타',
  } satisfies Record<ReferralSource, string>,
  agreeTitle: '개인정보 수집·이용 동의',
  agreeLabel: '동의합니다.',
  agreeDetail:
    '수집 항목: 이름(닉네임), 휴대폰 번호, 이메일, 수영 수준, 목표, 유입 경로 · 이용 목적: 챌린지 일정 안내 · 보유 기간: 챌린지 종료 시까지',
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
    emailInvalid: '올바른 이메일 형식이 아니에요. 예: you@example.com',
    agreeRequired: '개인정보 수집·이용에 동의해 주세요.',
    goalTooLong: '200자 이내로 입력해 주세요.',
  },
  limits: { name: 20, goal: 200 },
} as const;

export const demo = {
  eyebrow: '기록 체험해보기',
  title: '직접 한 줄 남겨 보세요',
  description: '입력하는 대로 기록 카드가 바로 바뀌어요. 저장되지 않으니 마음껏 써 보세요.',
  modeLabel: '기록 종류',
  modes: { distance: '거리 기록', learning: '배움 기록' },
  laneLabel: '레인 길이',
  laneOptions: [25, 50] as const,
  lapsLabel: '바퀴 수',
  strokeLabel: '영법',
  noteLabel: '오늘 배운 점',
  notePlaceholder: '예: 돌핀킥은 무릎보다 골반에서 시작한다',
  previewLabel: '미리보기',
  defaultDate: '2026-11-13',
} as const;

export const strokeOptions: readonly Stroke[] = ['자유형', '배영', '평영', '접영', '기타'];

export const footer = {
  contactLabel: '문의',
  contactEmail: 'hello@example.com',
  contactNote: '(플레이스홀더)',
  safety: '수영 전 건강 상태를 확인하고, 안전요원이 있는 곳에서 무리하지 않고 수영해 주세요.',
  copyright: (year: number) => `© ${year} 30일 수영 기록 챌린지. All rights reserved.`,
} as const;

export const weekdays = ['일', '월', '화', '수', '목', '금', '토'] as const;
