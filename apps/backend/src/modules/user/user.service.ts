import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRegisterRequestDto } from "./dto/user-register.req.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  async doUserRegistration(
    userRegister: UserRegisterRequestDto
  ): Promise<User> {
    const user = new User();
    user.name = userRegister.name;
    user.email = userRegister.email;
    user.password = userRegister.password;

    return await user.save();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<User | null> {
    return User.findOne({ where: { id } });
  }

  async update(
    userId: number,
    payload: {
      refreshToken?: string;
    }
  ): Promise<User> {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Not found user");

    await User.update(userId, payload);

    return user;
  }
}
