import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { VocabDatabase } from '@/db/database';
import { seedBuiltinWords } from '@/db/seed';
import { createTestDatabase } from '@/db/testUtils';
import { ReadonlyWordError, WordNotFoundError, type WordRepository } from './types';
import { createWordRepository } from './wordRepository';

describe('wordRepository', () => {
  let db: VocabDatabase;
  let repo: WordRepository;
  let nextId: number;

  beforeEach(async () => {
    db = createTestDatabase();
    nextId = 0;
    repo = createWordRepository(db, {
      generateId: () => `user-${++nextId}`,
      now: () => new Date('2026-10-04T09:00:00Z'),
    });
    await seedBuiltinWords(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it('사용자 단어를 추가하면 source가 user로 저장된다', async () => {
    const word = await repo.add({ term: 'sunrise', meaning: '일출', level: 'beginner' });
    expect(word).toEqual({
      id: 'user-1',
      term: 'sunrise',
      meaning: '일출',
      level: 'beginner',
      source: 'user',
      createdAt: '2026-10-04T09:00:00.000Z',
    });
    expect(await repo.count()).toBe(61);
  });

  it('findByTerm은 대소문자와 앞뒤 공백을 무시한다', async () => {
    const found = await repo.findByTerm('  Borrow ');
    expect(found.map((word) => word.id)).toEqual(['builtin-b01']);
  });

  it('레벨별, id 목록으로 조회할 수 있다', async () => {
    expect(await repo.getByLevel('advanced')).toHaveLength(20);
    const words = await repo.getByIds(['builtin-b01', 'missing', 'builtin-a01']);
    expect(words.map((word) => word.term)).toEqual(['borrow', 'ambiguous']);
  });

  it('사용자 단어를 수정할 수 있고, 예문을 비우면 필드가 사라진다', async () => {
    const word = await repo.add({ term: 'tide', meaning: '조수', example: 'The tide is high.', level: 'intermediate' });
    const updated = await repo.update(word.id, { meaning: '밀물과 썰물', example: '' });
    expect(updated.meaning).toBe('밀물과 썰물');
    expect(updated).not.toHaveProperty('example');
    expect(await repo.getById(word.id)).toEqual(updated);
  });

  it('내장 단어는 수정·삭제할 수 없다', async () => {
    await expect(repo.update('builtin-b01', { meaning: 'x' })).rejects.toBeInstanceOf(ReadonlyWordError);
    await expect(repo.delete('builtin-b01')).rejects.toBeInstanceOf(ReadonlyWordError);
    expect(await repo.getById('builtin-b01')).toBeDefined();
  });

  it('없는 단어는 WordNotFoundError', async () => {
    await expect(repo.update('nope', { meaning: 'x' })).rejects.toBeInstanceOf(WordNotFoundError);
  });

  it('사용자 단어를 삭제하면 복습 상태도 함께 지운다', async () => {
    const word = await repo.add({ term: 'tide', meaning: '조수', level: 'intermediate' });
    await db.reviews.put({ wordId: word.id, easeFactor: 2.5, interval: 1, repetitions: 1, dueDate: '2026-10-05' });
    await repo.delete(word.id);
    expect(await repo.getById(word.id)).toBeUndefined();
    expect(await db.reviews.get(word.id)).toBeUndefined();
  });
});
