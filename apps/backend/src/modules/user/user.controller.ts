import { Controller, Get, Post, Put, Body, Param, UsePipes, NotFoundException, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserSchema, UpdateUserSchema } from './user.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
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
  async update(@Param('id') id: string, @Body() dto: any) {
    const user = await this.userService.update(id, dto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.userService.delete(id);
    if (!success) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' }; 
  }
}
