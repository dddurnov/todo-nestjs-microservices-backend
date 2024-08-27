import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(
    userId: number,
    title: string,
    description: string,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      title,
      description,
      userId,
    });
    return await this.projectRepository.save(project);
  }

  async getProjectById(userId: number, id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, userId },
      relations: ['columns', 'columns.tasks'],
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    return project;
  }

  async getAllProjects(userId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userId },
      relations: ['columns', 'columns.tasks'],
    });
  }

  async updateProject(
    userId: number,
    id: number,
    title: string,
    description: string,
  ): Promise<Project> {
    if (!title && !description) {
      throw new BadRequestException(
        'Необходимо указать хотя бы одно поле для обновления',
      );
    }
    const project = await this.getProjectById(userId, id);
    if (title) {
      project.title = title;
    }
    if (description) {
      project.description = description;
    }
    return await this.projectRepository.save(project);
  }

  async deleteProject(userId: number, id: number): Promise<void> {
    const project = await this.getProjectById(userId, id);
    await this.projectRepository.remove(project);
  }
}
