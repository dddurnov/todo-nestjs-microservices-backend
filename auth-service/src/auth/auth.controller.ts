import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { MessagePattern } from '@nestjs/microservices';

@ApiBearerAuth()
@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
  })
  @ApiResponse({ status: 400, description: 'Неверные данные.' })
  async register(@Body() AuthDto: AuthDto): Promise<{ message: string }> {
    await this.authService.register(AuthDto.email, AuthDto.password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно аутентифицирован.',
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() AuthDto: AuthDto) {
    const user = await this.authService.validateUser(
      AuthDto.email,
      AuthDto.password,
    );
    if (!user) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
