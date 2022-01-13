import {ConnectionOptions} from 'typeorm';
import {Project, Vendor, Transaction} from './src/models';
const path = require('path');

const config: Array<ConnectionOptions> = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'expenses',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
    logging: process.env.DB_LOGGING === 'true' || false,
    entities: [Project, Vendor, Transaction],
    // entities: ['src/models/**/*.ts'],
    migrations: [
      './migration/**/*.ts'
    ],
    cli: {
      migrationsDir: 'src/migration',
    }
  },
  {
    name: 'secondary',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'expenses',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
    logging: process.env.DB_LOGGING === 'true' || false,
    entities: [Project, Vendor, Transaction],
    // entities: ['src/models/**/*.ts'],
    migrations: [
      './migration/**/*.ts'
    ],
    cli: {
      migrationsDir: 'src/migration',
    }
  }
];

export default config;