import {
  IsString,
  IsNumber,
  IsPositive,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Bluetooth Headphones',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    maxLength: 500,
  })
  @IsUrl()
  @MaxLength(500)
  imageUrl: string;
}
