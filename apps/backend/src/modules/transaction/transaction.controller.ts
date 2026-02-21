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
import { TransactionService } from './transaction.service';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from './transaction.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user';
import type { JwtPayload } from '../auth/current-user';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.transactionService.findAll(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const transaction = await this.transactionService.findOne(id, user.sub);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTransactionSchema))
  create(@Body() dto: any, @CurrentUser() user: JwtPayload) {
    return this.transactionService.create({ ...dto, userId: user.sub });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateTransactionSchema))
  async update(
    @Param('id') id: number,
    @Body() dto: any,
    @CurrentUser() user: JwtPayload,
  ) {
    const transaction = await this.transactionService.update(id, dto, user.sub);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const success = await this.transactionService.delete(id, user.sub);
    if (!success) {
      throw new NotFoundException('Transaction not found');
    }
    return { message: 'Transaction deleted successfully' };
  }
}
