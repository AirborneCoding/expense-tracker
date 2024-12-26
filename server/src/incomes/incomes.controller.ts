import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/current-user.decorator';
import { User } from 'src/users/models/users.entity';
import { CreateIncomeDto, UpdateIncomeDto } from './dtos/incomes.dto';

@Controller('incomes')
export class IncomesController {
    constructor(
        private readonly incomesService: IncomesService
    ) { }

    // create
    @Post()
    @UseGuards(JwtAuthGuard)
    public async createIncome(
        @CurrentUser() user: User,
        @Body() createIncomeDto: CreateIncomeDto,
    ) {
        return this.incomesService.createIncome(user, createIncomeDto);
    }

    // get all income
    @Get()
    @UseGuards(JwtAuthGuard)
    public async allIncomes(
        @CurrentUser() user: User,
    ) {
        return this.incomesService.getAllIncomes(user.id)
    }

    // delete
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public async deleteIncome(
        @CurrentUser() user: User,
        @Param('id') id: string
    ) {
        return this.incomesService.deleteIncomeById(user, id)
    }


    // TODOS => check them
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    public async updateIncome(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() updateIncomeDto: UpdateIncomeDto,
    ) {
        return this.incomesService.updateIncome(user, id, updateIncomeDto);
    }

    @Get('total')
    @UseGuards(JwtAuthGuard)
    public async calculateTotalIncome(
        @CurrentUser() user: User,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.incomesService.calculateTotalIncome(user, startDate, endDate);
    }
}
