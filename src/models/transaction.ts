import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
  JoinTable
} from 'typeorm';
import {Project, Vendor} from './index';

@Entity()
export class Transaction {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 100,
    nullable: false,
    update: true,
    insert: true,
    select: true,
  })
  transName!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  amount!: number;

  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE'
  })
  date!: Date;

  @Column({
    type: 'text',
    nullable: true
  })
  notes!: string;

  @Column({nullable: false,})
  @Index()
  projectId!: number;
  @ManyToOne(type => Project, (project: Project) => project.transactions, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  project!: Project;

  @Column({nullable: false,})
  @Index()
  vendorId!: number;
  @ManyToOne(type => Vendor, (vendor: Vendor) => vendor.transactions, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  vendor!: Vendor;

  @ManyToMany(type => Transaction)
  @JoinTable()
  related!: Array<Transaction>

  @CreateDateColumn({select: false})
  createdAt!: Date;

  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  @DeleteDateColumn({select: false})
  deletedAt?: Date;

}