import { Inject, Injectable } from "@nestjs/common";
import { UserRegisterRequestDto } from "../dto/user-register.req.dto";
import { User } from "../domain/user.entity";
import { USER_REPOSITORY } from "../domain/user.token";
import { UserRepository } from "../domain/user.repository";

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}
  async execute(userRegister: UserRegisterRequestDto): Promise<User> {
    const user = new User();
    await user.create(userRegister);

    return await this.userRepository.create(user);
  }
}
