import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { User } from './user/user.entity';
import { Role } from './roles/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.AUTH_DATABASE_HOST || 'auth-db',
      port: +process.env.AUTH_DATABASE_PORT || 5432,
      username: process.env.AUTH_DATABASE_USERNAME || 'postgres',
      password: process.env.AUTH_DATABASE_PASSWORD || '1111',
      database: process.env.AUTH_DATABASE_NAME || 'auth_service',
      entities: [User, Role],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    RolesModule,
  ],
})
export class AppModule {}
