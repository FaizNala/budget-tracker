import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  async findAll(userId?: string) {
    if (userId) {
      return this.categoryRepository.find({
        $or: [{ userId: null }, { userId }],
      });
    }
    return this.categoryRepository.findAll();
  }

  async findOne(id: string, userId?: string) {
    return this.categoryRepository.findOne({
      id: Number(id),
      $or: [{ userId: null }, { userId }],
    });
  }

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...dto,
    } as any);
    await this.em.flush();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId?: string) {
    const category = await this.findOne(id, userId);
    if (!category) return null;

    this.categoryRepository.assign(category, {
      ...dto,
    } as any);
    await this.em.flush();
    return category;
  }

  async delete(id: string, userId?: string) {
    const category = await this.findOne(id, userId);
    if (!category) return false;

    await this.em.removeAndFlush(category);
    return true;
  }
}
