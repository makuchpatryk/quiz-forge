export type TokenModel = { accessToken: string; refreshToken: string };

export type UserJwtPayload = {
  id: string;
  email: string;
};
