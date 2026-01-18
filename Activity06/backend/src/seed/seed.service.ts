import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { TMDBService } from '../shared/tmdb.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private tmdbService: TMDBService,
  ) {}

  async onModuleInit() {
    await this.seedMovies();
  }

  async seedMovies() {
    const count = await this.moviesRepository.count();
    
    if (count === 0) {
      this.logger.log('No movies found. Seeding initial data from TMDB...');
      
      const popularMovies = await this.tmdbService.getPopularMovies();
      
      // Seed top 10 movies
      for (const movieData of popularMovies.slice(0, 10)) { 
        const existingMovie = await this.moviesRepository.findOne({
          where: { tmdb_id: movieData.id },
        });
        
        if (!existingMovie) {
           // We manually fetch details for every movie to get genres/runtime correctly
           await this.seedSingleMovie(movieData.id);
        }
      }
      this.logger.log('Seeding complete!');
    }
  }

  private async seedSingleMovie(tmdbId: number) {
      const tmdbData = await this.tmdbService.getMovieDetails(tmdbId);
      if(!tmdbData) return;

      const credits = await this.tmdbService.getMovieCredits(tmdbId);

      const director = credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'Unknown';
      const actors = credits?.cast?.slice(0, 5).map((actor: any) => actor.name).join(', ') || '';
      const genres = tmdbData.genres?.map((genre: any) => genre.name).join(', ') || '';

      const movie = this.moviesRepository.create({
        tmdb_id: tmdbData.id,
        title: tmdbData.title,
        overview: tmdbData.overview,
        poster_path: tmdbData.poster_path,
        backdrop_path: tmdbData.backdrop_path,
        release_date: tmdbData.release_date,
        runtime: tmdbData.runtime || 0,
        director: director,
        actors: actors,
        genres: genres,
        age_rating: tmdbData.adult ? 'R' : 'PG-13',
        vote_average: tmdbData.vote_average
      });

      await this.moviesRepository.save(movie);
  }
}