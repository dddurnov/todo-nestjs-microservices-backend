import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { isValid: true, user: decoded };
    } catch (err) {
      console.error('Token validation failed:', err.message);
      return { isValid: false };
    }
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new UnauthorizedException();
    }
    return this.userService.createUser(email, password);
  }
}
