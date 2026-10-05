// 날짜는 모두 사용자 로컬 달력 기준의 'YYYY-MM-DD' 문자열로 다룬다.
// toISOString()은 UTC로 바꾸기 때문에 한국(UTC+9)에서는 오전 9시 전 학습이
// 전날로 기록된다. 그래서 날짜를 만들 때는 항상 getFullYear/getMonth/getDate를 쓴다.

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function isValidDateString(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return toLocalDateString(date) === value;
}

function parseParts(value: string): [number, number, number] {
  if (!isValidDateString(value)) {
    throw new RangeError(`잘못된 날짜 형식입니다: ${value}`);
  }
  const [y, m, d] = value.split('-').map(Number);
  return [y, m, d];
}

export function toLocalDateString(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayLocal(now: Date = new Date()): string {
  return toLocalDateString(now);
}

export function parseLocalDate(value: string): Date {
  const [y, m, d] = parseParts(value);
  return new Date(y, m - 1, d);
}

// 밀리초에 24시간을 더하지 않고 달력의 '일' 칸을 더한다. Date 생성자가 월말·연말
// 넘침(1월 32일 → 2월 1일)을 알아서 정리하고, 서머타임으로 하루가 23/25시간인
// 날에도 자정이 어긋나지 않는다.
export function addDays(value: string, days: number): string {
  const [y, m, d] = parseParts(value);
  return toLocalDateString(new Date(y, m - 1, d + days));
}

// 두 날짜를 UTC 자정으로 옮겨서 빼면 서머타임 때문에 생기는 ±1시간 오차가 사라진다.
export function diffDays(from: string, to: string): number {
  const [fy, fm, fd] = parseParts(from);
  const [ty, tm, td] = parseParts(to);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / MS_PER_DAY);
}
