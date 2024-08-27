import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('GUARD_CLIENT') private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const response = await firstValueFrom(
      this.client.send<{ isValid: boolean; user: any }>(
        { cmd: 'validate_token' },
        { token },
      ),
    );

    if (!response.isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = response.user;
    return true;
  }
}
