import { afterEach, describe, expect, it, vi } from 'vitest';

describe('initDatabase', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('DB를 열고 샘플 단어를 한 번만 넣는다', async () => {
    const { initDatabase, getRepositories } = await import('./index');
    await Promise.all([initDatabase(), initDatabase()]);
    await initDatabase();
    expect(await getRepositories().words.count()).toBe(60);
  });

  // Dexie는 로드 시점의 indexedDB를 붙잡아 두므로, 전역을 비우는 테스트는 마지막에 둔다.
  it('indexedDB가 없으면 StorageUnavailableError로 실패한다', async () => {
    vi.stubGlobal('indexedDB', undefined);
    const { initDatabase, StorageUnavailableError } = await import('./index');
    await expect(initDatabase()).rejects.toBeInstanceOf(StorageUnavailableError);
  });
});
