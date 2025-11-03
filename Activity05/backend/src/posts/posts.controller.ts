import { Body, Controller, Get, Param, Post as PostMethod, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @PostMethod()
  create(@Body() body: any) {
    return this.postsService.create(body);
  }

  @Get()
  findAll(@Query('page') page: number) {
    return this.postsService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }
}
