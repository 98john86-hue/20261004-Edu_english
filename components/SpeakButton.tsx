'use client';

import { useSyncExternalStore } from 'react';
import { isSpeechSupported, speak } from '@/lib/speech';

const UNSUPPORTED_MESSAGE = '이 브라우저는 발음 듣기를 지원하지 않아요';

function subscribe() {
  return () => {};
}

// 서버 렌더링 결과(false)와 클라이언트 첫 렌더링이 같아야 하이드레이션 오류가 없다.
// useSyncExternalStore가 서버/하이드레이션 중에는 getServerSnapshot을 쓰고,
// 마운트 뒤에 실제 지원 여부로 다시 그린다.
export function useSpeechSupported(): boolean {
  return useSyncExternalStore(subscribe, isSpeechSupported, () => false);
}

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  const supported = useSpeechSupported();

  if (!supported) {
    return (
      <span title={UNSUPPORTED_MESSAGE} className={`inline-flex ${className}`}>
        <button
          type="button"
          disabled
          aria-label={`발음 듣기 (${UNSUPPORTED_MESSAGE})`}
          className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full bg-slate-100 text-slate-400"
        >
          <SpeakerIcon />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      title="발음 듣기 (P)"
      aria-label={`${text} 발음 듣기`}
      onClick={(event) => {
        event.stopPropagation();
        speak(text);
      }}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-500 ${className}`}
    >
      <SpeakerIcon />
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
    </svg>
  );
}
