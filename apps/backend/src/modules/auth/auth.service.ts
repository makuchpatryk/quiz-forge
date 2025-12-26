import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { TokenModel } from "./types";
import { UserLoginDto } from "./dto/login.dto";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(userLoginDto: UserLoginDto): Promise<TokenModel> {
    const user = await this.userService.getUserByEmail(userLoginDto.username);

    if (!user) throw new BadRequestException();

    if (!(await bcrypt.compare(userLoginDto.password, user.password)))
      throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(user: User): Promise<TokenModel> {
    const payload = {
      name: user.name,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: "20s",
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

  async saveRefreshToken(userId: number, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.userService.update(userId, {
      refreshToken: hash,
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.getUserById(payload.sub);
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

  async logout(userId: number) {
    await this.userService.update(userId, {
      refreshToken: void 0,
    });
  }
}
