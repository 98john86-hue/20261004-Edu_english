import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeWord } from '@/lib/testFixtures';
import type { Word } from '@/lib/types';
import { WordForm } from './WordForm';

function setup(options: { initial?: Word; duplicates?: Word[] } = {}) {
  const onSubmit = vi.fn<(input: unknown) => Promise<void>>().mockResolvedValue(undefined);
  const findDuplicates = vi.fn<(term: string) => Promise<Word[]>>().mockResolvedValue(options.duplicates ?? []);
  const onCancel = vi.fn();
  const user = userEvent.setup();
  render(<WordForm initial={options.initial} findDuplicates={findDuplicates} onSubmit={onSubmit} onCancel={onCancel} />);
  return { user, onSubmit, findDuplicates, onCancel };
}

describe('WordForm: 필수값 검증', () => {
  it('영어 단어와 뜻이 비어 있으면 저장하지 않고 오류를 보여 준다', async () => {
    const { user, onSubmit, findDuplicates } = setup();
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText('영어 단어를 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByText('뜻을 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByLabelText(/영어 단어/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/영어 단어/)).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(findDuplicates).not.toHaveBeenCalled();
  });

  it('공백만 입력해도 비어 있는 것으로 본다', async () => {
    const { user, onSubmit } = setup();
    await user.type(screen.getByLabelText(/영어 단어/), '   ');
    await user.type(screen.getByLabelText(/^뜻/), 'x');
    await user.click(screen.getByRole('button', { name: '추가' }));
    expect(screen.getByText('영어 단어를 입력해 주세요.')).toBeInTheDocument();
    expect(screen.queryByText('뜻을 입력해 주세요.')).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('입력하면 해당 필드의 오류가 사라진다', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: '추가' }));
    await user.type(screen.getByLabelText(/영어 단어/), 'a');
    expect(screen.queryByText('영어 단어를 입력해 주세요.')).not.toBeInTheDocument();
    expect(screen.getByText('뜻을 입력해 주세요.')).toBeInTheDocument();
  });

  it('앞뒤 공백을 제거해 저장한다', async () => {
    const { user, onSubmit, findDuplicates } = setup();
    await user.type(screen.getByLabelText(/영어 단어/), '  sunrise  ');
    await user.type(screen.getByLabelText(/^뜻/), ' 일출 ');
    await user.type(screen.getByLabelText(/예문/), '   ');
    await user.selectOptions(screen.getByLabelText('레벨'), '중급');
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(findDuplicates).toHaveBeenCalledWith('sunrise');
    expect(onSubmit).toHaveBeenCalledWith({ term: 'sunrise', meaning: '일출', level: 'intermediate' });
  });
});

describe('WordForm: 중복 경고', () => {
  const existing = makeWord('builtin-b01', { term: 'borrow', meaning: '빌리다' });

  it('같은 영어 단어가 있으면 경고하고, 확인해야 저장한다', async () => {
    const { user, onSubmit } = setup({ duplicates: [existing] });
    await user.type(screen.getByLabelText(/영어 단어/), 'Borrow');
    await user.type(screen.getByLabelText(/^뜻/), '빌려 주다');
    await user.click(screen.getByRole('button', { name: '추가' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('이미 같은 영어 단어가 있어요.');
    expect(alert).toHaveTextContent('borrow – 빌리다 (기본 단어)');
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '그래도 추가' }));
    expect(onSubmit).toHaveBeenCalledWith({ term: 'Borrow', meaning: '빌려 주다', level: 'beginner' });
  });

  it('영어 단어를 고치면 경고가 사라진다', async () => {
    const { user } = setup({ duplicates: [existing] });
    await user.type(screen.getByLabelText(/영어 단어/), 'borrow');
    await user.type(screen.getByLabelText(/^뜻/), '빌리다');
    await user.click(screen.getByRole('button', { name: '추가' }));
    await screen.findByRole('alert');
    await user.type(screen.getByLabelText(/영어 단어/), 's');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('수정할 때 자기 자신은 중복으로 보지 않는다', async () => {
    const mine = makeWord('user-1', { term: 'tide', meaning: '조수', source: 'user' });
    const { user, onSubmit } = setup({ initial: mine, duplicates: [mine] });
    expect(screen.getByLabelText(/영어 단어/)).toHaveValue('tide');
    await user.clear(screen.getByLabelText(/^뜻/));
    await user.type(screen.getByLabelText(/^뜻/), '밀물과 썰물');
    await user.click(screen.getByRole('button', { name: '저장' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith({ term: 'tide', meaning: '밀물과 썰물', level: 'beginner' });
  });
});

describe('WordForm: 기타', () => {
  it('저장에 실패하면 오류 메시지를 보여 준다', async () => {
    const { user, onSubmit } = setup();
    onSubmit.mockRejectedValueOnce(new Error('fail'));
    await user.type(screen.getByLabelText(/영어 단어/), 'tide');
    await user.type(screen.getByLabelText(/^뜻/), '조수');
    await user.click(screen.getByRole('button', { name: '추가' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요');
  });

  it('취소 버튼', async () => {
    const { user, onCancel } = setup();
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
