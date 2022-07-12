import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';

export class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      name: configService.get<string>("DB_NAME"),
      type: configService.get<"postgres">("DB_TYPE"), // Make a generic type
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get<number>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      logging: true,
      entities: ["dist/**/*.entity.js"],
      autoLoadEntities: true,
      synchronize: true
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  connectionFactory: async (options) => {
    const connection = await createConnection(options);
    return connection;
  },
  inject: [ConfigService]
};