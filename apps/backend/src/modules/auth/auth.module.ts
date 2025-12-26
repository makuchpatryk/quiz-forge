import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_ACCESS_SECRET,
          signOptions: { expiresIn: "1d" },
        };
      },
    }),
  ],
  providers: [AuthService, AuthService],
  controllers: [AuthController],
  exports: [AuthService, AuthService],
})
export class AuthModule {}
