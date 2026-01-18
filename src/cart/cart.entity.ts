import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cart {
  @ApiProperty({ example: 1, description: 'Cart ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'user1', description: 'User identifier' })
  @Column()
  userId: string;

  @ApiProperty({
    example: [
      {
        productId: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        quantity: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        subtotal: 199.98,
      },
    ],
    description: 'Array of cart items',
  })
  @Column('json')
  items: CartItem[];

  @ApiProperty({ example: 199.98, description: 'Total cart amount' })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}
