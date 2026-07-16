export const AUTH_COOKIE_KEYS = {
  accessToken: 'spip_access_token',
  lastAccessToken: 'spip_last_access_token',
  refreshToken: 'spip_refresh_token',
  expiresAt: 'spip_expires_at',
  profile: 'spip_profile'
} as const;

export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  refreshToken: '/auth/refresh-token'
} as const;

export const AUTH_ROUTES = {
  login: '/auth/login',
  register: '/auth/register'
} as const;
