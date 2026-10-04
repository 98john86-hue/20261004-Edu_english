import { createDatabase, type VocabDatabase } from './database';

let counter = 0;

export function createTestDatabase(): VocabDatabase {
  counter += 1;
  return createDatabase(`test-db-${counter}-${Date.now()}`);
}
