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

  async findOne(id: number, userId?: string) {
    return this.categoryRepository.findOne({
      id: id,
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

  async update(id: number, dto: UpdateCategoryDto, userId: string) {
    const category = await this.categoryRepository.findOne({
      id,
      $or: [{ userId: null }, { userId }],
    });
    if (!category) return null;

    this.categoryRepository.assign(category, {
      ...dto,
    } as any);
    await this.em.flush();
    return category;
  }

  async delete(id: number, userId: string) {
    const category = await this.categoryRepository.findOne({
      id,
      $or: [{ userId: null }, { userId }],
    });
    if (!category) return false;

    await this.em.removeAndFlush(category);
    return true;
  }
}
