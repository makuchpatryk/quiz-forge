import { UserMapper } from "../mappers/user.mapper";
import { User as UserDomain } from "../../modules/user/domain/user.entity";
import { UserRepository } from "../../modules/user/domain/user.repository";
import { User as UserOrm } from "../entities/user.orm-entity";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor() {}

  async getUserById(id: string): Promise<UserDomain | null> {
    const ormUser = await UserOrm.findOne({ where: { id } });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  async getUserByEmail(email: string): Promise<UserDomain | null> {
    const ormUser = await UserOrm.findOne({ where: { email } });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  async create(user: UserDomain): Promise<UserDomain> {
    const ormUser = UserMapper.toOrm(user);
    return UserMapper.toDomain(await UserOrm.save(ormUser));
  }
  async update(userId: string, userToUpdate: UserDomain): Promise<UserDomain> {
    const ormUser = UserMapper.toOrm(userToUpdate);
    const user = await UserOrm.findOne({ where: { id: ormUser.id } });
    if (!user) throw new NotFoundException("Not found user");

    await UserOrm.update(userId, ormUser);

    return UserMapper.toDomain(ormUser);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserDomain> {
    const userToUpdate = new UserDomain();
    userToUpdate.refreshToken = refreshToken;
    const ormUser = UserMapper.toOrm(userToUpdate);
    const user = await UserOrm.findOne({ where: { id: ormUser.id } });
    if (!user) throw new NotFoundException("Not found user");

    await UserOrm.update(userId, ormUser);

    return UserMapper.toDomain(ormUser);
  }
}
