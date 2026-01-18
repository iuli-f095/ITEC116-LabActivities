import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { Cart } from '../cart/cart.entity';
import { Order, OrderItem } from '../orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // Change to your MySQL password
      database: 'ecommerce_db',
      entities: [Product, Cart, Order, OrderItem],
      synchronize: true, // set to false in production
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
