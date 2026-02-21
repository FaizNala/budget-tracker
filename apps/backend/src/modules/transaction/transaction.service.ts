import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Transaction } from '../../entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: EntityRepository<Transaction>,
    private readonly em: EntityManager,
  ) {}

  async findAll(userId?: string) {
    if (userId) {
      return this.transactionRepository.find({ userId });
    }
    return this.transactionRepository.findAll();
  }

  async findOne(id: number, userId?: string) {
    return this.transactionRepository.findOne({ id, userId });
  }

  async create(dto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create({
      ...dto,
    } as any);
    await this.em.flush();
    return transaction;
  }

  async update(id: number, dto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) return null;

    this.transactionRepository.assign(transaction, dto as any);
    await this.em.flush();
    return transaction;
  }

  async delete(id: number) {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) return false;

    await this.em.removeAndFlush(transaction);
    return true;
  }
}
