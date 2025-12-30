import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepositoryImpl } from "../../database/respositories/user.repository";
import { UserCreateUseCase } from "./application/user-create.usecase";
import { USER_REPOSITORY } from "./domain/user.token";

@Module({
  imports: [],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    UserCreateUseCase,
  ],
  controllers: [UserController],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
