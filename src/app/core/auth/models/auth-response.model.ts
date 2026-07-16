export interface AuthResponse {
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  token: string;
  expiresAt: string;
  refreshToken: string;
  roles: string[];
  permissions: string[];
}
