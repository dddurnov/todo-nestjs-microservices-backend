import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { ColumnModule } from './column/column.module';
import { TaskColumn } from './column/task-column.entity';
import { Project } from './project/project.entity';
import { Task } from './task/task.entity';
import { TaskModule } from './task/task.module';
import { RabbitMQModule } from './rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BOARD_DATABASE_HOST || 'board-db',
      port: +process.env.BOARD_DATABASE_PORT || 5432,
      username: process.env.BOARD_DATABASE_USERNAME || 'postgres',
      password: process.env.BOARD_DATABASE_PASSWORD || '1111',
      database: process.env.BOARD_DATABASE_NAME || 'board_service',
      entities: [Project, TaskColumn, Task],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProjectModule,
    ColumnModule,
    TaskModule,
    RabbitMQModule,
  ],
})
export class AppModule {}
