import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleDto } from './dto/role.dto';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 201, description: 'Роль успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @Post()
  async createRole(@Body() roleDto: RoleDto) {
    return this.rolesService.createRole(roleDto.roleName);
  }

  @ApiOperation({ summary: 'Назначене роли пользователю.' })
  @ApiResponse({ status: 201, description: 'Роль добавлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  @ApiResponse({
    status: 409,
    description: 'Такая роль уже есть у пользователя.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID пользователя',
  })
  @Post('assign/:id')
  async assignRoleToUser(@Param('id') id: number, @Body() roleDto: RoleDto) {
    return await this.userService.assignRoleToUser(id, roleDto.roleName);
  }

  @ApiOperation({ summary: 'Получение ролей потльзователя.' })
  @ApiResponse({ status: 200, description: 'Роли получены.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID пользователя',
  })
  @Get('users/:id')
  async getUserRoles(@Param('id') id: number) {
    return await this.userService.getUserRoles(id);
  }

  @MessagePattern({ cmd: 'check_user_role' })
  async getUserRolesForGuard(data: { userId: number }) {
    return this.userService.getUserRoles(data.userId);
  }
}
