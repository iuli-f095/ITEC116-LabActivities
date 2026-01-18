import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { TMDBService } from '../shared/tmdb.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';


@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private tmdbService: TMDBService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return await this.moviesRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });
    
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    
    return movie;
  }

  async findByTMDBId(tmdbId: number): Promise<Movie | null> {
    return await this.moviesRepository.findOne({
      where: { tmdb_id: tmdbId },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.moviesRepository.update(id, updateMovieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.moviesRepository.delete(id);
  }

  async fetchFromTMDB(query: string): Promise<any[]> {
    if (query === 'popular') {
        return await this.tmdbService.getPopularMovies();
    }
    if (query === 'latest') {
        return await this.tmdbService.getLatestMovies();
    }
    return await this.tmdbService.searchMovies(query);
  }

  async seedMovieFromTMDB(tmdbId: number): Promise<Movie> {
    // 1. Check if movie already exists locally
    const existingMovie = await this.findByTMDBId(tmdbId);
    if (existingMovie) {
      return existingMovie;
    }

    // 2. Fetch Details from TMDB
    const tmdbData = await this.tmdbService.getMovieDetails(tmdbId);
    if (!tmdbData) {
      throw new NotFoundException(`Movie with TMDB ID ${tmdbId} not found in TMDB`);
    }

    // 3. Fetch Credits
    const credits = await this.tmdbService.getMovieCredits(tmdbId);
    
    // 4. Map Data safely
    const director = credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Unknown';
    const actors = credits?.cast?.slice(0, 5).map((actor: any) => actor.name).join(', ') || '';
    const genres = tmdbData.genres?.map((genre: any) => genre.name).join(', ') || '';
    
    const movieData = {
      tmdb_id: tmdbData.id,
      title: tmdbData.title || 'Untitled',
      overview: tmdbData.overview || '',
      poster_path: tmdbData.poster_path || '',
      backdrop_path: tmdbData.backdrop_path || '',
      release_date: tmdbData.release_date || new Date().toISOString().split('T')[0],
      runtime: tmdbData.runtime || 0,
      director: director,
      actors: actors,
      genres: genres,
      age_rating: tmdbData.adult ? 'R' : 'PG-13',
      vote_average: tmdbData.vote_average || 0,
    };

    // 5. Save
    const movie = await this.create(movieData);
    this.logger.log(`Seeded movie: ${movie.title}`);
    return movie;
  }

  async getAverageRating(movieId: number): Promise<number> {
    const movie = await this.findOne(movieId);
    if (!movie.reviews || movie.reviews.length === 0) return 0;
    
    const sum = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / movie.reviews.length).toFixed(1));
  }
}