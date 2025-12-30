import { User } from "./user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  update(userId: string, userToUpdate: User): Promise<User>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<User>;
}
