import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../models/users.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "../dtos/auth.dto";
import { UserRole } from "src/utils/enums";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { generateToken } from "../utils/tokens/generate-token";
import { clearCookies, setCookie } from "../utils/cookies/cookie.utils";
import { Response } from "express";
import { hashPassword } from "../utils/hashing/bcrypt.utils";
import { UsersService } from "../users.service";

@Injectable()
export class AuthProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }


    /**
     * register function
     * @param registerDto 
     * @returns success messge to verify email
     */
    public async register(registerDto: RegisterDto): Promise<{ msg: string }> {
        // 1. Destructure the DTO
        const { username, email, password } = registerDto;

        // 2. Check if the user already exists by email or username
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new BadRequestException('Email already exists');
            }
            if (existingUser.username === username) {
                throw new BadRequestException('Username already exists');
            }
        }

        // 3. Determine if this is the first account
        const isFirstAccount = (await this.userRepository.count()) === 0;
        const role = isFirstAccount ? UserRole.ADMIN : UserRole.USER;

        // 4. Generate a verification token
        const verificationToken = crypto.randomBytes(40).toString('hex');

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create a new user entity
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword, // NOTE: Make sure to hash this password before saving (bcrypt or similar)
            roles: [role],
            verificationToken,
            isVerified: false,
        });

        // 6. Save the new user
        await this.userRepository.save(user);

        // TODO: Send verification email

        // 7. Send success response
        return {
            msg: 'Success! Please check your email to verify your account',
        };
    }

    /**
     * login user
     * @param user 
     * @param response 
     * @param redirect 
     * @returns access & refresh token and user id
     */
    public async login(
        user: User,
        response: Response,
        redirect = false,
    ): Promise<{ accessToken: string; refreshToken: string; id: string }> {
        const tokenPayload = {
            userId: user.id,
            roles: user.roles,
            email: user.email,
        };
        
        // Generate the Access Token
        const accessToken = generateToken(
            this.jwtService,
            this.configService,
            tokenPayload,
            'JWT_ACCESS_TOKEN_SECRET',
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
        );

        // Generate the Refresh Token
        const refreshToken = generateToken(
            this.jwtService,
            this.configService,
            tokenPayload,
            'JWT_REFRESH_TOKEN_SECRET',
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
        );

        // Calculate expiration dates
        const expiresAccessToken = new Date(
            Date.now() +
            parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')),
        );
        const expiresRefreshToken = new Date(
            Date.now() +
            parseInt(this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')),
        );

        // Save hashed Refresh Token in the database
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateUser(
            { id: user.id }, // Query criteria
            { $set: { refreshToken: await hashPassword(refreshToken) } },
        );


        // Set cookies for tokens
        setCookie(response, 'Authentication', accessToken, expiresAccessToken.getTime(), this.configService);
        setCookie(response, 'Refresh', refreshToken, expiresRefreshToken.getTime(), this.configService);

        // Optional: handle redirect logic
        if (redirect) {
            response.redirect(this.configService.getOrThrow('GOOGLE_AUTH_REDIRECT_URI'));
        }

        // Return tokens and user ID
        return { id: user.id, accessToken, refreshToken };
    }   

    /**
     * google auth
     * @param param0 
     * @returns user
     */
    public async findOrCreateGoogleUser({
        username,
        email,
        googleId,
    }: {
        username: string;
        email: string;
        googleId: string;
    }): Promise<User> {
        // Step 1: Check if the user already exists by Google ID
        let user = await this.usersService.findOne({ googleId });

        if (!user) {
            // Step 2: Check if a user exists with the same email
            user = await this.usersService.findOne({ email });

            if (!user) {
                // Step 3: If no user exists, create a new one
                const isFirstAccount = (await this.usersService.countUsers()) === 0;
                const role = isFirstAccount ? UserRole.ADMIN : UserRole.USER;

                user = await this.usersService.createUser({
                    username,
                    email,
                    googleId,
                    password: null,
                    roles: [role],
                    isVerified: true, 
                    verified: new Date(),
                });
            } else {
                // Step 4: If a user exists with the same email but no Google ID
                user.googleId = googleId;

                // Mark as verified and set the verified date
                user.isVerified = true;
                user.verified = new Date();

                // Remove the verification token if it exists
                if (user.verificationToken) {
                    user.verificationToken = '';
                }

                // Update the user in the database
                await this.usersService.updateUser(
                    { id: user.id },
                    { $set: { googleId, isVerified: true, verified: new Date(), verificationToken: '' } },
                );
            }
        }

        return user;
    }

    /**
     * logout user
     * @param response 
     * @param userId 
     */
    async logout(response: Response, userId: string): Promise<void> {
        // Step 1: Set the refresh token to null for the user
        await this.userRepository.update({ id: userId }, { refreshToken: null });

        // Step 2: Clear cookies on the client side
        clearCookies(response, this.configService);
    }

}