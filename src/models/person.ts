import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import {Transaction} from './transaction';

@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100,})
  @Index({unique: true,})
  personName!: string;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.person)
  transactions!: Array<Transaction>;
}