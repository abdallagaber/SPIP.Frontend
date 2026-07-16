export interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  Permission?: string | string[];
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  [key: string]: any;
}
