import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Product ID to update',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    description: 'New quantity (0 to remove item)',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}