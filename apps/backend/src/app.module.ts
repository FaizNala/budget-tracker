import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        driver: PostgreSqlDriver,
        clientUrl: config.get('DATABASE_URL'),
        debug: config.get('NODE_ENV') === 'development',
        logger: (message: string) => console.log(`[MikroORM] ${message}`),
        autoLoadEntities: true,
        entitiesTs: ['./src/entities'],
        migrations: {
          path: './dist/migrations',
          pathTs: './src/migrations',
          emit: 'ts',
        },
      }),
    }),
    UserModule,
    CategoryModule,
  ],
})
export class AppModule {}
