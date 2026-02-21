import { defineConfig } from '@mikro-orm/postgresql';
import { config } from 'dotenv';

config();

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV === 'development',
  logger: console.log,
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    emit: 'ts',
  },
});
