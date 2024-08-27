import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-user' })
  async getUser(data: { email: string }): Promise<User> {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
