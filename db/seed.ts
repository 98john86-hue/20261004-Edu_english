import sampleWords from '@/data/sampleWords.json';
import type { Word, WordLevel } from '@/lib/types';
import type { VocabDatabase } from './database';

interface SampleWord {
  id: string;
  term: string;
  meaning: string;
  example: string;
  level: WordLevel;
}

export const SEED_META_KEY = 'builtinSeedVersion';
export const SEED_VERSION = '1';

export const SAMPLE_WORDS: readonly SampleWord[] = sampleWords as SampleWord[];

// 여러 탭이 동시에 첫 실행돼도 안전하도록 플래그 확인과 삽입을 한 트랜잭션에서 처리한다.
// id가 고정이라 bulkPut이 같은 레코드를 덮어쓸 뿐 중복이 생기지 않는다.
export async function seedBuiltinWords(
  db: VocabDatabase,
  now: () => Date = () => new Date(),
): Promise<boolean> {
  return db.transaction('rw', db.words, db.meta, async () => {
    const seeded = await db.meta.get(SEED_META_KEY);
    if (seeded) return false;

    const createdAt = now().toISOString();
    const words: Word[] = SAMPLE_WORDS.map((sample) => ({
      ...sample,
      source: 'builtin',
      createdAt,
    }));
    await db.words.bulkPut(words);
    await db.meta.put({ key: SEED_META_KEY, value: SEED_VERSION });
    return true;
  });
}
