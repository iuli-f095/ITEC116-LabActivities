import { Body, Controller, Get, Param, Post as PostMethod } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @PostMethod()
  create(@Param('postId') postId: number, @Body() body: any) {
    return this.commentsService.create({ ...body, post: { id: postId } });
  }

  @Get()
  findByPost(@Param('postId') postId: number) {
    return this.commentsService.findByPost(postId);
  }
}
