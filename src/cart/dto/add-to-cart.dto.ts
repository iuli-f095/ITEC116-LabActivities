import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'Quantity to add',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
