export interface JwtRefreshUser {
  sub: number;
  email: string;
  refreshToken?: string;
}
