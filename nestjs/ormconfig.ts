import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const dbConfig = {
  synchronize: false,
  migrations: ['src/migrations/*.js'],
} as DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: process.env.DB_TYPE, // sqlite
      database: process.env.DB_NAME, //db.sqlite,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: process.env.DB_TYPE, // sqlite
      database: process.env.DB_NAME, //test.sqlite,
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    if (process.env.DB_TYPE === 'sqlite') {
      Object.assign(dbConfig, {
        type: process.env.DB_TYPE, // sqlite
        database: process.env.DB_NAME, //db.sqlite,
        entities: ['**/*.entity.js'],
      });
    } else {
      Object.assign(dbConfig, {
        type: process.env.DB_TYPE,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        schema: process.env.DB_SCHEMA,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        cache: {
          duration: process.env.DB_CACHE_DURATION,
        },
        synchronize: false,
        migrations: ['dist/src/migrations/*{.ts,.js}'],
        migrationsRun: true,
        entities: ['**/*.entity.js'],
      });
    }
    break;
  default:
    Object.assign(dbConfig, {
      type: process.env.DB_TYPE, // sqlite
      database: process.env.DB_NAME, //db.sqlite,
      entities: ['**/*.entity.js'],
    });
}

export const dataSourceOptions: DataSourceOptions = dbConfig;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
