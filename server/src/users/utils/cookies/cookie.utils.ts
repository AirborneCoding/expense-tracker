import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export const setCookie = (
    response: Response,
    name: string,
    token: string,
    expirationTime: number,
    configService: ConfigService,
): void => {
    response.cookie(name, token, {
        httpOnly: true,
        secure: configService.get('NODE_ENV') === 'production',
        expires: new Date(expirationTime),
    });
};

export const clearCookies = (response: Response, configService: ConfigService): void => {
    response.clearCookie('Authentication', {
        httpOnly: true,
        secure: configService.get('NODE_ENV') === 'production',
    });
    response.clearCookie('Refresh', {
        httpOnly: true,
        secure: configService.get('NODE_ENV') === 'production',
    });
};
