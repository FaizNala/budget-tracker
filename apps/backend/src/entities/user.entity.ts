import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @Property()
  password!: string;

  @Property({ type: 'string', default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
