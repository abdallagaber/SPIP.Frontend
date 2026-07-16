import { JwtPayload } from '../models/jwt-payload.model';

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

export function normalizeValue(value: string): string {
  if (!value) return '';
  value = value.trim().toLowerCase();
  if (value.startsWith('role_')) {
    value = value.substring(5);
  }
  return value;
}

export function extractRoleFromPayload(payload: JwtPayload): string | null {
  const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
  if (!roleClaim) return null;
  
  if (Array.isArray(roleClaim)) {
    return roleClaim.length > 0 ? normalizeValue(roleClaim[0]) : null;
  }
  
  return normalizeValue(roleClaim);
}

export function extractPermissionsFromPayload(payload: JwtPayload): string[] {
  const permissionsClaim = payload['Permission'] || payload['permissions'];
  if (!permissionsClaim) return [];
  
  const permissionsArray = Array.isArray(permissionsClaim) ? permissionsClaim : [permissionsClaim];
  return permissionsArray.map(p => normalizeValue(p)).filter(p => p.length > 0);
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  
  const expirationTime = payload.exp * 1000;
  // 10 second buffer
  return Date.now() >= (expirationTime - 10000);
}
