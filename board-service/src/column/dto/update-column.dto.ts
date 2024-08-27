import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({
    example: 'Column Name',
    description: 'Название колонки',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
