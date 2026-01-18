import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Art of War',
    description: 'Title of the book',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A timeless strategy book written by Sun Tzu.',
    description: 'Short description of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2025,
    description: 'Year the book was published',
  })
  @IsInt()
  publishedYear: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the author (foreign key)',
  })
  @IsInt()
  authorId: number;

  @ApiProperty({
    example: 2,
    description: 'The ID of the category (foreign key)',
  })
  @IsInt()
  categoryId: number;
}
