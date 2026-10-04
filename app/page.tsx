'use client';

import { useEffect, useState } from 'react';
import { getRepositories } from '@/db';

export default function HomePage() {
  const [wordCount, setWordCount] = useState<number | null>(null);

  useEffect(() => {
    getRepositories().words.count().then(setWordCount);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold">매일 영단어</h1>
      <p className="mt-2 text-slate-600">
        {wordCount === null ? '단어 수를 확인하는 중…' : `저장된 단어 ${wordCount}개`}
      </p>
    </section>
  );
}
