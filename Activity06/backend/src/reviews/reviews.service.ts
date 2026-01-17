import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { MoviesService } from '../movies/movies.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private moviesService: MoviesService,
  ) {}

  async create(userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        user_id: userId,
        movie_id: createReviewDto.movie_id,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this movie');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      user_id: userId,
    });

    const savedReview = await this.reviewsRepository.save(review);
    
    // Update movie's average rating
    const avgRating = await this.getAverageRating(createReviewDto.movie_id);
    await this.moviesService.update(createReviewDto.movie_id, {
      vote_average: avgRating,
    });

    const foundReview = await this.reviewsRepository.findOne({
      where: { id: (savedReview as any).id },
      relations: ['user'],
    });

    if (!foundReview) {
      throw new NotFoundException('Review not found after creation');
    }

    return foundReview;
  }

  async findAllByMovie(movieId: number): Promise<Review[]> {
    const reviews = await this.reviewsRepository.find({
      where: { movie_id: movieId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
    return reviews;
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'movie'],
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    return review;
  }

  async update(id: number, userId: number, updateReviewDto: any): Promise<Review> {
    const review = await this.findOne(id);
    
    if (review.user_id !== userId) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.update(id, updateReviewDto);
    
    // Update movie's average rating
    const avgRating = await this.getAverageRating(review.movie_id);
    await this.moviesService.update(review.movie_id, {
      vote_average: avgRating,
    });

    const updatedReview = await this.findOne(id);
    return updatedReview;
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const review = await this.findOne(id);
    
    if (review.user_id !== userId) {
      throw new NotFoundException('Review not found');
    }

    const movieId = review.movie_id;
    await this.reviewsRepository.delete(id);
    
    // Update movie's average rating
    const avgRating = await this.getAverageRating(movieId);
    await this.moviesService.update(movieId, {
      vote_average: avgRating,
    });

    return { message: 'Review deleted successfully' };
  }

  async getAverageRating(movieId: number): Promise<number> {
    const reviews = await this.findAllByMovie(movieId);
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    const reviews = await this.reviewsRepository.find({
      where: { user_id: userId },
      relations: ['user', 'movie'],
      order: { created_at: 'DESC' },
    });
    return reviews;
  }
}