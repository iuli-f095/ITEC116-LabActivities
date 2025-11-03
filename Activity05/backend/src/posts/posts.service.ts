import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  async create(data: Partial<Post>) {
    const post = this.postsRepo.create(data);
    return this.postsRepo.save(post);
  }

  async findAll(page = 1, limit = 5) {
    const [result, total] = await this.postsRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
    return { data: result, total };
  }

  async findOne(id: number) {
    return this.postsRepo.findOne({ where: { id }, relations: ['author', 'comments'] });
  }
}
