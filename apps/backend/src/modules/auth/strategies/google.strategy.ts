import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { emails: { value: string }[]; displayName: string; id: string },
    done: VerifyCallback,
  ) {
    const { emails, displayName, id } = profile;
    const oauthProfile = {
      email: emails[0].value,
      name: displayName,
      provider: "google" as const,
      providerId: id,
    };
    const tokens = await this.authService.validateOAuthUser(oauthProfile);
    done(null, tokens);
  }
}
