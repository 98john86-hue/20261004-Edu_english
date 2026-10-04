import type { VocabDatabase } from '@/db/database';
import type { Word, WordLevel } from '@/lib/types';
import {
  ReadonlyWordError,
  WordNotFoundError,
  type NewWordInput,
  type WordRepository,
  type WordUpdate,
} from './types';

export interface WordRepositoryOptions {
  generateId?: () => string;
  now?: () => Date;
}

export function createWordRepository(
  db: VocabDatabase,
  options: WordRepositoryOptions = {},
): WordRepository {
  const generateId = options.generateId ?? (() => crypto.randomUUID());
  const now = options.now ?? (() => new Date());

  return {
    getAll: () => db.words.orderBy('createdAt').toArray(),

    getById: (id) => db.words.get(id),

    async getByIds(ids) {
      const words = await db.words.bulkGet(ids);
      return words.filter((word): word is Word => word !== undefined);
    },

    getByLevel: (level: WordLevel) => db.words.where('level').equals(level).toArray(),

    findByTerm: (term) => db.words.where('term').equalsIgnoreCase(term.trim()).toArray(),

    count: () => db.words.count(),

    async add(input: NewWordInput) {
      const word: Word = {
        id: generateId(),
        term: input.term,
        meaning: input.meaning,
        level: input.level,
        source: 'user',
        createdAt: now().toISOString(),
        ...(input.example ? { example: input.example } : {}),
      };
      await db.words.add(word);
      return word;
    },

    async update(id: string, changes: WordUpdate) {
      return db.transaction('rw', db.words, async () => {
        const existing = await db.words.get(id);
        if (!existing) throw new WordNotFoundError(id);
        if (existing.source === 'builtin') throw new ReadonlyWordError();
        const updated: Word = { ...existing, ...changes };
        if (!updated.example) delete updated.example;
        await db.words.put(updated);
        return updated;
      });
    },

    async delete(id: string) {
      await db.transaction('rw', db.words, db.reviews, async () => {
        const existing = await db.words.get(id);
        if (!existing) throw new WordNotFoundError(id);
        if (existing.source === 'builtin') throw new ReadonlyWordError();
        await db.words.delete(id);
        await db.reviews.delete(id);
      });
    },
  };
}
