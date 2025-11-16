import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.postsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() postData: Partial<PostEntity>, @Request() req) {
    return this.postsService.create({
      ...postData,
      author: req.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() postData: Partial<PostEntity>, @Request() req) {
    return this.postsService.update(id, postData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.postsService.remove(id, req.user.id);
  }
}