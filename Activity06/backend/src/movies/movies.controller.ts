import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a movie' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update movie' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }

  @Get('tmdb/search')
  @ApiOperation({ summary: 'Search movies in TMDB' })
  @ApiQuery({ name: 'query', required: true })
  searchTMDB(@Query('query') query: string) {
    return this.moviesService.fetchFromTMDB(query);
  }

  @Post('tmdb/seed/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed movie from TMDB' })
  seedFromTMDB(@Param('tmdbId') tmdbId: string) {
    return this.moviesService.seedMovieFromTMDB(+tmdbId);
  }

  @Get('tmdb/details/:tmdbId')
  @ApiOperation({ summary: 'Get movie details from TMDB and seed if not in DB' })
  async getTMDBDetails(@Param('tmdbId') tmdbId: string) {
    const movie = await this.moviesService.findByTMDBId(+tmdbId);
    if (movie) {
      return movie;
    }
    // Seed it
    return this.moviesService.seedMovieFromTMDB(+tmdbId);
  }
}