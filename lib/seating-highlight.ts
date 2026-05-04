export function normalizeFullName(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

/**
 * True if the seat label contains the highlight text (trimmed, collapsed spaces),
 * case-insensitive. Comma-separated terms are each checked separately (OR).
 */
export function namesMatchSeatToHighlight(
  seatCell: string,
  highlightFull: string,
): boolean {
  const s = normalizeFullName(seatCell).toLowerCase();
  const h = normalizeFullName(highlightFull).toLowerCase();
  if (!s || !h) return false;
  return s.includes(h);
}

/** Split find-seat field on comma / semicolon / newline; each segment is one search phrase. */
export function parseFindSeatInput(input: string): string[] {
  const parts = input.split(/[,;\n]+/);
  const out: string[] = [];
  for (const p of parts) {
    const t = normalizeFullName(p);
    if (t) out.push(t);
  }
  return out;
}

/** Full display names from RSVP (guest, +1, children) for prefilling find-seat. */
export function rsvpToDisplayNameParts(data: {
  name: string;
  plusOneName?: string;
  children?: { name: string }[];
}): string[] {
  const parts: string[] = [];
  const add = (s: string) => {
    const t = normalizeFullName(s);
    if (t) parts.push(t);
  };
  add(data.name || '');
  add(data.plusOneName || '');
  for (const c of data.children || []) {
    add(c?.name || '');
  }
  return parts;
}
