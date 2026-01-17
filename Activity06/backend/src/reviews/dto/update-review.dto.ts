import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'Updated review comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}