'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRepositories } from '@/db';
import { summarizeDashboard, type DashboardSummary } from '@/lib/dashboard';
import { todayLocal } from '@/lib/date';
import { loadSettings } from '@/lib/settings';
import { StatCard } from './StatCard';
import { WeeklyChart } from './WeeklyChart';

async function loadDashboard(): Promise<DashboardSummary> {
  const repos = getRepositories();
  const today = todayLocal();
  const [dueCount, totalWords, studiedWords, newWordsIntroducedToday, logs] = await Promise.all([
    repos.reviews.countDue(today),
    repos.words.count(),
    repos.reviews.count(),
    repos.dailyProgress.getNewWordCount(today),
    repos.studyLogs.getAll(),
  ]);
  return summarizeDashboard({
    today,
    dueCount,
    totalWords,
    studiedWords,
    newWordsPerDay: loadSettings().newWordsPerDay,
    newWordsIntroducedToday,
    logs,
  });
}

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadDashboard().then(
      (result) => active && setSummary(result),
      () => active && setFailed(true),
    );
    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return (
      <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-rose-700">
        학습 현황을 불러오지 못했어요.
      </p>
    );
  }

  if (!summary) {
    return (
      <p role="status" className="py-16 text-center text-slate-500">
        학습 현황을 불러오는 중…
      </p>
    );
  }

  const allDone = summary.dueCount === 0 && summary.newWordsAvailable === 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">매일 영단어</h1>

      <section aria-labelledby="today-title" className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm">
        <h2 id="today-title" className="text-sm font-medium text-indigo-100">
          오늘 복습할 카드
        </h2>
        <p className="mt-1 text-6xl font-bold" aria-describedby="today-hint">
          {summary.dueCount}
          <span className="ml-1 text-2xl font-semibold">개</span>
        </p>
        <p id="today-hint" className="mt-1 text-sm text-indigo-100">
          {allDone
            ? '오늘 할 학습을 모두 마쳤어요! 🎉'
            : summary.newWordsAvailable > 0
              ? `새 단어 ${summary.newWordsAvailable}개도 기다리고 있어요`
              : '복습부터 차근차근 해 볼까요?'}
        </p>
        <Link
          href="/study"
          className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          {allDone ? '새 단어 더 학습하기' : '학습 시작'}
        </Link>
      </section>

      <dl className="grid grid-cols-2 gap-3">
        <StatCard
          label="연속 학습일"
          value={`🔥 ${summary.streak}일`}
          hint={summary.todayReviewed > 0 ? `오늘 ${summary.todayReviewed}개 학습` : '오늘 학습하면 이어져요'}
        />
        <StatCard label="전체 단어" value={`${summary.totalWords}개`} hint="기본 + 내 단어" />
      </dl>

      <WeeklyChart days={summary.week} />

      <Link
        href="/quiz"
        className="flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50"
      >
        ✏️ 뜻 고르기 퀴즈 풀기
      </Link>
    </div>
  );
}
