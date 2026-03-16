import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UserRoles, AuthProvider } from "../../../database/entities/user.enum";

export class User {
  constructor() {}
  id: string;
  email: string;
  refreshToken: string;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;
  provider: string;
  providerId: string | null;

  async create(payload: {
    email: string;
    password?: string;
    provider?: string;
    providerId?: string;
  }) {
    const user = new User();
    if (payload.password) {
      await user.setPassword(payload.password);
    } else {
      user.password = null;
    }
    user.id = randomUUID();
    user.email = payload.email;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.role = UserRoles.MEMBER;
    user.provider = payload.provider || AuthProvider.LOCAL;
    user.providerId = payload.providerId || null;
    return user;
  }
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }
}
