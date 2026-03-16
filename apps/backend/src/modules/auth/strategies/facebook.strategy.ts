import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { AuthService } from "../auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["emails", "name", "displayName"],
      scope: ["email"],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ) {
    const { emails, displayName, id } = profile;
    if (!emails || !emails.length) {
      done(new Error("Email not provided by Facebook"), null);
      return;
    }
    const oauthProfile = {
      email: emails[0].value,
      name: displayName,
      provider: "facebook" as const,
      providerId: id,
    };
    const tokens = await this.authService.validateOAuthUser(oauthProfile);
    done(null, tokens);
  }
}

