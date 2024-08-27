import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ColumnService } from './column.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { MoveColumnDto } from './dto/move-column.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Колонки')
@ApiBearerAuth('access-token')
@Controller('columns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Roles('USER')
  @ApiOperation({ summary: 'Создание колонки' })
  @ApiResponse({ status: 201, description: 'Колонка создана' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @Post()
  async createColumn(@Req() req, @Body() createColumnDto: CreateColumnDto) {
    return await this.columnService.createColumn(
      req.user.userId,
      createColumnDto.projectId,
      createColumnDto.title,
    );
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Получение колонок по ID проекта' })
  @ApiResponse({ status: 200, description: 'Колонки получены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'ID проекта',
    required: true,
    example: 1,
  })
  @Get('project/:projectId')
  async getColumns(@Req() req, @Param('projectId') projectId: number) {
    return await this.columnService.getColumns(req.user.userId, projectId);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Получение колонки по ID' })
  @ApiResponse({ status: 200, description: 'Колонка получена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Get(':id')
  async getColumnById(@Req() req, @Param('id') id: number) {
    return await this.columnService.getColumnById(req.user.userId, id);
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Изменение колонки по ID' })
  @ApiResponse({ status: 200, description: 'Колонка изменена' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Put(':id')
  async updateColumn(
    @Req() req,
    @Param('id') id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return await this.columnService.updateColumn(
      req.user.userId,
      id,
      updateColumnDto.title,
    );
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Изменение номера позиции колонки по ID' })
  @ApiResponse({ status: 200, description: 'Позиция изменена' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Patch(':id/move')
  async moveColumn(
    @Req() req,
    @Param('id') id: number,
    @Body() moveColumnDto: MoveColumnDto,
  ) {
    const userId = req.user.userId;
    await this.columnService.moveColumn(userId, id, moveColumnDto.order);
    return { message: 'Позиция изменена' };
  }

  @Roles('USER')
  @ApiOperation({ summary: 'Удаление колонки по ID' })
  @ApiResponse({ status: 200, description: 'Колонка удалена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Delete(':id')
  async deleteColumn(@Req() req, @Param('id') id: number) {
    await this.columnService.deleteColumn(req.user.userId, id);
    return { message: 'Колонка удалена' };
  }
}
