const DA_NANG_TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Returns the current date in YYYY-MM-DD format in Da Nang, Vietnam time.
 * Used to show/hide Wedding and Tea Ceremony nav tabs and RSVP on event dates.
 */
export function getDaNangDateString(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: DA_NANG_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

export function isMay20_2026InDaNang(): boolean {
  return getDaNangDateString() === '2026-05-20';
}

export function isMay23_2026InDaNang(): boolean {
  return getDaNangDateString() === '2026-05-23';
}
