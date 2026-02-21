import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    } as any);
    await this.em.flush();
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ id });
    if (!user) return null;

    this.userRepository.assign(user, {
      ...dto,
      ...(dto.password && { password: await bcrypt.hash(dto.password, 10) }),
    } as any);
    await this.em.flush();
    return user;
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (!user) return false;

    await this.em.removeAndFlush(user);
    return true;
  }
}
