import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        user: {
          id: true,
          username: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            id: true,
            username: true,
          }
        }
      }
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
      select: {
        user: {
          id: true,
          username: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            id: true,
            username: true,
          }
        }
      }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      user,
    });

    return await this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new UnauthorizedException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return await this.postsRepository.save(post);
  }

  async remove(id: number, userId: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10) {
    const [posts, total] = await this.postsRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'comments'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }
}