import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty({ example: 12345, required: false })
  @IsOptional()
  @IsNumber()
  tmdb_id?: number;

  @ApiProperty({ example: 'The Movie Title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Movie overview...', required: false })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({ example: '/path/to/poster.jpg', required: false })
  @IsOptional()
  @IsString()
  poster_path?: string;

  @ApiProperty({ example: '/path/to/backdrop.jpg', required: false })
  @IsOptional()
  @IsString()
  backdrop_path?: string;

  @ApiProperty({ example: '2023-12-15', required: false })
  @IsOptional()
  @IsDateString()
  release_date?: string;

  @ApiProperty({ example: 120, required: false })
  @IsOptional()
  @IsNumber()
  runtime?: number;

  @ApiProperty({ example: 'Director Name', required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ example: 'Actor 1, Actor 2, Actor 3', required: false })
  @IsOptional()
  @IsString()
  actors?: string;

  @ApiProperty({ example: 'Action, Adventure, Sci-Fi', required: false })
  @IsOptional()
  @IsString()
  genres?: string;

  @ApiProperty({ example: 'PG-13', required: false })
  @IsOptional()
  @IsString()
  age_rating?: string;

  @ApiProperty({ example: 7.5, required: false })
  @IsOptional()
  @IsNumber()
  vote_average?: number;
}