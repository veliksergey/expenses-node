"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./src/models");
const path = require('path');
const config = [
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
        entities: [models_1.Project, models_1.Vendor, models_1.Transaction],
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
        entities: [models_1.Project, models_1.Vendor, models_1.Transaction],
        // entities: ['src/models/**/*.ts'],
        migrations: [
            './migration/**/*.ts'
        ],
        cli: {
            migrationsDir: 'src/migration',
        }
    }
];
exports.default = config;
