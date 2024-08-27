import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Проекты')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles('USER')
  @ApiOperation({ summary: 'Создание проекта' })
  @ApiResponse({ status: 201, description: 'Проект создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Post()
  async createProject(
    @Request() req,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return await this.projectService.createProject(
      req.user.userId,
      createProjectDto.title,
      createProjectDto.description,
    );
  }
  @Roles('USER')
  @ApiOperation({ summary: 'Получение всех проектов пользователя' })
  @ApiResponse({ status: 200, description: 'Проекты получены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проекты не найдены' })
  @Get()
  async getProjects(@Request() req) {
    return await this.projectService.getAllProjects(req.user.userId);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Получение проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Get(':id')
  async getProjectById(@Request() req, @Param('id') id: number) {
    return await this.projectService.getProjectById(req.user.userId, id);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Изменение проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект изменен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Patch(':id')
  async updateProject(
    @Request() req,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: number,
  ) {
    return await this.projectService.updateProject(
      req.user.userId,
      id,
      updateProjectDto.title,
      updateProjectDto.description,
    );
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Удаление проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект удален' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Delete(':id')
  async deleteProject(@Request() req, @Param('id') id: number) {
    await this.projectService.deleteProject(req.user.userId, id);
    return { message: 'Проект удален' };
  }
}
