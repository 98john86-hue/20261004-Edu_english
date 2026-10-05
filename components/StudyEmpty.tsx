import Link from 'next/link';

interface StudyEmptyProps {
  remainingNewCount: number;
  onMoreNewWords: () => void;
}

export function StudyEmpty({ remainingNewCount, onMoreNewWords }: StudyEmptyProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p aria-hidden="true" className="text-5xl">
        🎉
      </p>
      <h2 className="mt-3 text-2xl font-bold">오늘 복습을 모두 마쳤어요!</h2>
      {remainingNewCount > 0 ? (
        <>
          <p className="mt-2 text-slate-600">꾸준함이 실력이 됩니다. 조금 더 해 볼까요?</p>
          <button
            type="button"
            onClick={onMoreNewWords}
            className="mt-6 min-h-11 w-full rounded-2xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700"
          >
            새 단어 더 학습하기
          </button>
        </>
      ) : (
        <p className="mt-2 text-slate-600">
          새로 배울 단어도 모두 학습했어요.{' '}
          <Link href="/words" className="font-medium text-indigo-600 underline">
            단어를 추가
          </Link>
          해 보세요.
        </p>
      )}
    </section>
  );
}
