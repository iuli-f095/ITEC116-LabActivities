import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TMDBService {
  private readonly logger = new Logger(TMDBService.name);
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;
  private readonly accessToken: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
    this.accessToken = this.configService.get<string>('TMDB_ACCESS_TOKEN') || '';
  }

  private getOptions() {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  // Helper to build URL with query params
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    // Use API key in query params for v3 API
    url.searchParams.append('api_key', this.apiKey);
    
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return url.toString();
  }

  async searchMovies(query: string) {
    try {
      const url = this.buildUrl('/search/movie', { query });
      const response = await fetch(url, this.getOptions());

      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      this.logger.error(`Error searching TMDB: ${error.message}`);
      return [];
    }
  }

  async getMovieDetails(tmdbId: number) {
    try {
      const url = this.buildUrl(`/movie/${tmdbId}`);
      const response = await fetch(url, this.getOptions());

      if (response.status === 404) return null;
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Error fetching movie details ${tmdbId}: ${error.message}`);
      return null;
    }
  }

  async getMovieCredits(tmdbId: number) {
    try {
      const url = this.buildUrl(`/movie/${tmdbId}/credits`);
      const response = await fetch(url, this.getOptions());

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      this.logger.error(`Error fetching credits for ${tmdbId}: ${error.message}`);
      return null;
    }
  }

  async getPopularMovies() {
    try {
      const url = this.buildUrl('/movie/popular');
      const response = await fetch(url, this.getOptions());

      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      this.logger.error(`Error fetching popular movies: ${error.message}`);
      return [];
    }
  }

  async getLatestMovies() {
    try {
      const url = this.buildUrl('/movie/now_playing');
      const response = await fetch(url, this.getOptions());

      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      this.logger.error(`Error fetching latest movies: ${error.message}`);
      return [];
    }
  }}