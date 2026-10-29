import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFirebaseConfig } from '@/lib/firebase/config';

const addDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => addDoc(...args),
  collection: (_db: unknown, name: string) => ({ name }),
  serverTimestamp: () => 'SERVER_TIME',
  getFirestore: () => ({}),
  doc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
}));
vi.mock('@/lib/firebase/client', () => ({ getDb: () => ({}) }));

describe('readFirebaseConfig', () => {
  it('필수 값이 하나라도 없으면 null (연습용 mock으로 동작)', () => {
    expect(readFirebaseConfig({})).toBeNull();
    expect(readFirebaseConfig({ apiKey: 'k', projectId: 'p' })).toBeNull();
  });

  it('apiKey, projectId, appId가 있으면 설정을 만든다', () => {
    expect(readFirebaseConfig({ apiKey: 'k', projectId: 'p', appId: 'a' })).toMatchObject({
      apiKey: 'k',
      projectId: 'p',
      appId: 'a',
    });
  });
});

describe('saveSignup', () => {
  beforeEach(() => addDoc.mockReset());

  it('signups 모음에 저장하고, 비어 있는 선택 항목은 넣지 않는다', async () => {
    const { saveSignup } = await import('@/lib/firebase/signups');
    await saveSignup({ name: '물개', phone: '01012345678', email: 'a@example.com', frequency: 'once', agreed: true });
    expect(addDoc).toHaveBeenCalledWith(
      { name: 'signups' },
      { name: '물개', phone: '01012345678', email: 'a@example.com', frequency: 'once', agreed: true, createdAt: 'SERVER_TIME' },
    );
  });

  it('입력한 선택 항목은 함께 저장한다', async () => {
    const { saveSignup } = await import('@/lib/firebase/signups');
    await saveSignup({
      name: '물개',
      phone: '01012345678',
      email: 'a@example.com',
      frequency: 'five',
      level: 'advanced',
      goal: '접영 완성',
      referral: 'blog',
      agreed: true,
    });
    expect(addDoc.mock.calls[0]?.[1]).toMatchObject({ level: 'advanced', goal: '접영 완성', referral: 'blog' });
  });
});

describe('toSwimLogs', () => {
  it('Firestore 문서를 기록으로 바꾸고, 모양이 다른 값은 건너뛴다', async () => {
    const { toSwimLogs } = await import('@/lib/firebase/checkins');
    expect(
      toSwimLogs('2026-11-02', { distance: { laneLength: 25, laps: 6 }, learning: { note: '호흡', stroke: '자유형' } }),
    ).toEqual([
      { type: 'distance', date: '2026-11-02', laneLength: 25, laps: 6 },
      { type: 'learning', date: '2026-11-02', note: '호흡', stroke: '자유형' },
    ]);
    expect(toSwimLogs('2026-11-02', { distance: { laneLength: '25' }, learning: { stroke: '자유형' } })).toEqual([]);
    expect(toSwimLogs('2026-11-02', null)).toEqual([]);
  });
});
