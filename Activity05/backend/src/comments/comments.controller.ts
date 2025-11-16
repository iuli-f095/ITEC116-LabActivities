import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll() {
    return this.commentsService.findAll();
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: number) {
    return this.commentsService.findByPost(postId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() commentData: Partial<Comment>, @Request() req) {
    return this.commentsService.create({
      ...commentData,
      author: req.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: { content: string }, @Request() req) {
    return this.commentsService.update(id, body.content, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.commentsService.remove(id, req.user.id);
  }
}