import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      // Return user without password
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string; user: any }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(userData: CreateUserDto): Promise<{ access_token: string; user: any }> {
    const existingUser = await this.usersService.findOne(userData.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const existingEmail = await this.usersService.findOneByEmail(userData.email);
    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create(userData);
    // Create user object without password
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return this.login(userWithoutPassword);
  }
}