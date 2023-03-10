/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {
    //
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode === 'PROD';
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getJwtRefreshSecret() {
    return this.getValue('JWT_REFRESH_SECRET', true);
  }

  public getJwtTokenExpires() {
    return this.getValue('JWT_TOKEN_EXPIRES', false) || '60s';
  }

  public getJwtRefreshTokenExpires() {
    return this.getValue('JWT_REFRESH_TOKEN_EXPIRES', false) || '1d';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DB'),
      entities: ['entities/*.entity.ts', 'entities/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      // migrationsTableName: 'migration',
      // migrations: ['src/migration/*.ts'],
      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_TOKEN_EXPIRES',
  'JWT_REFRESH_TOKEN_EXPIRES',
]);

export { configService };
