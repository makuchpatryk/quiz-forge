import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UserRoles } from "../../../database/entities/user.enum";

export class User {
  constructor() {}
  id: string;
  email: string;
  refreshToken: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;

  async create(payload: { email: string; password: string }) {
    const user = new User();
    await user.setPassword(payload.password);
    user.id = randomUUID();
    user.email = payload.email;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.role = UserRoles.MEMBER;
    return user;
  }
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
