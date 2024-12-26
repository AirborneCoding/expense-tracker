import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';

export const generateToken = (
    jwtService: JwtService,
    configService: ConfigService,
    payload: TokenPayload,
    secretKey: string,
    expirationKey: string,
): string => {
    const expiration = configService.getOrThrow<string>(expirationKey);
    return jwtService.sign(payload, {
        secret: configService.getOrThrow(secretKey),
        expiresIn: `${expiration}ms`,
    });
};
