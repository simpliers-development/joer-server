const DEV_COOKIE_OPTS = { maxAge: 900000, httpOnly: true };
const PRODUCTION_COOKIE_OPTS = { maxAge: 900000, httpOnly: true, secure: true };

export const DEFAULT_COOKIE_OPTS = process.env.NODE_ENV === 'production' ? PRODUCTION_COOKIE_OPTS : DEV_COOKIE_OPTS;
