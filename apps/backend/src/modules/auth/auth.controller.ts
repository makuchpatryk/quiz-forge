import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/login.dto";
import { TokenModel } from "./types";
import { AuthGuard } from "./auth.guard";
import { RequestAuth } from "../../common/types";
import { AuthRefreshDto } from "./dto/refresh.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() userLoginDto: UserLoginDto): Promise<TokenModel> {
    return this.authService.login(userLoginDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get("user")
  async user(@Request() req: RequestAuth): Promise<any> {
    return req.user;
  }

  @ApiBearerAuth()
  @Post("refresh")
  async refresh(@Body() authRefreshDto: AuthRefreshDto) {
    return this.authService.refresh(authRefreshDto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(@Body("userId") userId: number) {
    return this.authService.logout(userId);
  }
}
