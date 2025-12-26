export type TokenModel = { accessToken: string; refreshToken: string };

export type JwtPayload = {
  sub: string;
  name: string;
};
