import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'User identifier',
    example: 'user1',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  userId: string;

  @ApiProperty({
    description: 'Complete shipping address',
    example: '123 Main St, New York, NY 10001, USA',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  shippingAddress: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'credit_card',
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
