import { forwardRef, Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './model/incomes.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [IncomesController],
    providers: [
        IncomesService
    ],
    imports: [
        TypeOrmModule.forFeature([Income]),
        forwardRef(() => UsersModule),
        JwtModule,
    ]
})
export class IncomesModule { }
