import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import googleOauthConfig from '../utils/config/google-oauth.config';
import { AuthProvider } from '../providers/auth.provider';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY) private googleConfiguration:
      ConfigType<typeof googleOauthConfig>,

    configService: ConfigService,
    private readonly authService: AuthProvider,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['profile', 'email'], // what we want to return from google
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback
  ) {
    const { givenName, familyName } = profile.name;
    const email = profile.emails[0]?.value;

    if (!email) return done(new UnauthorizedException('Email not found in Google profile'), null);

    let user = await this.authService.findOrCreateGoogleUser({
      username: `${givenName} ${familyName}`,
      email,
      googleId: profile.id,
    });

    return done(null, user);
  }

}
