'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { initDatabase } from '@/db';

type GateStatus = 'loading' | 'ready' | 'error';

export function DbGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GateStatus>('loading');

  useEffect(() => {
    let active = true;
    initDatabase().then(
      () => active && setStatus('ready'),
      () => active && setStatus('error'),
    );
    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <p role="status" className="py-16 text-center text-slate-500">
        단어장을 불러오는 중…
      </p>
    );
  }

  if (status === 'error') {
    return (
      <div role="alert" className="mx-auto max-w-md rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
        <h2 className="mb-2 text-lg font-bold">저장소를 사용할 수 없어요</h2>
        <p className="mb-2 text-sm leading-6">
          이 앱은 학습 기록을 브라우저 저장소(IndexedDB)에 보관합니다. 시크릿(개인 정보 보호) 모드이거나
          브라우저 설정에서 사이트 데이터 저장을 막아 두면 사용할 수 없습니다.
        </p>
        <p className="text-sm leading-6">일반 창에서 다시 열거나 사이트 데이터 저장을 허용한 뒤 새로고침해 주세요.</p>
      </div>
    );
  }

  return <>{children}</>;
}
