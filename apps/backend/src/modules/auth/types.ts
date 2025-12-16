export type TokenModel = { access_token: string };

export type JwtPayload = {
  sub: string;
  name: string;
};
