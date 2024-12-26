import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthProvider } from './providers/auth.provider';
import { RegisterDto } from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from './models/users.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UsersService } from './users.service';
import { checkPermissions } from 'src/utils/permissions';

@Controller('users')
export class UsersController {

    constructor(
        private readonly authService: AuthProvider,
        private readonly usersService: UsersService
    ) { }

    @Get("test")
    public async test() {
        return 'OK'
    }

    //* FOR AUTHENTICATION ( normal auth(email,password) || google auth )
    // register
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    public register(@Body() body: RegisterDto) {
        return this.authService.register(body)
    }

    // login

    // login user
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login(user, response);
    }
    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login(user, response);
    }

    // google auth
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    googleLogin() { }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.login(user, res);
        const frontendRedirectUrl = "http://localhost:3000";

        // Redirect user to the frontend with tokens as query params
        res.redirect(`${frontendRedirectUrl}/auth/success?token=${accessToken}`);
    }

    // logout user
    @Delete('logout')
    @UseGuards(JwtAuthGuard)
    public logout(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.logout(response, user.id)
    }

    // TODO => verify email

    // TODO => forgot password

    // TODO => reset password

    // TODO => change email

    //* FOR USERS
    // show me
    @Get("showMe")
    @UseGuards(JwtAuthGuard)
    public async showMe(
        @CurrentUser() user: User,
    ) {
        return this.usersService.ShowMe(user.id)
    }

    // delete user
    @Delete()
    @UseGuards(JwtAuthGuard)
    public async DeleteUser(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.usersService.deleteUser(response, user.id)
    }

    // TODO => update user
}
