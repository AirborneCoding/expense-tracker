// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { Reflector } from "@nestjs/core";
// import { JwtService } from "@nestjs/jwt";
// import { Request } from "express";
// import { UsersService } from "../users.service";
// import { CURRENT_USER_KEY } from "src/utils/constants";
// import { JWTPayloadType } from "src/utils/types/jwt";
// import { UserRole } from "src/utils/enums";


// @Injectable()
// export class AuthRolesGuard implements CanActivate {

//     constructor(
//         private readonly jwtService: JwtService,
//         private readonly configService: ConfigService,
//         private readonly reflector: Reflector,
//         private readonly userService: UsersService
//     ) { }

//     async canActivate(context: ExecutionContext) {

//         const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()])

//         if (!roles || roles.length === 0) return false

//         const req: Request = context.switchToHttp().getRequest()
//         const [type, token] = req.headers.authorization?.split(' ') ?? []

//         if (token && type === "Bearer") {
//             try {
//                 const payload: JWTPayloadType = await this.jwtService.verifyAsync(
//                     token,
//                     {
//                         secret: this.configService.get<string>("JWT_SECRET"),
//                     }
//                 )
//                 const user = await this.userService.ShowMe(payload.id)
//                 if (!user) return false
//                 if (roles.includes(user.roles)) {
//                     req[CURRENT_USER_KEY] = payload
//                     return true
//                 }
//                 req[CURRENT_USER_KEY] = payload
//             } catch (error) {
//                 throw new UnauthorizedException("access denied, invalid token")
//             }
//         }
//         else {
//             throw new UnauthorizedException("access denied, no token provided")
//         }
//         return false
//     }
// }