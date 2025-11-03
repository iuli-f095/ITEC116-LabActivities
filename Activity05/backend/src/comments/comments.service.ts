import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentsRepo: Repository<Comment>) {}

  async create(data: Partial<Comment>) {
    const comment = this.commentsRepo.create(data);
    return this.commentsRepo.save(comment);
  }

  async findAll() {
    return this.commentsRepo.find({ relations: ['author', 'post'] });
  }

  async findOne(id: number) {
    return this.commentsRepo.findOne({ where: { id }, relations: ['author', 'post'] });
  }

  async findByPost(postId: number) {
    return this.commentsRepo.find({ where: { post: { id: postId } },
    relations: ['author', 'post'],
    order: { createdAt: 'DESC' },
  });
  
}

}
