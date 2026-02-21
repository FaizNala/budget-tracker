import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Transaction {
  @PrimaryKey({ type: 'number', autoincrement: true })
  id!: number;

  @Property()
  userId!: string;

  @Property()
  categoryId!: number;

  @Property({ type: 'number' })
  amount!: number;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'date' })
  transactionDate!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data?: Partial<Transaction>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
