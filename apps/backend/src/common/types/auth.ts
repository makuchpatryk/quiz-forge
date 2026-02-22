import { UserJwtPayload } from "../../modules/auth/types";
import { Request } from "express";

export interface RequestAuth extends Request {
  user: UserJwtPayload;
}
