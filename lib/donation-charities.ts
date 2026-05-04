/** Values appended to the Donations sheet (charity column). Must match API validation. */
export const DONATION_CHARITY_SHEET_VALUES = [
  'Center for Pacific Asian Family',
  'San Jose Animal Care Center',
  'East Bay Animal Rescue',
  'Orphan Kitten Club',
] as const;

export type DonationCharitySheetValue =
  (typeof DONATION_CHARITY_SHEET_VALUES)[number];

export function isValidDonationCharity(
  s: string,
): s is DonationCharitySheetValue {
  return (DONATION_CHARITY_SHEET_VALUES as readonly string[]).includes(s);
}
