import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, NotFoundException, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategorySchema, UpdateCategorySchema } from './category.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.categoryService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('userId') userId?: string) {
    const category = await this.categoryService.findOne(id, userId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  create(@Body() dto: any) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  async update(@Param('id') id: number, @Body() dto: any) {
    const category = await this.categoryService.update(id, dto);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const success = await this.categoryService.delete(id);
    if (!success) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
