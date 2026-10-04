import { describe, expect, it } from 'vitest';
import { createSeededRandom } from './random';
import { buildStudyQueue, selectNewWords } from './studyQueue';
import { makeState, makeWord } from './testFixtures';

const TODAY = '2026-10-04';

describe('selectNewWords', () => {
  it('복습 기록이 없는 단어를 초급 → 중급 → 고급, 같은 레벨은 추가 순서로 고른다', () => {
    const words = [
      makeWord('adv', { level: 'advanced' }),
      makeWord('mid', { level: 'intermediate' }),
      makeWord('b-late', { createdAt: '2026-10-03T00:00:00.000Z' }),
      makeWord('b-early', { createdAt: '2026-10-02T00:00:00.000Z' }),
      makeWord('b-reviewed'),
    ];
    const { selected, remaining } = selectNewWords(words, new Set(['b-reviewed']), 3);
    expect(selected.map((word) => word.id)).toEqual(['b-early', 'b-late', 'mid']);
    expect(remaining).toBe(1);
  });

  it('한도가 0 이하면 고르지 않는다', () => {
    expect(selectNewWords([makeWord('a')], new Set(), 0).selected).toEqual([]);
    expect(selectNewWords([makeWord('a')], new Set(), -3).remaining).toBe(1);
  });
});

describe('buildStudyQueue', () => {
  const words = Array.from({ length: 6 }, (_, i) => makeWord(`w${i}`));

  it('dueDate가 오늘 이하인 카드와 새 단어를 함께 담는다', () => {
    const queue = buildStudyQueue({
      words,
      reviewStates: [
        makeState('w0', '2026-10-01'),
        makeState('w1', TODAY),
        makeState('w2', '2026-10-05'),
      ],
      today: TODAY,
      newWordLimit: 2,
      random: createSeededRandom(3),
    });
    const ids = queue.cards.map((card) => card.word.id).sort();
    expect(ids).toEqual(['w0', 'w1', 'w3', 'w4']);
    expect(queue.dueCount).toBe(2);
    expect(queue.newCount).toBe(2);
    expect(queue.remainingNewCount).toBe(1);
    expect(queue.cards.find((card) => card.word.id === 'w0')).toMatchObject({ isNew: false, state: { dueDate: '2026-10-01' } });
    expect(queue.cards.find((card) => card.word.id === 'w3')).toMatchObject({ isNew: true });
    expect(queue.cards.find((card) => card.word.id === 'w3')?.state).toBeUndefined();
  });

  it('복습 카드와 새 카드를 섞는다', () => {
    const many = Array.from({ length: 20 }, (_, i) => makeWord(`m${i}`));
    const queue = buildStudyQueue({
      words: many,
      reviewStates: many.slice(0, 10).map((word) => makeState(word.id, TODAY)),
      today: TODAY,
      newWordLimit: 10,
      random: createSeededRandom(9),
    });
    const pattern = queue.cards.map((card) => (card.isNew ? 'N' : 'R')).join('');
    expect(pattern).not.toBe('RRRRRRRRRRNNNNNNNNNN');
    expect(pattern.length).toBe(20);
  });

  it('단어가 지워진 복습 상태는 건너뛴다', () => {
    const queue = buildStudyQueue({
      words: [makeWord('a')],
      reviewStates: [makeState('ghost', TODAY)],
      today: TODAY,
      newWordLimit: 0,
    });
    expect(queue.cards).toEqual([]);
    expect(queue.remainingNewCount).toBe(1);
  });

  it('복습할 것도 새 단어 한도도 없으면 빈 큐', () => {
    const queue = buildStudyQueue({
      words,
      reviewStates: words.map((word) => makeState(word.id, '2026-10-10')),
      today: TODAY,
      newWordLimit: 10,
    });
    expect(queue.cards).toEqual([]);
    expect(queue.remainingNewCount).toBe(0);
  });
});
