import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Posts per page (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Posts retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Sample Post',
            content: 'This is a sample post content',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            userId: 1,
            user: { id: 1, username: 'john_doe' },
            comments: []
          }
        ],
        meta: {
          total: 1,
          page: 1,
          last_page: 1
        }
      }
    }
  })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.postsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Post created successfully',
    schema: {
      example: {
        id: 1,
        title: 'New Post',
        content: 'This is the content of the new post',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        userId: 1
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not logged in' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Post updated successfully',
    schema: {
      example: {
        id: 1,
        title: 'Updated Post Title',
        content: 'Updated post content',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        userId: 1
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not logged in' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Post deleted successfully',
    schema: {
      example: {
        message: 'Post deleted successfully'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not logged in' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by a specific user' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Posts per page (default: 10)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User posts retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'User Post',
            content: 'This is a user post',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            userId: 1,
            comments: []
          }
        ],
        meta: {
          total: 1,
          page: 1,
          last_page: 1
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.postsService.findByUser(userId, page, limit);
  }
}