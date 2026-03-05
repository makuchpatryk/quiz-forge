import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User as UserOrm } from "../../database/entities/user.orm-entity";
import { UserController } from "./user.controller";
import { UserRepositoryImpl } from "../../database/respositories/user.repository";
import { UserCreateUseCase } from "./application/user-create.usecase";
import { USER_REPOSITORY } from "./domain/user.token";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrm])],
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
