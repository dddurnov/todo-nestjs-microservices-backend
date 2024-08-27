import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskColumn } from './task-column.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/project/project.entity';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(TaskColumn)
    private columnRepository: Repository<TaskColumn>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createColumn(
    userId: number,
    projectId: number,
    title: string,
  ): Promise<TaskColumn> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId: userId },
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    const order = (await this.getColumns(userId, projectId)).length + 1;

    const column = await this.columnRepository.create({
      title,
      order,
      project,
    });
    return await this.columnRepository.save(column);
  }

  async getColumns(userId: number, projectId: number): Promise<TaskColumn[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, userId: userId },
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    return await this.columnRepository.find({
      where: { project: { id: projectId } },
      relations: ['tasks'],
      order: { order: 'ASC' },
    });
  }

  async getColumnById(userId: number, id: number): Promise<TaskColumn> {
    const column = await this.columnRepository.findOne({
      where: { id, project: { userId: userId } },
      relations: ['tasks', 'project'],
    });
    if (!column) {
      throw new NotFoundException('Колонка не найдена');
    }
    return column;
  }

  async updateColumn(
    userId: number,
    id: number,
    title: string,
  ): Promise<TaskColumn> {
    const column = await this.getColumnById(userId, id);
    column.title = title;
    return this.columnRepository.save(column);
  }

  async moveColumn(userId: number, id: number, order: number): Promise<void> {
    const column = await this.getColumnById(userId, id);
    const columns = await this.getColumns(userId, column.project.id);
    const curOrder = column.order;

    if (order < 1) {
      order = 1;
    } else if (order > columns.length) {
      order = columns.length;
    }

    const queryRunner =
      this.columnRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let col of columns) {
        if (order > curOrder && col.order > curOrder && col.order <= order) {
          col.order -= 1;
        } else if (
          order < curOrder &&
          col.order < curOrder &&
          col.order >= order
        ) {
          col.order += 1;
        }
        await queryRunner.manager.save(col);
      }
      column.order = order;
      await queryRunner.manager.save(column);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteColumn(userId: number, id: number): Promise<void> {
    const column = await this.getColumnById(userId, id);
    const columns = await this.getColumns(userId, column.project.id);
    const order = column.order;

    const queryRunner =
      this.columnRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let col of columns) {
        if (col.order > order) {
          col.order -= 1;
          await this.columnRepository.save(col);
        }
      }
      await queryRunner.manager.remove(TaskColumn, column);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
