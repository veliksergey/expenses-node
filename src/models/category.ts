import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import {Transaction} from './transaction';

export enum CatType {
  ALL = 0,
  IN = 1,
  OUT = 2,
  MILEAGE = 3,
}

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  @Index({unique: true,})
  name!: string;

  @Column({
    type: 'smallint',
    enum: CatType,
    nullable: false,
    default: 0
  })
  type!: number;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.category)
  transactions!: Array<Transaction>;

}