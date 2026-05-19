const DA_NANG_TIMEZONE = 'Asia/Ho_Chi_Minh';

const TEA_CEREMONY_NAV_START = '2026-05-19';
const TEA_CEREMONY_NAV_END = '2026-05-20';
const WEDDING_NAV_START = '2026-05-22';
const WEDDING_NAV_END = '2026-05-23';

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

function isDaNangDateInRange(start: string, end: string): boolean {
  const dateStr = getDaNangDateString();
  return dateStr >= start && dateStr <= end;
}

/** Tea Ceremony nav tab: May 19–20, 2026 (Da Nang time). */
export function isTeaCeremonyNavVisibleInDaNang(): boolean {
  return isDaNangDateInRange(TEA_CEREMONY_NAV_START, TEA_CEREMONY_NAV_END);
}

/** Wedding nav tab: May 22–23, 2026 (Da Nang time). */
export function isWeddingNavVisibleInDaNang(): boolean {
  return isDaNangDateInRange(WEDDING_NAV_START, WEDDING_NAV_END);
}

/** Hide RSVP nav on tea ceremony and wedding event days. */
export function isEventDayHideRsvpInDaNang(): boolean {
  return isTeaCeremonyNavVisibleInDaNang() || isWeddingNavVisibleInDaNang();
}
