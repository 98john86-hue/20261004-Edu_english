export const SPEECH_LANG = 'en-US';

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}

export function speak(text: string): boolean {
  if (!isSpeechSupported() || !text.trim()) return false;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG;
  utterance.rate = 0.9;
  // 이전 발음이 큐에 쌓여 있으면 버튼을 여러 번 눌렀을 때 밀려서 재생되므로 먼저 비운다.
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}
