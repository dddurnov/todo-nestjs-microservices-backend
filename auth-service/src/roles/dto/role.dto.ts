import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'ROLE NAME', description: 'Название задачи' })
  @IsNotEmpty()
  @IsString()
  roleName: string;
}
