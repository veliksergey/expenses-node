import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import {Transaction} from './index';

@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100,})
  @Index({unique: true,})
  name!: string;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.account)
  transactions!: Array<Transaction>;

}