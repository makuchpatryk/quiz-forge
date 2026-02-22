import { Body, Controller, Get, Post } from "@nestjs/common";
import { SETTINGS } from "../../app.utils";

import { UserRegisterRequestDto } from "./dto/user-register.req.dto";
import { User } from "./domain/user.entity";
import { UserCreateUseCase } from "./application/user-create.usecase";

@Controller("user")
export class UserController {
  constructor(private userCreateUseCase: UserCreateUseCase) {}

  @Post("/register")
  async doUserRegistration(
    @Body(SETTINGS.VALIDATION_PIPE)
    userRegister: UserRegisterRequestDto
  ): Promise<User> {
    return await this.userCreateUseCase.execute(userRegister);
  }
}
