import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UsePipes,
  NotFoundException,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSchema, UpdateUserSchema } from './user.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user';
import type { JwtPayload } from '../auth/current-user';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.userService.findOne(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() dto: any) {
    return this.userService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  async update(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: JwtPayload) {
    if (id !== user.sub) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const userData = await this.userService.update(id, dto);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    if (id !== user.sub) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    const success = await this.userService.delete(id);
    if (!success) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
