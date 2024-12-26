import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { User } from 'src/users/models/users.entity';
import { CurrentUser } from 'src/users/current-user.decorator';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos/expense.dtos';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {

    constructor(
        private readonly expensesService: ExpensesService
    ) { }

    // add expense
    @Post()
    public async addExpense(
        @Body() createExpenseDto: CreateExpenseDto,
        @CurrentUser() user: User,
    ) {
        return this.expensesService.addExpense(createExpenseDto, user);
    }
    // get all expenses
    @Get()
    public async getAllExpenses(@CurrentUser() user: User) {
        return this.expensesService.getAllExpenses(user);
    }

    // delete expense
    @Delete(':id')
    public async deleteExpense(@Param('id') id: string, @CurrentUser() user: User) {
        return this.expensesService.deleteExpense(id, user);
    }
    
    // update expense
    @Put(':id')
    public async updateExpense(
        @Param('id') id: string,
        @Body() updateExpenseDto: UpdateExpenseDto,
        @CurrentUser() user: User,
    ) {
        return this.expensesService.updateExpense(id, updateExpenseDto, user);
    }
}
