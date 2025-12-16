import {
  BadRequestException,
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

  async loginUser(userLoginDto: UserLoginDto): Promise<TokenModel> {
    console.log("user", userLoginDto);
    const user = await this.userService.getUserByEmail(userLoginDto.username);
    console.log("user", user);
    if (!user) throw new BadRequestException();

    if (!(await bcrypt.compare(userLoginDto.password, user.password)))
      throw new UnauthorizedException();

    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<TokenModel> {
    console.log("user 2", user, this.jwtService);
    return {
      access_token: this.jwtService.sign({
        name: user.name,
        sub: user.id,
      }),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.APP_SECRET,
    });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
