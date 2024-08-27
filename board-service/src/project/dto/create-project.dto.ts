import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Project Name',
    description: 'Название проекта',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Project Description',
    description: 'Описание проекта',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
