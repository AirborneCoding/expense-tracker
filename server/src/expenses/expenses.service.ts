import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './models/expenses.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos/expense.dtos';
import { User } from 'src/users/models/users.entity';
import { checkPermissions } from 'src/utils/permissions';

@Injectable()
export class ExpensesService {

    constructor(
        @InjectRepository(Expense)
        private readonly expensesRepository: Repository<Expense>,
    ) { }


    public async addExpense(createExpenseDto: CreateExpenseDto, user: User): Promise<Expense> {
        const expense = this.expensesRepository.create({
            ...createExpenseDto,
            user,
            user_id: user.id,
        });
        return await this.expensesRepository.save(expense);
    }

    public async getAllExpenses(user: User): Promise<Expense[]> {
        return await this.expensesRepository.find({
            where: { user: { id: user.id } },
            relations: ['category'],
        });
    }

    public async updateExpense(
        id: string,
        updateExpenseDto: UpdateExpenseDto,
        user: User,
    ): Promise<Expense> {
        const expense = await this.getExpenseById(id);
        checkPermissions(user, expense.user.id);

        Object.assign(expense, updateExpenseDto);
        return await this.expensesRepository.save(expense);
    }

    public async deleteExpense(id: string, user: User): Promise<{ message: string }> {
        const expense = await this.getExpenseById(id);
        checkPermissions(user, expense.user.id);

        await this.expensesRepository.delete(id);
        return { message: 'Expense deleted successfully' };
    }

    private async getExpenseById(id: string): Promise<Expense> {
        const expense = await this.expensesRepository.findOne({ where: { id }, relations: ['user'] });
        if (!expense) throw new NotFoundException(`Expense with ID ${id} not found`);
        return expense;
    }
}
