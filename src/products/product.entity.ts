import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Wireless Bluetooth Headphones',
    description: 'Product name',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'High-quality wireless headphones with noise cancellation',
    description: 'Product description',
  })
  @Column('text')
  description: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock quantity' })
  @Column()
  stock: number;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    description: 'Product image URL',
  })
  @Column()
  imageUrl: string;

  @ApiProperty({ example: true, description: 'Whether the product is active' })
  @Column({ default: true })
  isActive: boolean;

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
