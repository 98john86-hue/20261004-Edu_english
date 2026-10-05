import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRepositories, setRepositoriesForTesting } from '@/db';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { saveSettings } from '@/lib/settings';
import { makeState, makeWord } from '@/lib/testFixtures';
import { StudySession } from './StudySession';

vi.mock('next/navigation', () => ({ usePathname: () => '/study' }));

const WORDS = [
  makeWord('w1', { term: 'borrow', meaning: '빌리다', example: 'Can I borrow your pen?' }),
  makeWord('w2', { term: 'carry', meaning: '나르다' }),
  makeWord('w3', { term: 'cheap', meaning: '값이 싼' }),
];

let db: VocabDatabase;

async function setup(words = WORDS) {
  await db.words.bulkAdd(words);
  const user = userEvent.setup();
  render(<StudySession />);
  await screen.findByLabelText('카드 앞면');
  return user;
}

function currentTerm(): string {
  return within(screen.getByRole('article')).getByRole('heading', { level: 2 }).textContent ?? '';
}

async function gradeWithKeyboard(user: ReturnType<typeof userEvent.setup>, key: string) {
  const before = screen.queryByLabelText('진행 상황')?.textContent;
  await user.keyboard(' ');
  await user.keyboard(key);
  await waitFor(() => {
    const finished = screen.queryByRole('heading', { name: /학습 완료/ });
    expect(finished ?? screen.getByLabelText('진행 상황').textContent !== before).toBeTruthy();
    if (!finished) expect(screen.getByLabelText('카드 앞면')).toBeInTheDocument();
  });
}

function progressText(): string {
  return screen.getByLabelText('진행 상황').textContent ?? '';
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 4, 12, 0, 0));
  db = createTestDatabase();
  setRepositoriesForTesting(createRepositories(db));
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
  setRepositoriesForTesting(null);
  await db.delete();
});

describe('StudySession: 뒤집기', () => {
  it('처음에는 앞면(단어)만 보이고, 정답 보기를 누르면 뜻과 예문, 평가 버튼이 나온다', async () => {
    const user = await setup();
    expect(screen.queryByRole('group', { name: '기억한 정도 평가' })).not.toBeInTheDocument();
    const word = WORDS.find((w) => w.term === currentTerm());
    expect(screen.queryByText(word?.meaning ?? '')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /정답 보기/ }));

    expect(screen.getByLabelText('카드 뒷면')).toBeInTheDocument();
    expect(screen.getByText(word?.meaning ?? '')).toBeInTheDocument();
    const grades = within(screen.getByRole('group', { name: '기억한 정도 평가' })).getAllByRole('button');
    expect(grades.map((button) => button.textContent)).toEqual([
      '다시내일 · 1',
      '어려움내일 · 2',
      '보통내일 · 3',
      '쉬움내일 · 4',
    ]);
  });

  it('카드를 눌러도 뒤집힌다', async () => {
    const user = await setup();
    await user.click(screen.getByRole('article'));
    expect(screen.getByLabelText('카드 뒷면')).toBeInTheDocument();
  });
});

describe('StudySession: 평가 후 다음 카드', () => {
  it('평가하면 SM-2 결과를 저장하고 다음 카드로 넘어간다', async () => {
    const user = await setup();
    const first = currentTerm();
    expect(progressText()).toBe('1 / 3');

    await user.click(screen.getByRole('button', { name: /정답 보기/ }));
    await user.click(screen.getByRole('button', { name: /^보통/ }));

    await waitFor(() => expect(progressText()).toBe('2 / 3'));
    expect(currentTerm()).not.toBe(first);
    expect(screen.getByLabelText('카드 앞면')).toBeInTheDocument();

    const wordId = WORDS.find((w) => w.term === first)?.id ?? '';
    expect(await db.reviews.get(wordId)).toMatchObject({
      repetitions: 1,
      interval: 1,
      dueDate: '2026-10-05',
      lastReviewedAt: '2026-10-04',
    });
    expect(await db.studyLogs.get('2026-10-04')).toEqual({ date: '2026-10-04', reviewedCount: 1, correctCount: 1 });
  });

  it('다시(0)를 누른 카드는 이번 세션에 다시 나오지 않고 오답으로 집계된다', async () => {
    const user = await setup([WORDS[0]]);
    await user.click(screen.getByRole('button', { name: /정답 보기/ }));
    await user.click(screen.getByRole('button', { name: /^다시/ }));

    expect(await screen.findByRole('heading', { name: /학습 완료/ })).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(await db.reviews.get('w1')).toMatchObject({ repetitions: 0, interval: 1, dueDate: '2026-10-05' });
  });
});

describe('StudySession: 키보드 조작', () => {
  it('Space로 뒤집고 1~4로 평가해 키보드만으로 세션을 끝낸다', async () => {
    const user = await setup();

    for (const [index, key] of ['1', '3', '4'].entries()) {
      expect(progressText()).toBe(`${index + 1} / 3`);
      await user.keyboard(' ');
      expect(screen.getByLabelText('카드 뒷면')).toBeInTheDocument();
      await user.keyboard(key);
      if (index < 2) await waitFor(() => expect(progressText()).toBe(`${index + 2} / 3`));
    }

    expect(await screen.findByRole('heading', { name: /학습 완료/ })).toBeInTheDocument();
    expect(screen.getByText('3개')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(await db.reviews.count()).toBe(3);
    expect(await db.studyLogs.get('2026-10-04')).toMatchObject({ reviewedCount: 3, correctCount: 2 });
  });

  it('뒤집기 전에는 숫자 키를 무시한다', async () => {
    const user = await setup();
    await user.keyboard('3');
    expect(progressText()).toBe('1 / 3');
    expect(await db.reviews.count()).toBe(0);
  });

  it('Space를 다시 누르면 앞면으로 돌아간다', async () => {
    const user = await setup();
    await user.keyboard(' ');
    await user.keyboard(' ');
    expect(screen.getByLabelText('카드 앞면')).toBeInTheDocument();
  });

  it('정답 보기 버튼에 포커스가 있어도 Space 한 번에 한 번만 뒤집힌다', async () => {
    const user = await setup();
    screen.getByRole('button', { name: /정답 보기/ }).focus();
    await user.keyboard(' ');
    expect(screen.getByLabelText('카드 뒷면')).toBeInTheDocument();
  });

  it('P를 누르면 현재 단어를 en-US로 읽는다 (한글 입력 상태 포함)', async () => {
    const speakSpy = vi.fn();
    vi.stubGlobal('speechSynthesis', { speak: speakSpy, cancel: vi.fn() });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        lang = '';
        rate = 1;
        constructor(public text: string) {}
      },
    );
    const user = await setup();
    await user.keyboard('p');
    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toMatchObject({ text: currentTerm(), lang: 'en-US' });

    fireEvent.keyDown(document.body, { key: 'ㅔ', code: 'KeyP' });
    expect(speakSpy).toHaveBeenCalledTimes(2);
  });

  it('설정 선택 상자에 포커스가 있으면 단축키가 동작하지 않는다', async () => {
    const user = await setup();
    screen.getByRole('combobox').focus();
    await user.keyboard(' ');
    expect(screen.getByLabelText('카드 앞면')).toBeInTheDocument();
  });
});

describe('StudySession: 새 단어 한도와 빈 상태', () => {
  it('하루 새 단어 한도만큼만 내고, 끝나면 새 단어 더 학습하기로 이어 간다', async () => {
    saveSettings({ newWordsPerDay: 5 });
    const words = Array.from({ length: 7 }, (_, i) => makeWord(`n${i}`, { term: `word${i}` }));
    const user = await setup(words);
    expect(progressText()).toBe('1 / 5');

    for (let i = 0; i < 5; i += 1) await gradeWithKeyboard(user, '3');
    await screen.findByRole('heading', { name: /학습 완료/ });
    expect(await db.meta.get('newWords:2026-10-04')).toEqual({ key: 'newWords:2026-10-04', value: '5' });

    await user.click(screen.getByRole('button', { name: '새 단어 더 학습하기' }));
    await screen.findByLabelText('카드 앞면');
    expect(progressText()).toBe('1 / 2');
  });

  it('복습할 카드가 없으면 축하 메시지와 새 단어 더 학습하기 버튼을 보여 준다', async () => {
    saveSettings({ newWordsPerDay: 5 });
    await db.words.bulkAdd([makeWord('old'), makeWord('fresh', { term: 'fresh' })]);
    await db.reviews.put(makeState('old', '2026-10-10'));
    await db.meta.put({ key: 'newWords:2026-10-04', value: '5' });

    const user = userEvent.setup();
    render(<StudySession />);
    expect(await screen.findByRole('heading', { name: '오늘 복습을 모두 마쳤어요!' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '새 단어 더 학습하기' }));
    await screen.findByLabelText('카드 앞면');
    expect(currentTerm()).toBe('fresh');
  });

  it('새 단어도 남지 않았으면 단어 추가를 안내한다', async () => {
    await db.words.bulkAdd([makeWord('old')]);
    await db.reviews.put(makeState('old', '2026-10-10'));
    render(<StudySession />);
    expect(await screen.findByRole('heading', { name: '오늘 복습을 모두 마쳤어요!' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '새 단어 더 학습하기' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '단어를 추가' })).toHaveAttribute('href', '/words');
  });

  it('dueDate가 지난 카드는 복습 카드로 나온다', async () => {
    saveSettings({ newWordsPerDay: 5 });
    await db.words.bulkAdd([makeWord('due', { term: 'due' })]);
    await db.reviews.put(makeState('due', '2026-10-01', { interval: 3, repetitions: 2 }));
    await db.meta.put({ key: 'newWords:2026-10-04', value: '5' });
    const user = userEvent.setup();
    render(<StudySession />);
    await screen.findByLabelText('카드 앞면');
    expect(currentTerm()).toBe('due');
    expect(screen.queryByText('새 단어')).not.toBeInTheDocument();
    await gradeWithKeyboard(user, '3');
    await screen.findByRole('heading', { name: /학습 완료/ });
    expect(await db.reviews.get('due')).toMatchObject({ interval: 8, repetitions: 3, dueDate: '2026-10-12' });
  });
});
