'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRepositories } from '@/db';

export default function HomePage() {
  const [wordCount, setWordCount] = useState<number | null>(null);

  useEffect(() => {
    getRepositories().words.count().then(setWordCount);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">매일 영단어</h1>
      <p className="text-slate-600">
        {wordCount === null ? '단어 수를 확인하는 중…' : `저장된 단어 ${wordCount}개`}
      </p>
      <Link
        href="/study"
        className="flex min-h-14 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-semibold text-white hover:bg-indigo-700"
      >
        오늘의 학습 시작
      </Link>
    </section>
  );
}
