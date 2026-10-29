import type { FirebaseOptions } from 'firebase/app';

type FirebaseEnv = Partial<Record<keyof typeof envKeys, string | undefined>>;

/** .env.local에 넣을 변수 이름 (값은 Firebase 콘솔 → 프로젝트 설정 → 웹 앱에서 복사) */
const envKeys = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
} as const;

// Next.js는 process.env.NEXT_PUBLIC_* 를 글자 그대로 써야 브라우저 코드에 값을 넣어 준다
const browserEnv: FirebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** 필수 값(apiKey, projectId, appId)이 모두 있으면 설정을, 하나라도 없으면 null을 돌려준다 */
export function readFirebaseConfig(env: FirebaseEnv = browserEnv): FirebaseOptions | null {
  const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = env;
  if (!apiKey || !projectId || !appId) return null;
  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

export const firebaseEnvKeys = envKeys;
