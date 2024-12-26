import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/current-user.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/categories.dtos';
import { User } from 'src/users/models/users.entity';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { BudgetsProvider } from './providers/budgets.provider';
import { CreateBudgetDto, UpdateBudgetDto } from './dtos/budgets.dtos';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly budgetsService: BudgetsProvider
    ) { }

    //* FOR CATEGORIES
    // create category
    @Post()
    public async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @CurrentUser() user: User,
    ) {
        return this.categoriesService.createCategory(createCategoryDto, user);
    }

    // get all categories
    @Get()
    public async getAllCategories(@CurrentUser() user: User,) {
        return this.categoriesService.getAllCategories(user.id);
    }

    // update category
    @Put(':id')
    public async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @CurrentUser() user: User,
    ) {
        return this.categoriesService.updateCategory(id, updateCategoryDto, user);
    }

    // delete category
    @Delete(':id')
    public async deleteCategory(@Param('id') id: string, @CurrentUser() user: User) {
        return this.categoriesService.deleteCategory(id, user);
    }

    //* FOR BUDGET
    // Get all budgets for the current user
    @Get('budgets')
    public async getAllBudgets(@CurrentUser() user: User) {
        return this.budgetsService.getAllBudgets(user);
    }

    // Create a new budget
    @Post('budgets')
    public async createBudget(
        @CurrentUser() user: User,
        @Body() createBudgetDto: CreateBudgetDto,
    ) {
        return this.budgetsService.createBudget(createBudgetDto, user);
    }

    // Update a budget
    @Put('budgets/:id')
    public async updateBudget(
        @Param('id') id: string,
        @Body() updateBudgetDto: UpdateBudgetDto,
        @CurrentUser() user: User,
    ) {
        return this.budgetsService.updateBudget(id, updateBudgetDto, user);
    }

    // Delete a budget
    @Delete('budgets/:id')
    public async deleteBudget(
        @Param('id') id: string,
        @CurrentUser() user: User,
    ) {
        return this.budgetsService.deleteBudget(id, user);
    }

}
