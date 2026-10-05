'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // 개발 서버에서는 파일이 계속 바뀌므로 캐시가 방해만 된다. 프로덕션 빌드에서만 등록한다.
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {
      // 등록에 실패해도 온라인 사용에는 지장이 없으므로 조용히 넘어간다.
    });
  }, []);
  return null;
}
