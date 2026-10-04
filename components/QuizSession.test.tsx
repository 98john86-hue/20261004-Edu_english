import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRepositories, setRepositoriesForTesting } from '@/db';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { makeState, makeWord } from '@/lib/testFixtures';
import type { Word, WordLevel } from '@/lib/types';
import { QuizSession } from './QuizSession';

const LEVELS: WordLevel[] = ['beginner', 'intermediate', 'advanced'];
const WORDS: Word[] = LEVELS.flatMap((level) =>
  Array.from({ length: 8 }, (_, i) => makeWord(`${level}-${i}`, { level, term: `${level}${i}`, meaning: `${level}뜻${i}` })),
);
const BY_TERM = new Map(WORDS.map((word) => [word.term, word]));

let db: VocabDatabase;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 4, 12));
  db = createTestDatabase();
  setRepositoriesForTesting(createRepositories(db));
});

afterEach(async () => {
  vi.useRealTimers();
  setRepositoriesForTesting(null);
  await db.delete();
});

async function setup(words: Word[] = WORDS) {
  await db.words.bulkAdd(words);
  const user = userEvent.setup();
  render(<QuizSession />);
  return user;
}

function currentWord(): Word {
  const term = screen.getByRole('heading', { level: 2 }).textContent ?? '';
  const word = BY_TERM.get(term);
  if (!word) throw new Error(`unknown term ${term}`);
  return word;
}

function choiceButtons(): HTMLElement[] {
  return within(screen.getByRole('list', { name: '보기' })).getAllByRole('button');
}

function choiceTexts(): string[] {
  return choiceButtons().map((button) => button.textContent?.replace(/^\d/, '') ?? '');
}

function correctChoiceKey(): string {
  return String(choiceTexts().indexOf(currentWord().meaning) + 1);
}

function wrongChoiceKey(): string {
  return String(choiceTexts().findIndex((text) => text !== currentWord().meaning) + 1);
}

async function waitForQuestion(number: number) {
  await waitFor(() => expect(screen.getByLabelText('진행 상황')).toHaveTextContent(`${number} / 10`));
}

describe('QuizSession', () => {
  it('영어 단어와 4개의 뜻 보기를 보여 주고, 오답 보기는 같은 레벨에서 고른다', async () => {
    await setup();
    await waitForQuestion(1);
    const word = currentWord();
    const choices = choiceTexts();
    expect(choices).toHaveLength(4);
    expect(choices).toContain(word.meaning);
    expect(new Set(choices).size).toBe(4);
    expect(choices.every((meaning) => meaning.startsWith(word.level))).toBe(true);
  });

  it('정답을 고르면 정답 표시, 오답이면 정답을 알려 주고 다음 문제로 넘어간다', async () => {
    const user = await setup();
    await waitForQuestion(1);
    await user.click(choiceButtons()[Number(correctChoiceKey()) - 1]);
    expect(screen.getByText('정답이에요!')).toBeInTheDocument();
    expect(choiceButtons().every((button) => (button as HTMLButtonElement).disabled)).toBe(true);

    await user.click(screen.getByRole('button', { name: /다음 문제/ }));
    await waitForQuestion(2);
    const word = currentWord();
    await user.click(choiceButtons()[Number(wrongChoiceKey()) - 1]);
    expect(screen.getByText(`아쉬워요. 정답은 ‘${word.meaning}’`)).toBeInTheDocument();
  });

  it('10문제를 풀면 점수와 틀린 단어 목록을 보여 준다 (키보드 1~4, Enter)', async () => {
    const user = await setup();
    const missed: Word[] = [];
    for (let i = 1; i <= 10; i += 1) {
      await waitForQuestion(i);
      const word = currentWord();
      if (i % 3 === 0) {
        missed.push(word);
        await user.keyboard(wrongChoiceKey());
      } else {
        await user.keyboard(correctChoiceKey());
      }
      await screen.findByRole('button', { name: i === 10 ? /결과 보기/ : /다음 문제/ });
      await user.keyboard('{Enter}');
    }

    expect(await screen.findByRole('heading', { name: '퀴즈 결과' })).toBeInTheDocument();
    expect(screen.getByText('10문제 중 7개 정답')).toBeInTheDocument();
    expect(screen.getByText('정답률 70%')).toBeInTheDocument();
    const wrongList = screen.getByRole('list', { name: '틀린 단어' });
    expect(within(wrongList).getAllByRole('listitem').map((item) => item.querySelector('[lang="en"]')?.textContent)).toEqual(
      missed.map((word) => word.term),
    );
    expect(within(wrongList).getByText(`정답: ${missed[0].meaning}`)).toBeInTheDocument();
  });

  it('퀴즈는 SM-2 복습 상태를 바꾸지 않고 StudyLog에만 기록한다', async () => {
    const studied = WORDS.slice(0, 12);
    const states = studied.map((word) => makeState(word.id, '2026-10-04', { interval: 3, repetitions: 2 }));
    await db.reviews.bulkPut(states);
    const user = await setup();

    for (let i = 1; i <= 10; i += 1) {
      await waitForQuestion(i);
      await user.keyboard(i <= 4 ? correctChoiceKey() : wrongChoiceKey());
      await screen.findByRole('button', { name: /다음 문제|결과 보기/ });
      await user.keyboard('{Enter}');
    }
    await screen.findByRole('heading', { name: '퀴즈 결과' });

    expect(await db.reviews.toArray()).toEqual(expect.arrayContaining(states));
    expect(await db.reviews.count()).toBe(12);
    expect(await db.studyLogs.get('2026-10-04')).toEqual({ date: '2026-10-04', reviewedCount: 10, correctCount: 4 });
  });

  it('학습한 단어를 우선 출제한다', async () => {
    const studiedIds = new Set(WORDS.filter((_, i) => i % 2 === 0).map((word) => word.id));
    await db.reviews.bulkPut([...studiedIds].map((id) => makeState(id, '2026-10-10')));
    const user = await setup();
    for (let i = 1; i <= 10; i += 1) {
      await waitForQuestion(i);
      expect(studiedIds.has(currentWord().id)).toBe(true);
      await user.keyboard('1');
      await screen.findByRole('button', { name: /다음 문제|결과 보기/ });
      await user.keyboard('{Enter}');
    }
  });

  it('다시 풀기로 새 퀴즈를 시작한다', async () => {
    const user = await setup();
    for (let i = 1; i <= 10; i += 1) {
      await waitForQuestion(i);
      await user.keyboard('1');
      await screen.findByRole('button', { name: /다음 문제|결과 보기/ });
      await user.keyboard('{Enter}');
    }
    await user.click(await screen.findByRole('button', { name: '다시 풀기' }));
    await waitForQuestion(1);
  });

  it('뜻이 다른 단어가 4개 미만이면 안내 메시지를 보여 준다', async () => {
    await setup(WORDS.slice(0, 3));
    expect(await screen.findByText(/단어가 4개 이상 필요해요/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '단어 추가하기' })).toHaveAttribute('href', '/words');
  });
});
