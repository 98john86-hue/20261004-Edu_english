import { afterEach, describe, expect, it } from 'vitest';
import type { VocabDatabase } from './database';
import { SAMPLE_WORDS, seedBuiltinWords } from './seed';
import { createTestDatabase } from './testUtils';

describe('seedBuiltinWords', () => {
  let db: VocabDatabase;

  afterEach(async () => {
    await db.delete();
  });

  it('첫 실행 시 샘플 단어 60개를 넣는다', async () => {
    db = createTestDatabase();
    expect(await seedBuiltinWords(db)).toBe(true);
    expect(await db.words.count()).toBe(60);
    const all = await db.words.toArray();
    expect(all.every((word) => word.source === 'builtin')).toBe(true);
  });

  it('두 번 실행해도 중복 삽입하지 않는다', async () => {
    db = createTestDatabase();
    await seedBuiltinWords(db);
    expect(await seedBuiltinWords(db)).toBe(false);
    expect(await db.words.count()).toBe(60);
  });

  it('동시에 실행돼도 중복이 생기지 않는다', async () => {
    db = createTestDatabase();
    const results = await Promise.all([seedBuiltinWords(db), seedBuiltinWords(db)]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await db.words.count()).toBe(60);
  });

  it('사용자가 내장 단어를 지울 수 없으므로 재시드 후에도 사용자 단어를 건드리지 않는다', async () => {
    db = createTestDatabase();
    await seedBuiltinWords(db);
    await db.words.add({
      id: 'user-1',
      term: 'custom',
      meaning: '사용자 단어',
      level: 'beginner',
      source: 'user',
      createdAt: new Date().toISOString(),
    });
    await seedBuiltinWords(db);
    expect(await db.words.count()).toBe(61);
  });
});

describe('SAMPLE_WORDS', () => {
  it('레벨별로 20개씩, 영어 단어와 id가 모두 고유하다', () => {
    expect(SAMPLE_WORDS).toHaveLength(60);
    for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
      expect(SAMPLE_WORDS.filter((word) => word.level === level)).toHaveLength(20);
    }
    expect(new Set(SAMPLE_WORDS.map((word) => word.id)).size).toBe(60);
    expect(new Set(SAMPLE_WORDS.map((word) => word.term.toLowerCase())).size).toBe(60);
  });

  it('모든 단어에 뜻과 예문이 있고, 예문에 해당 단어가 들어간다', () => {
    for (const word of SAMPLE_WORDS) {
      expect(word.meaning.trim()).not.toBe('');
      expect(word.example.trim()).not.toBe('');
      const stem = word.term.slice(0, Math.max(4, word.term.length - 2)).toLowerCase();
      expect(word.example.toLowerCase(), word.term).toContain(stem);
    }
  });
});
