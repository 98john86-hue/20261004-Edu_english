import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { lastNDays } from '@/lib/stats';
import { WeeklyChart } from './WeeklyChart';

const DAYS = lastNDays(
  [
    { date: '2026-09-29', reviewedCount: 12, correctCount: 9 },
    { date: '2026-10-04', reviewedCount: 7, correctCount: 7 },
  ],
  '2026-10-04',
);

describe('WeeklyChart', () => {
  it('요일별 막대 7개와 합계를 보여 주고, 각 막대는 날짜와 학습량을 읽어 준다', () => {
    render(<WeeklyChart days={DAYS} />);
    expect(screen.getByText('합계 19개')).toBeInTheDocument();
    const bars = screen.getAllByRole('button');
    expect(bars).toHaveLength(7);
    expect(bars[1]).toHaveAccessibleName('9월 29일 (화) 12개 학습, 정답 9개');
    expect(bars[6]).toHaveAccessibleName('10월 4일 (일) 7개 학습, 정답 7개');
    expect(screen.getByText('오늘')).toBeInTheDocument();
  });

  it('막대 높이는 축 최댓값(20)에 비례한다', () => {
    render(<WeeklyChart days={DAYS} />);
    const heights = screen.getAllByRole('button').map((bar) => (bar.firstElementChild as HTMLElement).style.height);
    expect(heights[1]).toBe(`${(12 / 20) * 128}px`);
    expect(heights[0]).toBe('0px');
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('마우스를 올리거나 포커스하면 툴팁을 보여 준다', () => {
    render(<WeeklyChart days={DAYS} />);
    const bar = screen.getAllByRole('button')[1];
    fireEvent.mouseEnter(bar);
    expect(screen.getByRole('tooltip')).toHaveTextContent('9월 29일 (화)12개 학습 · 정답 9개');
    fireEvent.mouseLeave(bar);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.focus(screen.getAllByRole('button')[6]);
    expect(screen.getByRole('tooltip')).toHaveTextContent('7개 학습');
  });

  it('표로 보기에 같은 데이터를 담는다', () => {
    render(<WeeklyChart days={DAYS} />);
    const rows = within(screen.getByRole('table', { hidden: true })).getAllByRole('row', { hidden: true });
    expect(rows).toHaveLength(8);
    expect(rows[2]).toHaveTextContent('9월 29일 (화)129');
  });
});
