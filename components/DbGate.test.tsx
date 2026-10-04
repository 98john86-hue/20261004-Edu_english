import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('DbGate', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/db');
  });

  it('DB 준비가 끝나면 자식을 보여 준다', async () => {
    vi.doMock('@/db', () => ({ initDatabase: () => Promise.resolve() }));
    const { DbGate } = await import('./DbGate');
    render(<DbGate>학습 화면</DbGate>);
    expect(screen.getByRole('status')).toHaveTextContent('불러오는 중');
    expect(await screen.findByText('학습 화면')).toBeInTheDocument();
  });

  it('IndexedDB를 열 수 없으면 앱 대신 안내 메시지를 보여 준다', async () => {
    vi.doMock('@/db', () => ({ initDatabase: () => Promise.reject(new Error('blocked')) }));
    const { DbGate } = await import('./DbGate');
    render(<DbGate>학습 화면</DbGate>);
    expect(await screen.findByRole('alert')).toHaveTextContent('저장소를 사용할 수 없어요');
    expect(screen.queryByText('학습 화면')).not.toBeInTheDocument();
  });
});
