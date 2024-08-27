import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveToColumnTaskDto {
  @ApiProperty({ example: '1', description: 'ID новой колонки' })
  @IsNumber()
  @IsNotEmpty()
  newColumnId: number;

  @ApiProperty({ example: '1', description: 'Новый номер задачи' })
  @IsNumber()
  @IsNotEmpty()
  newOrder: number;
}
