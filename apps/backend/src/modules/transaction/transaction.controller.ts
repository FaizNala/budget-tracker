import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, NotFoundException, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionSchema, UpdateTransactionSchema } from './transaction.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.transactionService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('userId') userId?: string) {
    const transaction = await this.transactionService.findOne(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTransactionSchema))
  create(@Body() dto: any) {
    return this.transactionService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateTransactionSchema))
  async update(@Param('id') id: number, @Body() dto: any) {
    const transaction = await this.transactionService.update(id, dto);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const success = await this.transactionService.delete(id);
    if (!success) {
      throw new NotFoundException('Transaction not found');
    }
    return { message: 'Transaction deleted successfully' };
  }
}
