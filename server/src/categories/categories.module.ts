import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './models/category.entity';
import { BudgetsProvider } from './providers/budgets.provider';
import { Budget } from './models/budget.entity';

@Module({
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        BudgetsProvider
    ],
    imports: [
        TypeOrmModule.forFeature([Category, Budget]),
        JwtModule,
    ]
})
export class CategoriesModule { }
//       forwardRef(() => UsersModule),