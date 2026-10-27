'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Level } from '@/lib/types';

type LevelContextValue = { level: Level; setLevel: (level: Level) => void };

const LevelContext = createContext<LevelContextValue | null>(null);

/** 난이도 선택 섹션과 신청 폼이 같은 값을 공유하도록 하는 상태 */
export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<Level>('beginner');
  const value = useMemo(() => ({ level, setLevel }), [level]);
  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}

export function useLevel(): LevelContextValue {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel은 LevelProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
