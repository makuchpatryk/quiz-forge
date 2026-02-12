import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { TokenModel } from "./types";
import { UserLoginDto } from "./dto/login.dto";
import { User } from "../user/domain/user.entity";
import { UserRepository } from "../user/domain/user.repository";
import { USER_REPOSITORY } from "../user/domain/user.token";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async login(userLoginDto: UserLoginDto): Promise<TokenModel> {
    const user = await this.userRepository.getUserByEmail(
      userLoginDto.username
    );

    if (!user) throw new BadRequestException();

    if (!(await bcrypt.compare(userLoginDto.password, user.password)))
      throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(user: User): Promise<TokenModel> {
    const payload = {
      name: user.email,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: "1h",
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async saveRefreshToken(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);

    const user = new User();
    user.refreshToken = hash;

    await this.userRepository.update(userId, user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.getUserById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new ForbiddenException();
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new ForbiddenException();
      }

      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new ForbiddenException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    const userToUpdate = new User();
    await this.userRepository.update(userId, userToUpdate);
  }
}
