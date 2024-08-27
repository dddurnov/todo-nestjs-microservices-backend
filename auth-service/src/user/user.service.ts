import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    let userRole = await this.rolesService.findRoleByName('USER');
    if (!userRole) {
      userRole = await this.rolesService.createRole('USER');
    }
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: [userRole],
    });
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user.roles.map((role) => role.name);
  }

  async assignRoleToUser(userId: number, roleName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const role = await this.rolesService.findRoleByName(roleName);
    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }
    if (user.roles.some((el) => el.id === role.id)) {
      throw new ConflictException('Такая роль уже есть у пользователя');
    }
    user.roles.push(role);
    return this.userRepository.save(user);
  }
}
