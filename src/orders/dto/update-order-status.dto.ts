import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    example: 'processing',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  @IsString()
  @IsIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: string;
}
