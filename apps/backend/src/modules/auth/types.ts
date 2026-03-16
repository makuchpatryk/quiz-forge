export type TokenModel = { accessToken: string; refreshToken: string };

export type UserJwtPayload = {
  id: string;
  email: string;
};

export interface OAuthProfile {
  email: string;
  name: string;
  provider: "google" | "facebook";
  providerId: string;
}

