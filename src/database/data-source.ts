import { databaseConfig } from '../config/database.config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './data-source-options';

export const dataSource = new DataSource(
  buildDataSourceOptions(databaseConfig()),
);
