import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.usersRepository.findOne({ where: { username } });
    if (existing) throw new UnauthorizedException('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashed });
    return this.usersRepository.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, username: user.username });
    return { access_token: token };
  }

  async validateUser(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
