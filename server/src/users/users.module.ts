import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthProvider } from './providers/auth.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import googleOauthConfig from './utils/config/google-oauth.config';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        AuthProvider,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        GoogleStrategy

    ],
    exports: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: { expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'), },
            }),
        }),
        PassportModule,
        JwtModule,
        ConfigModule.forFeature(googleOauthConfig)

    ]
})
export class UsersModule { }
