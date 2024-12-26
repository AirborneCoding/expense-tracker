import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from '../models/budget.entity';
import { Repository } from 'typeorm';
import { CreateBudgetDto, UpdateBudgetDto } from '../dtos/budgets.dtos';
import { User } from 'src/users/models/users.entity';
import { checkPermissions } from 'src/utils/permissions';

@Injectable()
export class BudgetsProvider {

    constructor(
        @InjectRepository(Budget)
        private readonly budgetRepository: Repository<Budget>
    ) { }


    // Get all budgets for a user
    public async getAllBudgets(user: User): Promise<Budget[]> {
        return await this.budgetRepository.find({
            where: { user: { id: user.id } },
            relations: ['category'],
        });
    }

    // Create a new budget for a user
    public async createBudget(createBudgetDto: CreateBudgetDto, user: User): Promise<Budget> {
        const budget = this.budgetRepository.create({
            ...createBudgetDto,
            user,
            user_id: user.id
        });
        return await this.budgetRepository.save(budget);
    }

    // Update a budget (only for owners)
    public async updateBudget(id: string, updateBudgetDto: UpdateBudgetDto, user: User): Promise<Budget> {
        const budget = await this.getBudgetById(id);

        // Ensure the user owns the budget
        checkPermissions(user, budget.user.id);

        return await this.budgetRepository.save({
            ...budget,
            ...updateBudgetDto,
        });
    }

    // Delete a budget (only for owners)
    public async deleteBudget(id: string, user: User): Promise<{ message: string }> {
        const budget = await this.getBudgetById(id);

        // Ensure the user owns the budget
        checkPermissions(user, budget.user.id);

        await this.budgetRepository.delete(id);
        return { message: 'Budget deleted successfully' };
    }

    // Helper: Get budget by ID
    private async getBudgetById(id: string): Promise<Budget> {
        const budget = await this.budgetRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!budget) {
            throw new NotFoundException(`Budget with ID ${id} not found`);
        }
        return budget;
    }
    // track budget

    // expoert budgets CSV
}
