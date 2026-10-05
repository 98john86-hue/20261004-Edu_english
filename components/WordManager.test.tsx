import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRepositories, setRepositoriesForTesting } from '@/db';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { makeState, makeWord } from '@/lib/testFixtures';
import { WordManager } from './WordManager';

let db: VocabDatabase;

beforeEach(async () => {
  db = createTestDatabase();
  setRepositoriesForTesting(createRepositories(db));
  await db.words.bulkAdd([
    makeWord('b1', { term: 'borrow', meaning: '빌리다', level: 'beginner' }),
    makeWord('i1', { term: 'achieve', meaning: '달성하다', level: 'intermediate' }),
    makeWord('a1', { term: 'ambiguous', meaning: '모호한', level: 'advanced' }),
    makeWord('u1', { term: 'tide', meaning: '조수', level: 'beginner', source: 'user' }),
  ]);
});

afterEach(async () => {
  setRepositoriesForTesting(null);
  await db.delete();
});

async function setup() {
  const user = userEvent.setup();
  render(<WordManager />);
  await screen.findByRole('list', { name: '단어 목록' });
  return user;
}

function listedTerms(): string[] {
  return within(screen.getByRole('list', { name: '단어 목록' }))
    .getAllByRole('listitem')
    .map((item) => item.getAttribute('aria-label') ?? '');
}

describe('WordManager: 목록·검색·필터', () => {
  it('모든 단어를 알파벳순으로 보여 준다', async () => {
    await setup();
    expect(listedTerms()).toEqual(['achieve', 'ambiguous', 'borrow', 'tide']);
    expect(screen.getByText('단어 4개')).toBeInTheDocument();
  });

  it('영어나 한국어로 검색한다', async () => {
    const user = await setup();
    await user.type(screen.getByRole('searchbox', { name: '단어 검색' }), '모호');
    expect(listedTerms()).toEqual(['ambiguous']);
    expect(screen.getByText('4개 중 1개')).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox', { name: '단어 검색' }));
    await user.type(screen.getByRole('searchbox', { name: '단어 검색' }), 'zzz');
    expect(screen.getByText('조건에 맞는 단어가 없어요.')).toBeInTheDocument();
  });

  it('레벨로 거른다', async () => {
    const user = await setup();
    await user.click(screen.getByRole('button', { name: '초급' }));
    expect(screen.getByRole('button', { name: '초급' })).toHaveAttribute('aria-pressed', 'true');
    expect(listedTerms()).toEqual(['borrow', 'tide']);
  });

  it('기본 단어에는 수정·삭제 버튼이 없고, 사용자 단어에만 있다', async () => {
    await setup();
    const borrow = screen.getByRole('listitem', { name: 'borrow' });
    expect(within(borrow).queryByRole('button', { name: /수정|삭제/ })).not.toBeInTheDocument();
    const tide = screen.getByRole('listitem', { name: 'tide' });
    expect(within(tide).getByRole('button', { name: 'tide 수정' })).toBeInTheDocument();
    expect(within(tide).getByRole('button', { name: 'tide 삭제' })).toBeInTheDocument();
  });
});

describe('WordManager: 추가·수정·삭제', () => {
  it('새 단어를 추가하면 DB에 저장되고 목록에 나타난다', async () => {
    const user = await setup();
    await user.click(screen.getByRole('button', { name: '+ 단어 추가' }));
    const form = screen.getByRole('form', { name: '단어 추가' });
    await user.type(within(form).getByLabelText(/영어 단어/), ' sunrise ');
    await user.type(within(form).getByLabelText(/^뜻/), '일출');
    await user.click(within(form).getByRole('button', { name: '추가' }));

    expect(await screen.findByText('‘sunrise’을(를) 추가했어요.')).toBeInTheDocument();
    expect(screen.queryByRole('form', { name: '단어 추가' })).not.toBeInTheDocument();
    expect(listedTerms()).toContain('sunrise');
    const saved = await db.words.where('term').equals('sunrise').first();
    expect(saved).toMatchObject({ term: 'sunrise', meaning: '일출', source: 'user', level: 'beginner' });
  });

  it('이미 있는 단어를 추가하려 하면 DB 기준으로 경고한다', async () => {
    const user = await setup();
    await user.click(screen.getByRole('button', { name: '+ 단어 추가' }));
    const form = screen.getByRole('form', { name: '단어 추가' });
    await user.type(within(form).getByLabelText(/영어 단어/), 'BORROW');
    await user.type(within(form).getByLabelText(/^뜻/), '빌리다');
    await user.click(within(form).getByRole('button', { name: '추가' }));

    expect(await within(form).findByRole('alert')).toHaveTextContent('이미 같은 영어 단어가 있어요.');
    expect(await db.words.count()).toBe(4);

    await user.click(within(form).getByRole('button', { name: '그래도 추가' }));
    await waitFor(async () => expect(await db.words.count()).toBe(5));
  });

  it('사용자 단어를 수정한다', async () => {
    const user = await setup();
    await user.click(screen.getByRole('button', { name: 'tide 수정' }));
    const form = screen.getByRole('form', { name: '단어 수정' });
    await user.clear(within(form).getByLabelText(/^뜻/));
    await user.type(within(form).getByLabelText(/^뜻/), '밀물과 썰물');
    await user.type(within(form).getByLabelText(/예문/), 'The tide is high.');
    await user.selectOptions(within(form).getByLabelText('레벨'), '중급');
    await user.click(within(form).getByRole('button', { name: '저장' }));

    expect(await screen.findByText('‘tide’을(를) 수정했어요.')).toBeInTheDocument();
    expect(await db.words.get('u1')).toMatchObject({
      meaning: '밀물과 썰물',
      example: 'The tide is high.',
      level: 'intermediate',
      source: 'user',
    });
  });

  it('삭제는 확인을 거치고, 학습 기록도 함께 지운다', async () => {
    await db.reviews.put(makeState('u1', '2026-10-05'));
    const user = await setup();
    await user.click(screen.getByRole('button', { name: 'tide 삭제' }));
    expect(screen.getByText(/삭제할까요/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(await db.words.get('u1')).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'tide 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(await screen.findByText('‘tide’을(를) 삭제했어요.')).toBeInTheDocument();
    expect(listedTerms()).not.toContain('tide');
    expect(await db.words.get('u1')).toBeUndefined();
    expect(await db.reviews.get('u1')).toBeUndefined();
  });
});
