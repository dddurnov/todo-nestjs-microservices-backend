import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'sC6u9@example.com',
    description: 'Email пользователя',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
