import {Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn} from 'typeorm';
import {Transaction} from './transaction';

@Entity()
export class Doc {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 100})
  docName!: string;

  @Column()
  docLink!: string;

  // transaction
  @Column({nullable: false,})
  @Index()
  transactionId!: number;
  @ManyToOne(type => Transaction, (trans: Transaction) => trans.docs, {
    // eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  transactions!: Transaction;

}