import type { User as UserDomain } from "../../modules/user/domain/user.entity";
import { User as OrmUser } from "../entities/user.orm-entity";

export class UserMapper {
  static toDomain(orm: OrmUser): UserDomain {
    const user = {
      role: orm.role,
      id: orm.id,
      refreshToken: orm.refreshToken,
      email: orm.email,
      updatedAt: orm.updatedAt,
      createdAt: orm.createdAt,
      password: orm.password,
    } as UserDomain;
    return user;
  }

  static toOrm(user: UserDomain): OrmUser {
    const orm = new OrmUser();
    orm.id = user.id;
    orm.email = user.email;
    orm.password = user.password;
    orm.refreshToken = user.refreshToken;
    orm.updatedAt = user.updatedAt;
    orm.createdAt = user.createdAt;
    orm.role = user.role;
    return orm;
  }
}
