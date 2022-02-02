import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import {Transaction} from './index';

@Entity()
export class Project {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100,})
  @Index({unique: true,}) // ToDo: do I need indexes for names??
  name!: string;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.project)
  transactions!: Array<Transaction>;

}