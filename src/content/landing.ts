import type { DistanceLog, LearningLog, Level, ReferralSource, Stroke, SwimFrequency } from '@/lib/types';

/** 페이지의 모든 문구와 예시 데이터. 컴포넌트에는 문구를 하드코딩하지 않는다. */

export const site = {
  name: '한 달 수영 기록 챌린지',
  title: '한 달 수영 기록 챌린지 | 평일마다 한 줄씩 쌓이는 나의 수영',
  description:
    '한 달(4주) 동안 평일 주 3~5회, 수영 거리나 배운 점을 기록하는 챌린지. 많이 못 헤엄친 날도 배운 점 한 줄이면 성공이에요. 지금 사전 등록하세요.',
  ogDescription: '거리 또는 배운 점, 하나만 기록하면 오늘도 성공. 평일 주 3~5회 한 달 수영 기록 챌린지 사전 등록 중.',
  locale: 'ko_KR',
} as const;

export const header = {
  homeLabel: '한 달 수영 기록 챌린지 홈',
  nav: [
    { href: '#how', label: '참여 방법' },
    { href: '#examples', label: '기록 예시' },
    { href: '#board', label: '진행판' },
    { href: '#levels', label: '난이도' },
    { href: '#faq', label: 'FAQ' },
  ],
  navLabel: '주요 메뉴',
  cta: '사전 등록',
} as const;

export const hero = {
  eyebrow: '한 달 수영 기록 챌린지 · 사전 등록 중',
  headlineLines: ['한 달, 평일마다 한 줄씩', '쌓이는 나의 수영'],
  subcopy: '거리 또는 배운 점, 하나만 기록하면 오늘도 성공.',
  body: '4주 동안 월~금 중 주 3~5회만 기록하면 돼요. 많이 못 헤엄친 날도 배운 점 한 줄이면 충분해요. 주말은 푹 쉬어요.',
  primaryCta: '챌린지 사전 등록하기',
  secondaryCta: '기록 예시 보기',
  chips: ['4주 · 평일 주 3~5회', '하루 1분 기록', '무료 사전 등록'],
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
      title: '평일 수영 후 기록',
      description: '월~금 중 주 3~5회, 헤엄친 거리 또는 오늘 배운 점 중 하나만 남기면 그날은 인증 완료예요.',
    },
    {
      icon: 'flag',
      title: '4주 완주',
      description: '매주 3회 이상 인증하며 4주를 채우면 한 달의 기록이 나만의 수영 노트가 됩니다.',
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
  bothNote: '거리와 배운 점을 같은 날 함께 남길 수도 있어요. 둘 다 기록한 날은 진행판 칸에 함께 표시돼요.',
  orLabel: '또는',
  lapNote: '1바퀴는 왕복 기준이에요. 25m 레인이면 1바퀴 = 50m, 총 거리는 자동으로 계산돼요.',
} as const;

export const benefits = {
  eyebrow: '참여 효과',
  title: '한 달 뒤, 이런 변화가 생겨요',
  items: [
    {
      icon: 'calendar',
      title: '습관 형성',
      description: '평일마다 기록하는 작은 행동이 수영장 가는 발걸음을 꾸준하게 만들어요.',
    },
    {
      icon: 'chart',
      title: '실력 성장 체감',
      description: '쌓인 거리와 배운 점을 돌아보면 어제보다 나아진 내가 보여요.',
    },
    {
      icon: 'book',
      title: '나만의 수영 노트',
      description: '한 달 동안 모인 배움이 다시 꺼내 볼 수 있는 나만의 교과서가 돼요.',
    },
    {
      icon: 'spark',
      title: '동기 유지',
      description: '진행판에서 다른 참여자의 기록을 보며 서로 자극을 주고받을 수 있어요.',
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
  /** 주차별 월~금 기록 패턴. D=거리, L=배운 점, B=둘 다, -=없음 */
  weeks: readonly string[];
};

export const board = {
  eyebrow: '주간 진행판',
  title: '이번 주, 다 같이 채워 가요',
  description:
    '월~금 칸을 눌러 바로 기록하고, 다른 참여자의 기록도 따로 들어가지 않고 한 화면에서 볼 수 있어요. 한 주에 기록이 많은 참여자가 위에 표시돼요.',
  sampleBadge: '예시 데이터',
  sampleNotice: '다른 참여자의 이름과 기록은 모두 예시예요. 내 줄에 입력한 기록은 저장되지 않아요.',
  weekTabsLabel: '주차 선택',
  weekLabel: (n: number) => `${n}주차`,
  tableCaption: (n: number) => `${n}주차 참여자별 기록 (월~금, 기록이 많은 순)`,
  participantHeader: '참여자',
  weekdayHeaders: ['월', '화', '수', '목', '금'],
  meName: '나',
  meTag: '체험',
  rankLabel: (rank: number) => `${rank}위`,
  weeklyCount: (count: number) => `주 ${count}회`,
  goalMet: '이번 주 성공',
  goalHint: '평일 중 주 3회 이상 인증하면 그 주는 성공이에요.',
  addLabel: '기록하기',
  cellLabel: (name: string, day: string, date: string) => `${name}, ${day}요일 ${date}`,
  editHint: '눌러서 수정',
  emptyCell: '기록 없음',
  scrollHint: '표를 옆으로 밀어 월~금을 모두 볼 수 있어요.',
  dialog: {
    title: (date: string) => `${date} 기록`,
    hint: '거리나 배운 점 중 하나만 입력해도 인증돼요.',
    distanceLegend: '거리',
    laneLabel: '레인 길이',
    laneOptions: [25, 50] as const,
    lapsLabel: '바퀴 수 (왕복)',
    learningLegend: '오늘 배운 점',
    strokeLabel: '영법',
    noteLabel: '배운 점',
    notePlaceholder: '예: 돌핀킥은 무릎보다 골반에서 시작한다',
    save: '저장',
    remove: '이 날 기록 지우기',
    cancel: '닫기',
    emptyError: '거리(바퀴 수)나 배운 점 중 하나는 입력해 주세요.',
  },
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
    { id: 'a', name: '참가자 A', weeks: ['DLB-L', 'BLD-B', 'D-L-D', 'LB---'] },
    { id: 'b', name: '참가자 B', weeks: ['BBDBL', 'BDBLB', 'DBBDL', 'BB---'] },
    { id: 'c', name: '참가자 C', weeks: ['L-L-D', '-L-D-', 'LD-L-', 'L----'] },
    { id: 'd', name: '참가자 D', weeks: ['D-D-D', 'DDL-D', 'B-D-D', 'D-D--'] },
    { id: 'e', name: '참가자 E', weeks: ['-L---', 'L-L-L', '-BL-B', '-L---'] },
  ] as const satisfies ReadonlyArray<SampleParticipant>,
} as const;

export const testimonials = {
  eyebrow: '참가자 후기',
  title: '먼저 해 본 분들의 이야기',
  notice: '아래 후기는 이해를 돕기 위한 예시이며, 실제 참가자의 후기가 아닙니다.',
  badge: '예시 후기',
  items: [
    {
      name: '참가자 A (예시)',
      meta: '초급 · 4주 중 OO회 인증',
      quote: '거리가 적은 날에도 배운 점 한 줄을 쓰니 “오늘도 했다”는 기분이 들었어요.',
    },
    {
      name: '참가자 B (예시)',
      meta: '중급 · 누적 OO,OOOm',
      quote: '기록을 다시 읽어 보니 같은 실수를 반복하고 있었다는 걸 알게 됐어요.',
    },
    {
      name: '참가자 C (예시)',
      meta: '상급 · 4주 완주',
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
        '괜찮아요. 매일이 아니라 평일(월~금) 중 주 3~5회만 인증하면 그 주는 성공이에요. 하루 놓쳐도 같은 주의 다른 평일에 채우면 돼요.',
    },
    {
      question: '주말이나 수영장에 못 가는 날은요?',
      answer:
        '주말은 인증하지 않고 쉬어요. 평일에도 못 가는 날은 쉬고, 갈 수 있는 날에 주 3회 이상만 채우면 돼요. 수영장 휴무 주간 등 세부 운영 방식은 시작 전 안내드릴게요. (플레이스홀더 답변)',
    },
    {
      question: '초급인데 배운 게 없으면요?',
      answer:
        '그런 날은 헤엄친 거리만 기록해도 성공이에요. 그래도 “오늘 물에 뜨는 느낌이 조금 달랐다”처럼 작은 감각도 훌륭한 배움 기록이 될 수 있어요.',
    },
    {
      question: '다른 참여자가 제 기록을 볼 수 있나요?',
      answer:
        '네. 서로 자극을 주고받을 수 있도록 주간 진행판에 닉네임과 기록이 함께 보여요. 공개 범위 등 세부 정책은 시작 전 안내드릴게요. (플레이스홀더 답변)',
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
  frequencyLabel: '지금 수영은 어느 정도 하고 계세요?',
  frequencyOptions: {
    once: '주 1회',
    'two-three': '주 2~3회',
    five: '주 5회',
    six: '주 6회',
  } satisfies Record<SwimFrequency, string>,
  levelLabel: '지금 수영 강습 등록을 하셨다면 레벨은?',
  levelHint: '강습을 듣지 않으면 비워 두셔도 돼요. 위에서 난이도를 고르면 여기에도 반영돼요.',
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
  agreeTitle: '개인정보 수집·이용 동의',
  agreeLabel: '동의합니다.',
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
