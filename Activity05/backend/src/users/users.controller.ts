import { Controller, Put, Get, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id/username')
  @UseGuards(JwtAuthGuard)
  async updateUsername(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { username: string },
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      throw new Error('You can only update your own username');
    }

    return this.usersService.updateUsername(id, body.username);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      throw new Error('You can only view your own profile');
    }

    return this.usersService.getUserProfile(id);
  }
}