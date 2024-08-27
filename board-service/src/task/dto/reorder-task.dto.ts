import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReorderTaskDto {
  @ApiProperty({ example: '1', description: 'Новый номер задачи' })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}
