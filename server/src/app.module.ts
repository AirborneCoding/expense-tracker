import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/models/users.entity';
import { IncomesModule } from './incomes/incomes.module';
import { Income } from './incomes/model/incomes.entity';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { Category } from './categories/models/category.entity';
import { Expense } from './expenses/models/expenses.entity';
import { Budget } from './categories/models/budget.entity';

@Module({
  imports: [
    // DB
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>("DB_DATABASE"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          port: config.get<number>("DB_PORT"),
          host: config.get<string>("DB_HOST"),
          synchronize: process.env.NODE_ENV !== "production",
          entities: [
            User,
            Income,
            Category,
            Expense,
            Budget
          ],
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),

    // modules
    UsersModule,
    IncomesModule,
    CategoriesModule,
    ExpensesModule
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
  ],
})
export class AppModule { }
