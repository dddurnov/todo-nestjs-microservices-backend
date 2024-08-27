import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({
    example: '1',
    description: 'ID проекта',
  })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({
    example: 'Column Name',
    description: 'Название колонки',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
