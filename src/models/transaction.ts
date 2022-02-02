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
  OneToMany
} from 'typeorm';
import {Project, Vendor, Account, Person, Category, Document} from './index';

@Entity()
export class Transaction {

  // id
  @PrimaryGeneratedColumn()
  id!: number;

  // type
  @Column({
    type: 'smallint',
    nullable: false,
    default: 0
  })
  type!: number // 0 = out, 1 = in

  // name
  @Column({
    length: 100,
    nullable: true,
  })
  name!: string;

  // amount
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount!: number;

  // related amount
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  relatedAmount!: number | null;

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
  relatedDate!: Date | null;

  // notes
  @Column({
    type: 'text',
    nullable: true
  })
  notes!: string;

  // account
  @Column({nullable: true})
  @Index()
  accountId!: number;
  @ManyToOne(type => Account, (account: Account) => account.transactions, {
    // eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  account!: Account;

  // category
  @Column({nullable: true})
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
  @Column({nullable: true})
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
  @Column({nullable: true})
  @Index()
  projectId!: number;
  @ManyToOne(type => Project, (project: Project) => project.transactions, {
    // eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  project!: Project;

  // vendor
  @Column({nullable: true})
  @Index()
  vendorId!: number;
  @ManyToOne(type => Vendor, (vendor: Vendor) => vendor.transactions, {
    // eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  vendor!: Vendor;

  // documents (receipts, invoices)
  @OneToMany(type => Document, (document: Document) => document.transaction)
  documents!: Array<Document>;

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