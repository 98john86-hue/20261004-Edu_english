import { afterEach, describe, expect, it, vi } from 'vitest';
import { isSpeechSupported, speak } from './speech';

class FakeUtterance {
  lang = '';
  rate = 1;
  constructor(public text: string) {}
}

function installSpeech() {
  const synth = { speak: vi.fn(), cancel: vi.fn() };
  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return synth;
}

describe('speech', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('jsdom처럼 speechSynthesis가 없으면 미지원으로 보고 아무것도 하지 않는다', () => {
    expect(isSpeechSupported()).toBe(false);
    expect(speak('hello')).toBe(false);
  });

  it('지원하면 en-US로 읽고, 이전 발음은 취소한다', () => {
    const synth = installSpeech();
    expect(isSpeechSupported()).toBe(true);
    expect(speak('borrow')).toBe(true);
    expect(synth.cancel).toHaveBeenCalledOnce();
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe('borrow');
    expect(utterance.lang).toBe('en-US');
  });

  it('빈 문자열은 읽지 않는다', () => {
    const synth = installSpeech();
    expect(speak('  ')).toBe(false);
    expect(synth.speak).not.toHaveBeenCalled();
  });
});
