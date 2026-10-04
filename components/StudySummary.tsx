import Link from 'next/link';
import { accuracyPercent } from '@/lib/stats';

interface StudySummaryProps {
  reviewedCount: number;
  correctCount: number;
  remainingNewCount: number;
  onMoreNewWords: () => void;
}

export function StudySummary({ reviewedCount, correctCount, remainingNewCount, onMoreNewWords }: StudySummaryProps) {
  return (
    <section aria-labelledby="study-summary-title" className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h2 id="study-summary-title" className="text-2xl font-bold">
        학습 완료! 👏
      </h2>
      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">학습한 카드</dt>
          <dd className="mt-1 text-3xl font-bold">{reviewedCount}개</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">정답률</dt>
          <dd className="mt-1 text-3xl font-bold">{accuracyPercent(correctCount, reviewedCount)}%</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col gap-2">
        {remainingNewCount > 0 && (
          <button
            type="button"
            onClick={onMoreNewWords}
            className="min-h-11 rounded-2xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700"
          >
            새 단어 더 학습하기
          </button>
        )}
        <Link href="/" className="flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 px-4 font-medium">
          홈으로
        </Link>
      </div>
    </section>
  );
}
