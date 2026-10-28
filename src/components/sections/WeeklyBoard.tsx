'use client';

import { useMemo, useState } from 'react';
import { board, challenge } from '@/content/landing';
import { buildSampleLogs, getWeekDates, replaceDayLogs, type DayLogs } from '@/lib/board';
import type { SwimLog } from '@/lib/types';
import { BoardTable, type BoardRow } from '@/components/ui/BoardTable';
import { CheckInForm } from '@/components/ui/CheckInForm';
import { SectionHeading } from '@/components/ui/SectionHeading';

// 예시 참여자 기록은 고정값이라 모듈에서 한 번만 만든다
const sampleRows: BoardRow[] = board.participants.map((p, i) => ({
  id: p.id,
  name: p.name,
  isMe: false,
  goal: p.goal,
  logs: buildSampleLogs(p.weeks, challenge.startDate, board.samplePools, i * 3),
}));

/** 위: 오늘의 인증 폼, 아래: 전체 진행판. 체험용이라 기록은 화면 상태로만 유지 */
export function WeeklyBoard() {
  const [myLogs, setMyLogs] = useState<SwimLog[]>([]);
  const [myName, setMyName] = useState('');
  const [myGoal, setMyGoal] = useState<number>(challenge.weeklyMin);
  const [weekIndex, setWeekIndex] = useState(0);

  const rows = useMemo(
    () => [...sampleRows, { id: 'me', name: myName.trim() || board.meName, isMe: true, goal: myGoal, logs: myLogs }],
    [myLogs, myName, myGoal],
  );

  const saveDay = (date: string, next: DayLogs) => {
    setMyLogs((prev) => replaceDayLogs(prev, date, next));
    // 인증한 날짜가 있는 주를 진행판에 보여 준다
    const week = Array.from({ length: challenge.weeks }, (_, i) => i).find((i) =>
      getWeekDates(challenge.startDate, i).includes(date),
    );
    if (week !== undefined) setWeekIndex(week);
  };

  return (
    <section id="board" aria-labelledby="board-title" className="scroll-mt-16 bg-sky-50 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-xl">
        <SectionHeading id="board-title" eyebrow={board.eyebrow} title={board.title} description={board.description} />
        <CheckInForm
          myLogs={myLogs}
          name={myName}
          onNameChange={setMyName}
          goal={myGoal}
          onGoalChange={setMyGoal}
          onSave={saveDay}
        />
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        <BoardTable rows={rows} weekIndex={weekIndex} onWeekChange={setWeekIndex} />
      </div>
    </section>
  );
}
