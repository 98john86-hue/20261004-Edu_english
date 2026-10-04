import type { Metadata } from 'next';
import { StudySession } from '@/components/StudySession';

export const metadata: Metadata = { title: '플래시카드 학습 | 매일 영단어' };

export default function StudyPage() {
  return <StudySession />;
}
