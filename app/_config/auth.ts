export const AUTH_CONFIG = {
  SECRET_KEYPHRASE: process.env.WEDDING_SECRET_KEYPHRASE,
  SESSION_DURATION_DAYS: 200, // How long the session lasts
} as const;
