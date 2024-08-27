import { Module } from '@nestjs/common';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskColumn } from './task-column.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskColumn]), ProjectModule],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService, TypeOrmModule],
})
export class ColumnModule {}
