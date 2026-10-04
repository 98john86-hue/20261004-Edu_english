import Link from 'next/link';
import { wrongAnswers, type QuizAnswer } from '@/lib/quiz';
import { accuracyPercent } from '@/lib/stats';

interface QuizResultProps {
  answers: readonly QuizAnswer[];
  onRestart: () => void;
}

export function QuizResult({ answers, onRestart }: QuizResultProps) {
  const correctCount = answers.filter((answer) => answer.correct).length;
  const wrong = wrongAnswers(answers);

  return (
    <section aria-labelledby="quiz-result-title" className="flex flex-col gap-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 id="quiz-result-title" className="text-2xl font-bold">
          퀴즈 결과
        </h2>
        <p className="mt-4 text-4xl font-bold">
          {answers.length}문제 중 {correctCount}개 정답
        </p>
        <p className="mt-1 text-slate-500">정답률 {accuracyPercent(correctCount, answers.length)}%</p>
      </div>

      {wrong.length > 0 ? (
        <section aria-labelledby="wrong-title" className="rounded-3xl border border-slate-200 bg-white p-4">
          <h3 id="wrong-title" className="mb-2 font-semibold">
            틀린 단어 {wrong.length}개
          </h3>
          <ul aria-label="틀린 단어" className="divide-y divide-slate-100">
            {wrong.map(({ question, selectedIndex }) => (
              <li key={question.word.id} className="py-3">
                <p lang="en" className="text-lg font-semibold">
                  {question.word.term}
                </p>
                <p className="text-emerald-700">정답: {question.word.meaning}</p>
                <p className="text-sm text-rose-600">내 답: {question.choices[selectedIndex]}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rounded-2xl bg-emerald-50 p-4 text-center text-emerald-800">모두 맞혔어요! 🎉</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-11 flex-1 rounded-2xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700"
        >
          다시 풀기
        </button>
        <Link href="/" className="flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-slate-300 px-4 font-medium">
          홈으로
        </Link>
      </div>
    </section>
  );
}
