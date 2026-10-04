import { describe, expect, it } from 'vitest';
import { makeWord } from './testFixtures';
import {
  EMPTY_WORD_FORM,
  filterWords,
  findDuplicateWords,
  validateWordInput,
  WORD_LIMITS,
} from './wordValidation';

describe('validateWordInput', () => {
  it('영어 단어와 뜻은 필수다', () => {
    expect(validateWordInput(EMPTY_WORD_FORM)).toEqual({
      ok: false,
      errors: { term: '영어 단어를 입력해 주세요.', meaning: '뜻을 입력해 주세요.' },
    });
  });

  it('공백만 입력하면 비어 있는 것으로 본다', () => {
    const result = validateWordInput({ ...EMPTY_WORD_FORM, term: '   ', meaning: '\t\n' });
    expect(result.ok).toBe(false);
  });

  it('앞뒤 공백을 제거하고, 빈 예문은 빼고 돌려준다', () => {
    expect(
      validateWordInput({ term: '  look up ', meaning: ' 찾아보다 ', example: '   ', level: 'intermediate' }),
    ).toEqual({ ok: true, value: { term: 'look up', meaning: '찾아보다', level: 'intermediate' } });
    expect(
      validateWordInput({ term: 'tide', meaning: '조수', example: ' The tide is high. ', level: 'beginner' }),
    ).toEqual({ ok: true, value: { term: 'tide', meaning: '조수', example: 'The tide is high.', level: 'beginner' } });
  });

  it('길이 제한을 넘으면 오류', () => {
    const result = validateWordInput({
      term: 'a'.repeat(WORD_LIMITS.term + 1),
      meaning: '가'.repeat(WORD_LIMITS.meaning + 1),
      example: 'b'.repeat(WORD_LIMITS.example + 1),
      level: 'beginner',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['example', 'meaning', 'term']);
  });

  it('제한 길이까지는 허용한다', () => {
    const result = validateWordInput({ ...EMPTY_WORD_FORM, term: 'a'.repeat(WORD_LIMITS.term), meaning: '뜻' });
    expect(result.ok).toBe(true);
  });
});

describe('findDuplicateWords', () => {
  const words = [makeWord('1', { term: 'Borrow' }), makeWord('2', { term: 'carry' })];

  it('대소문자와 앞뒤 공백을 무시하고 같은 단어를 찾는다', () => {
    expect(findDuplicateWords('  borrow ', words).map((word) => word.id)).toEqual(['1']);
    expect(findDuplicateWords('borrowed', words)).toEqual([]);
  });

  it('수정 중인 자기 자신은 제외한다', () => {
    expect(findDuplicateWords('borrow', words, '1')).toEqual([]);
  });

  it('빈 단어는 중복으로 보지 않는다', () => {
    expect(findDuplicateWords('  ', words)).toEqual([]);
  });
});

describe('filterWords', () => {
  const words = [
    makeWord('1', { term: 'carry', meaning: '나르다', level: 'beginner' }),
    makeWord('2', { term: 'Achieve', meaning: '달성하다', level: 'intermediate' }),
    makeWord('3', { term: 'ambiguous', meaning: '모호한', level: 'advanced' }),
    makeWord('4', { term: 'borrow', meaning: '빌리다', level: 'beginner' }),
  ];

  it('필터가 없으면 알파벳순(대소문자 무시)으로 모두 돌려준다', () => {
    expect(filterWords(words, { query: '', level: 'all' }).map((w) => w.term)).toEqual([
      'Achieve',
      'ambiguous',
      'borrow',
      'carry',
    ]);
  });

  it('영어 단어나 한국어 뜻으로 검색한다', () => {
    expect(filterWords(words, { query: 'ACH', level: 'all' }).map((w) => w.id)).toEqual(['2']);
    expect(filterWords(words, { query: ' 빌리 ', level: 'all' }).map((w) => w.id)).toEqual(['4']);
  });

  it('레벨로 거르고 검색어와 함께 쓸 수 있다', () => {
    expect(filterWords(words, { query: '', level: 'beginner' }).map((w) => w.id)).toEqual(['4', '1']);
    expect(filterWords(words, { query: 'a', level: 'beginner' }).map((w) => w.id)).toEqual(['1']);
  });
});
