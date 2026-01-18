import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateUsername(userId: number, newUsername: string): Promise<User> {
    // Validate input
    if (!newUsername || newUsername.trim().length < 3) {
      throw new BadRequestException('Username must be at least 3 characters long');
    }

    // Check if username already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username: newUsername },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Username already taken');
    }

    // Find the user
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = newUsername.trim();
    
    const updatedUser = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}