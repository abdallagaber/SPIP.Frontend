import { Role, Permission } from './auth.types';

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
  fullName: string | null;
  userName: string | null;
  phoneNumber: string | null;
}
