export type Role = 'admin' | 'manager' | 'accountant';
export type { Permission } from '../constants/permissions';

export interface StoredProfile {
  fullName: string | null;
  userName: string | null;
  phoneNumber: string | null;
}
