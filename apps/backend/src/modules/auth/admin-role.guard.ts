import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { UserRoles } from "../user/enums/user.enum";
import { USER_REPOSITORY } from "../user/domain/user.token";
import { UserRepository } from "../user/domain/user.repository";

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.userRepository.getUserById(id);
      return user?.role === UserRoles.ADMIN;
    }

    return false;
  }
}
