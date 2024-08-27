import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveColumnDto {
  @ApiProperty({
    example: '1',
    description: 'Номер позиции колонки',
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}
