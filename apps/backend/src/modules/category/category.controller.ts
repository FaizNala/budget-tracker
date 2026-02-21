import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategorySchema, UpdateCategorySchema } from './category.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user';
import type { JwtPayload } from '../auth/current-user';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.categoryService.findAll(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const category = await this.categoryService.findOne(id, user.sub);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  create(@Body() dto: any, @CurrentUser() user: JwtPayload) {
    return this.categoryService.create({ ...dto, userId: user.sub });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  async update(@Param('id') id: number, @Body() dto: any, @CurrentUser() user: JwtPayload) {
    const category = await this.categoryService.update(id, dto, user.sub);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const success = await this.categoryService.delete(id, user.sub);
    if (!success) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
