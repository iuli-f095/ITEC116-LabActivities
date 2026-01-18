import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 12345 })
  @IsNumber()
  tmdb_id: number;

  @ApiProperty({ example: 'The Movie Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Movie overview...' })
  @IsString()
  overview: string;

  @ApiProperty({ example: '/path/to/poster.jpg' })
  @IsString()
  poster_path: string;

  @ApiProperty({ example: '/path/to/backdrop.jpg' })
  @IsString()
  backdrop_path: string;

  @ApiProperty({ example: '2023-12-15' })
  @IsDateString()
  release_date: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  runtime: number;

  @ApiProperty({ example: 'Director Name' })
  @IsString()
  director: string;

  @ApiProperty({ example: 'Actor 1, Actor 2, Actor 3' })
  @IsString()
  actors: string;

  @ApiProperty({ example: 'Action, Adventure, Sci-Fi' })
  @IsString()
  genres: string;

  @ApiProperty({ example: 'PG-13' })
  @IsString()
  age_rating: string;

  @ApiProperty({ example: 7.5, required: false })
  @IsOptional()
  @IsNumber()
  vote_average?: number;
}