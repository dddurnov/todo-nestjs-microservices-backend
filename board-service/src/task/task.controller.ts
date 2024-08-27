import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { MoveToColumnTaskDto } from './dto/move-to-column-task.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Задачи')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Roles('USER')
  @ApiOperation({ summary: 'Создание новой задачи' })
  @ApiResponse({ status: 201, description: 'Задача успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
  @Post()
  async createTask(@Req() req, @Body() CreateTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(
      req.user.userId,
      CreateTaskDto.columnId,
      CreateTaskDto.title,
      CreateTaskDto.description,
    );
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Получение задачи по ID' })
  @ApiResponse({ status: 200, description: 'Задача успешно получена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @Get(':id')
  async getTaskById(@Req() req, @Param('id') id: number) {
    return await this.taskService.getTaskById(req.user.userId, id);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Получение всех задач' })
  @ApiResponse({ status: 200, description: 'Задачи успешно получены.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задачи не найдена.' })
  @ApiParam({
    name: 'columnId',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Get('column/:columnId')
  async getAllTasks(@Req() req, @Param('columnId') columnId: number) {
    return await this.taskService.getAllTasks(req.user.userId, columnId);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID задачи',
  })
  @Patch(':id')
  async updateTask(
    @Req() req,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(
      req.user.userId,
      id,
      updateTaskDto.title,
      updateTaskDto.description,
    );
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Изменение порядкового номера задачи по ID' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @Patch(':id/reorder')
  async reorderTask(
    @Req() req,
    @Param('id') id: number,
    @Body() reorderTaskDto: ReorderTaskDto,
  ) {
    const user = req.user.userId;
    await this.taskService.reorderTask(user, id, reorderTaskDto.order);
    return { message: 'Номер позиции успешно изменен' };
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Перемещение задачи между колонками' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID задачи',
  })
  @Patch(':id/move-to-column')
  async moveToColumnTask(
    @Req() req,
    @Param('id') id: number,
    @Body() moveToColumnTaskDto: MoveToColumnTaskDto,
  ) {
    await this.taskService.moveTaskToColumn(
      req.user.userId,
      id,
      moveToColumnTaskDto.newColumnId,
      moveToColumnTaskDto.newOrder,
    );
    return { message: 'Изменения успешно внесены' };
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiResponse({ status: 409, description: 'ID колонок совпадают.' })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID задачи',
  })
  async deleteTask(@Req() req, @Param('id') id: number) {
    await this.taskService.deleteTask(req.user.userId, id);
    return { message: 'Задача удалена' };
  }
}
