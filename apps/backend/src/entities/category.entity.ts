import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity()
export class Category {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'string', default: CategoryType.EXPENSE })
  type: CategoryType = CategoryType.EXPENSE;

  @Property({ nullable: true })
  userId?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data?: Partial<Category>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
