import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
// import {Transaction} from './index';
import {Transaction} from './transaction';

@Entity()
export class Vendor {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100,})
  @Index({unique: true,})
  name!: string;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.vendor)
  transactions!: Array<Transaction>

}