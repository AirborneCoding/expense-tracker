import { UnauthorizedException } from "@nestjs/common";
import { UserRole } from "../enums";
import { User } from "src/users/models/users.entity";


export const checkPermissions = (requestUser: User, resourceUserId: string) => {

    if (!resourceUserId) throw new UnauthorizedException('Resource user ID is missing');

    if (requestUser.roles.includes(UserRole.ADMIN)) return;
    if (requestUser.id === resourceUserId) return;
    throw new UnauthorizedException('Not authorized to access this route');
};
