'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Level } from '@/lib/types';

type LevelContextValue = {
  level: Level;
  /** 방문자가 직접 난이도를 고른 적이 있는지 (신청 폼의 선택 항목 기본값에 사용) */
  chosen: boolean;
  setLevel: (level: Level) => void;
  clearChosen: () => void;
};

const LevelContext = createContext<LevelContextValue | null>(null);

/** 난이도 선택 섹션과 신청 폼이 같은 값을 공유하도록 하는 상태 */
export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<Level>('beginner');
  const [chosen, setChosen] = useState(false);

  const setLevel = useCallback((next: Level) => {
    setLevelState(next);
    setChosen(true);
  }, []);
  const clearChosen = useCallback(() => setChosen(false), []);

  const value = useMemo(() => ({ level, chosen, setLevel, clearChosen }), [level, chosen, setLevel, clearChosen]);
  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}

export function useLevel(): LevelContextValue {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel은 LevelProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
