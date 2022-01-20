import {ConnectionOptions} from 'typeorm';
import {Project, Vendor, Transaction, Account, Category, Person, Document} from './src/models';

const config: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'expenses',
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  logging: process.env.DB_LOGGING === 'true' || false,
  entities: [Project, Vendor, Transaction, Account, Category, Person, Document],
  // entities: ['src/models/**/*.ts'],
  migrations: [
    './migration/**/*.ts'
  ],
  cli: {
    migrationsDir: 'src/migration',
  }
};

export default config;