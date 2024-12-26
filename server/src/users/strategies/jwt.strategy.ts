import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TokenPayload } from '../utils/tokens/token-payload.interface';
import { User } from '../models/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.Authentication,
            ]),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: TokenPayload): Promise<User> {
        const user = await this.usersService.ShowMe(payload.userId);

        if (!user || user.email !== payload.email) throw new ForbiddenException('Access denied');

        if (!user.roles.some(role => payload.roles.includes(role))) throw new ForbiddenException('Access denied');

        return user;
    }

}
