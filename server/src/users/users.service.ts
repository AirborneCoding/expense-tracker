import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/utils/enums';
import { clearCookies } from './utils/cookies/cookie.utils';
import { Response } from 'express';
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }


    //* FOR APP
    /**
     * show current user
     * @param id 
     * @returns user
     */
    async ShowMe(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    /**
     * delete users
     * @param response 
     * @param userId 
     * @returns success msg
     */
    public async deleteUser(response: Response, userId: string): Promise<{ msg: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        await this.userRepository.remove(user);
        clearCookies(response, this.configService);
        return { msg: 'User deleted successfully' };
    }


    //* FOR DEV
    /**
     * *update user
     * @param query 
     * @param updateData 
     * @param currentUser 
     * @returns 
     */
    public async updateUser(
        query: Partial<User>, // Query criteria for finding the user
        updateData: Record<string, any>, // Flexible update data to allow operations like $set
        currentUser?: User,
    ): Promise<User> {
        // Restrict updates if the current user is not an admin
        if (currentUser) {
            if (!currentUser.roles.includes(UserRole.ADMIN)) {
                if ('roles' in updateData) {
                    throw new UnauthorizedException('Only admins can modify user roles.');
                }

                // Prevent users from updating restricted fields
                const restrictedFields = ['email', 'username', 'password'];
                for (const field of restrictedFields) {
                    if (field in updateData) {
                        throw new UnauthorizedException(
                            `You are not allowed to update the field: ${field}`,
                        );
                    }
                }
            }
        }

        // Find the user to update
        const user = await this.userRepository.findOne({
            where: query as any,
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Apply the update (e.g., support $set or direct assignments)
        if (updateData.$set) {
            Object.assign(user, updateData.$set);
        } else {
            Object.assign(user, updateData);
        }

        // Save the updated user
        const updatedUser = await this.userRepository.save(user);

        return updatedUser;
    }

    async findOne(criteria: { googleId?: string; email?: string }): Promise<User | null> {
        return await this.userRepository.findOne({ where: criteria });
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async countUsers(): Promise<number> {
        return await this.userRepository.count();
    }

    async createUser(data: Partial<User>): Promise<User> {
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }

    async verifyUser(email: string, password: string) {
        try {
            // const user = await this.userRepository.findOne({ where: { email } });
            const user = await this.findOne({ email })
            const authenticated = await bcrypt.compare(password, user.password);
            if (!authenticated) throw new UnauthorizedException();
            return user;
        } catch (err) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
    }

    async veryifyUserRefreshToken(refreshToken: string, userId: string) {
        try {
            const user = await this.ShowMe(userId);
            const authenticated = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!authenticated) throw new UnauthorizedException();
            return user;
        } catch (err) {
            throw new UnauthorizedException('Refresh token is not valid.');
        }
    }

}
