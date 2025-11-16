import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
      order: { createdAt: 'DESC' },
    });
    return { 
      data: result, 
      total,
      page: parseInt(page as any),
      limit: parseInt(limit as any),
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number) {
    const post = await this.postsRepo.findOne({ 
      where: { id }, 
      relations: ['author', 'comments', 'comments.author'] 
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, postData: Partial<Post>, userId: number) {
    const post = await this.postsRepo.findOne({ 
      where: { id }, 
      relations: ['author'] 
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    await this.postsRepo.update(id, postData);
    return this.postsRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async remove(id: number, userId: number) {
    const post = await this.postsRepo.findOne({ 
      where: { id }, 
      relations: ['author'] 
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postsRepo.remove(post);
  }
}