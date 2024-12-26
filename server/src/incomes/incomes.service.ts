import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Income } from './model/incomes.entity';
import { UsersService } from 'src/users/users.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dtos/incomes.dto';
import { User } from 'src/users/models/users.entity';
import { checkPermissions } from 'src/utils/permissions';

@Injectable()
export class IncomesService {

    constructor(
        @InjectRepository(Income)
        private readonly incomesRepository: Repository<Income>,
        private readonly usersService: UsersService
    ) { }


    /**
        * Create a new income
        * @param user
        * @param createIncomeDto
        * @returns created income
        */
    public async createIncome(user: User, createIncomeDto: CreateIncomeDto): Promise<Income> {
        const income = this.incomesRepository.create({
            ...createIncomeDto,
            user,
            user_id: user.id,
        });
        return await this.incomesRepository.save(income);
    }

    /**
     * get all incomes
     * @returns incomes data
     */
    public async getAllIncomes(id: string): Promise<Income[]> {
        return await this.incomesRepository.find({
            where: { user_id: id },
            order: { date_received: 'DESC' },
        });
    }

    /**
     * delete income by id
     * @param id 
     * @returns success msg
     */
    public async deleteIncomeById(user: User, id: string): Promise<{ message: string }> {
        // const result = await this.incomesRepository.delete(id);
        // if (result.affected === 0) throw new NotFoundException(`Income with ID ${id} not found`);

        const income = await this.incomesRepository.findOne({ where: { id } });
        if (!income) throw new NotFoundException(`Income with ID ${id} not found`);

        checkPermissions(user, income.user_id);
        await this.incomesRepository.delete(id);
        return { message: 'Income deleted successfully' };
    }

    // TODOS => check them

    public async updateIncome(
        user: User,
        id: string,
        updateIncomeDto: UpdateIncomeDto,
    ): Promise<Income> {
        const income = await this.incomesRepository.findOne({ where: { id, user } });
        if (!income) throw new NotFoundException(`Income with ID ${id} not found`);
        Object.assign(income, updateIncomeDto);
        return await this.incomesRepository.save(income);
    }

    public async calculateTotalIncome(
        user: User,
        startDate: string,
        endDate: string,
    ): Promise<{ totalIncome: number }> {
        // Query incomes for the given user and date range
        const incomes = await this.incomesRepository.find({
            where: {
                user,
                date_received: Between(new Date(startDate), new Date(endDate)),
            },
        });

        // Calculate the total income
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

        return { totalIncome };
    }
}
