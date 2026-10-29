import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase/client';
import type { SignupData } from '@/lib/types';

export const SIGNUPS_COLLECTION = 'signups';

/**
 * 사전 신청 한 건을 Firestore `signups` 모음에 문서 하나로 저장한다.
 * 입력하지 않은 선택 항목은 아예 넣지 않는다 (Firestore는 undefined 값을 거부함).
 */
export async function saveSignup(data: SignupData): Promise<void> {
  const { goal, level, referral, ...required } = data;
  await addDoc(collection(getDb(), SIGNUPS_COLLECTION), {
    ...required,
    ...(level ? { level } : {}),
    ...(goal ? { goal } : {}),
    ...(referral ? { referral } : {}),
    createdAt: serverTimestamp(),
  });
}
