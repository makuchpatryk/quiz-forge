import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/login.dto";
import { AuthGuard } from "./auth.guard";
import { RequestAuth, RequestOAuth } from "../../common/types";
import { USER_REPOSITORY } from "../user/domain/user.token";
import { UserRepository } from "../user/domain/user.repository";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  @Post("login")
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(userLoginDto);

    res.cookie("accessToken", tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/auth",
    });

    return { message: "Login successful" };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get("me")
  async me(@Request() req: RequestAuth) {
    const user = await this.userRepository.getUserById(req.user.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const { password: _password, providerId: _providerId, ...rest } = user;
    return rest;
  }

  // === Google OAuth ===
  @Get("google")
  @UseGuards(PassportAuthGuard("google"))
  googleLogin() {
    // Passport automatycznie przekieruje do Google
  }

  @Get("google/callback")
  @UseGuards(PassportAuthGuard("google"))
  googleCallback(@Request() req: RequestOAuth, @Res() res: Response) {
    this.handleOAuthCallback(req, res);
  }

  // === Facebook OAuth ===
  @Get("facebook")
  @UseGuards(PassportAuthGuard("facebook"))
  facebookLogin() {
    // Passport automatycznie przekieruje do Facebook
  }

  @Get("facebook/callback")
  @UseGuards(PassportAuthGuard("facebook"))
  facebookCallback(@Request() req: RequestOAuth, @Res() res: Response) {
    this.handleOAuthCallback(req, res);
  }

  @ApiBearerAuth()
  @Post("refresh")
  async refresh(
    @Request() req: RequestAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401);
      return { message: "No refresh token provided" };
    }

    const tokens = await this.authService.refresh(refreshToken);

    res.cookie("accessToken", tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/auth",
    });

    return { message: "Tokens refreshed" };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(
    @Request() req: RequestAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.id);

    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.clearCookie("refreshToken", {
      ...COOKIE_OPTIONS,
      path: "/auth",
    });

    return { message: "Logged out successfully" };
  }

  private handleOAuthCallback(req: RequestOAuth, res: Response) {
    const tokens = req.user;
    res.cookie("accessToken", tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/auth",
    });
    res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
  }
}
