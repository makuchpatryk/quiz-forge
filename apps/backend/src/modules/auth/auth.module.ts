import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_ACCESS_SECRET,
          signOptions: { expiresIn: "10s" },
        };
      },
    }),
  ],
  providers: [AuthService, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
