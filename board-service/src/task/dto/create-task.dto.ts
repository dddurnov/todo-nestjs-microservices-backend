import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task Name', description: 'Название задачи' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Task Description',
    description: 'Описание задачи',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'ID колонки, к которой относится задача',
  })
  @IsNotEmpty()
  @IsNumber()
  columnId: number;
}
