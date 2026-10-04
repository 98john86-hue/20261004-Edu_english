import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SpeakButton } from './SpeakButton';

describe('SpeakButton', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('speechSynthesis가 없으면 버튼을 비활성화하고 툴팁으로 안내한다', () => {
    render(<SpeakButton text="borrow" />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.parentElement).toHaveAttribute('title', '이 브라우저는 발음 듣기를 지원하지 않아요');
  });

  it('지원하면 눌렀을 때 단어를 읽는다', async () => {
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
    render(<SpeakButton text="borrow" />);
    await userEvent.click(screen.getByRole('button', { name: 'borrow 발음 듣기' }));
    expect(speakSpy).toHaveBeenCalledOnce();
  });
});
