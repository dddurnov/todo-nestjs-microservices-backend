import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: 'New Project Title',
    description: 'Новое название проекта',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'New Project Description',
    description: 'Новое описание проекта',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
