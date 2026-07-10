export interface AuthUser {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  token: string;
  expiresAt: string;
  roles: string[];
}
