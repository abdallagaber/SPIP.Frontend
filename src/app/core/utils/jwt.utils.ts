export interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  iss: string;
  aud: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  [key: string]: any;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error('Error decoding JWT', error);
    return null;
  }
}

function normalizeRole(role: string): string {
  if (!role) return '';
  role = role.trim().toLowerCase();
  if (role.startsWith('role_')) {
    role = role.substring(5);
  }
  return role;
}

export function getRolesFromToken(token: string): string[] {
  if (!token) return [];
  const payload = decodeJwt(token);
  if (!payload) return [];

  const rolesClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (!rolesClaim) return [];

  const rolesArray = Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];
  return rolesArray.map(role => normalizeRole(role)).filter(r => r.length > 0);
}

export function hasRole(token: string, role: string): boolean {
  const roles = getRolesFromToken(token);
  return roles.includes(normalizeRole(role));
}

export function hasAnyRole(token: string, roles: string[]): boolean {
  const userRoles = getRolesFromToken(token);
  return roles.some(role => userRoles.includes(normalizeRole(role)));
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  
  // exp is in seconds, convert to milliseconds
  const expirationTime = payload.exp * 1000;
  // Add a small buffer (e.g., 5 seconds) to prevent edge cases
  return Date.now() >= (expirationTime - 5000);
}
