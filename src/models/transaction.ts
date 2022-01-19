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
  JoinTable, OneToMany
} from 'typeorm';
import {Project, Vendor, Account, Person, Category, Document} from './index';

@Entity()
export class Transaction {

  // id
  @PrimaryGeneratedColumn()
  id!: number;

  // name
  @Column({
    length: 100,
  })
  name!: string;

  // amount
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  amount!: number;

  // related amount
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  relatedAmount!: number;

  // date
  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE'
  })
  date!: Date;

  // related date
  @Column({
    type: 'date',
    nullable: true,
  })
  relatedDate!: Date;

  // non taxable
  @Column({
    type: 'boolean',
    default: false,
  })
  nonTaxable!: boolean

  // notes
  @Column({
    type: 'text',
    nullable: true
  })
  notes!: string;

  // account
  @Column()
  @Index()
  accountId!: number;
  @ManyToOne(type => Account, (account: Account) => account.transactions, {
    // eager: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  account!: Account

  // category
  @Column({nullable: true,})
  @Index()
  categoryId!: number;
  @ManyToOne(type => Category, (category: Category) => category.transactions, {
    // eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  category!: Category;

  // person
  @Column()
  @Index()
  personId!: number;
  @ManyToOne(type => Person, (person: Person) => person.transactions, {
    // eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  person!: Person;

  // project
  @Column()
  @Index()
  projectId!: number;
  @ManyToOne(type => Project, (project: Project) => project.transactions, {
    // eager: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  project!: Project;

  // vendor
  @Column()
  @Index()
  vendorId!: number;
  @ManyToOne(type => Vendor, (vendor: Vendor) => vendor.transactions, {
    // eager: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  vendor!: Vendor;

  // documents (receipts, invoices)
  @OneToMany(type => Document, (document: Document) => document.transactions)
  documents!: Array<Document>;

  // related transactions
  @ManyToMany(type => Transaction)
  @JoinTable()
  related!: Array<Transaction>

  // createdAt
  @CreateDateColumn({select: false})
  createdAt!: Date;

  // updatedAt
  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  // deletedAt
  @DeleteDateColumn({select: false})
  deletedAt?: Date;

}