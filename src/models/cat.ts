import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Index} from 'typeorm';
import {Transaction} from './transaction';

export enum CatType {
  ALL = 0,
  IN = 1,
  OUT = 2,
  MILEAGE = 3,
}

@Entity()
export class Cat {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  @Index({unique: true,})
  catName!: string;

  @Column({
    type: 'smallint',
    enum: CatType,
    nullable: false,
    default: 0
  })
  catType!: number;

  @OneToMany(type => Transaction, (trans: Transaction) => trans.cat)
  transactions!: Array<Transaction>;

}