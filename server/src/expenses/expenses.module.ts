import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Expense } from './models/expenses.entity';

@Module({
    controllers: [ExpensesController],
    providers: [
        ExpensesService
    ],
    imports: [
        TypeOrmModule.forFeature([Expense]),
        JwtModule,
    ]
})
export class ExpensesModule { }
