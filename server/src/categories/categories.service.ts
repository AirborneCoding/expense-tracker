import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './models/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/models/users.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/categories.dtos';
import { checkPermissions } from 'src/utils/permissions';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
    ) { }

    /**
       * Get all categories
       * @returns list of all categories
       */
    public async getAllCategories(userId: string): Promise<Category[]> {
        return await this.categoriesRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });
    }

    /**
  * Create a new category
  * @param createCategoryDto
  * @param user - current authenticated user
  * @returns created category
  */
    public async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            user,
        });
        return await this.categoriesRepository.save(category);
    }

    /**
  * Update category (only for owners)
  * @param id
  * @param updateCategoryDto
  * @param user - current authenticated user
  * @returns updated category
  */
    public async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category> {
        const category = await this.getCategoryById(id);

        checkPermissions(user, category.user.id);

        return await this.categoriesRepository.save({
            ...category,
            ...updateCategoryDto,
        });
    }


    public async deleteCategory(id: string, user: User): Promise<{ message: string }> {
        const category = await this.getCategoryById(id);
        checkPermissions(user, category.user.id);
        await this.categoriesRepository.delete(id);
        return { message: 'Category deleted successfully' };
    }


    // 
    private async getCategoryById(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }
}
