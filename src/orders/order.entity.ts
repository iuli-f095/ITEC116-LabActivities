import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @ApiProperty({ example: 1, description: 'Order ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'user1', description: 'User identifier' })
  @Column()
  userId: string;

  @ApiProperty({
    example: 'pending',
    description: 'Order status',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  @Column()
  status: OrderStatus;

  @ApiProperty({ example: 199.98, description: 'Order total amount' })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001, USA',
    description: 'Shipping address',
  })
  @Column()
  shippingAddress: string;

  @ApiProperty({
    example: 'credit_card',
    description: 'Payment method',
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
  })
  @Column()
  paymentMethod: string;

  @ApiProperty({ type: () => [OrderItem], description: 'Order items' })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

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

@Entity()
export class OrderItem {
  @ApiProperty({ example: 1, description: 'Order item ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  @Column()
  productId: number;

  @ApiProperty({
    example: 'Wireless Bluetooth Headphones',
    description: 'Product name at time of order',
  })
  @Column()
  name: string;

  @ApiProperty({ example: 99.99, description: 'Price at time of order' })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  @Column()
  quantity: number;

  @ApiProperty({
    example: 199.98,
    description: 'Item subtotal (price × quantity)',
  })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotal: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ example: 1, description: 'Order ID reference' })
  @Column()
  orderId: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
