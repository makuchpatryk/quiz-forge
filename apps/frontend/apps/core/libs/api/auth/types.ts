export interface LoginDto {
  username: string;
  password: string;
}
export interface RefreshDto {
  refreshToken: string;
}
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
