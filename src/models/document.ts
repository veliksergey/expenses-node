import {Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn} from 'typeorm';
import {Transaction} from './transaction';

@Entity()
export class Document {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  name!: string;

  @Column()
  path!: string;

  // transaction
  @Column({nullable: false,})
  @Index()
  transactionId!: number;
  @ManyToOne(type => Transaction, (trans: Transaction) => trans.documents, {
    // eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  transaction!: Transaction;

}