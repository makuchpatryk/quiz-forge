import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      // Try to get token from cookies first, then fall back to Authorization header
      let authToken = request.cookies?.accessToken;

      if (!authToken) {
        const { authorization } = request.headers;
        if (authorization && authorization.trim() !== "") {
          authToken = authorization.replace(/bearer/gim, "").trim();
        }
      }

      if (!authToken) {
        throw new UnauthorizedException("Please provide token");
      }

      const resp = await this.authService.validateToken(authToken);
      request.user = { name: resp.name, id: resp.sub };
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "session expired! Please sign In";
      console.log("auth error - ", message);
      throw new UnauthorizedException(message);
    }
  }
}
