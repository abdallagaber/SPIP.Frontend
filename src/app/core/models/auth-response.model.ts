import { AuthUser } from './user.model';

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
