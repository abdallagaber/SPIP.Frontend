import { Permission } from '../models/auth.types';

export function hasPermission(userPermissions: string[], permission: Permission): boolean {
  return userPermissions.includes(permission.toLowerCase());
}

export function hasAnyPermission(userPermissions: string[], permissions: Permission[]): boolean {
  return permissions.some(p => userPermissions.includes(p.toLowerCase()));
}

export function hasAllPermissions(userPermissions: string[], permissions: Permission[]): boolean {
  return permissions.every(p => userPermissions.includes(p.toLowerCase()));
}
