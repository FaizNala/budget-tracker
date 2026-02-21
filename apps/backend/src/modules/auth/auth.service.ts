import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../entities/user.entity';
import { LoginDto, RegisterDto, TokenResponse } from './auth.dto';
import { env } from '../../config/env.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async register(dto: RegisterDto): Promise<TokenResponse> {
    const existingUser = await this.userRepository.findOne({
      email: dto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    } as any);

    await this.em.flush();

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_SECRET) as {
        sub: string;
        email: string;
        role: string;
      };

      const user = await this.userRepository.findOne({ id: payload.sub });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ id: userId });
  }

  private generateTokens(user: User): TokenResponse {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }
}
