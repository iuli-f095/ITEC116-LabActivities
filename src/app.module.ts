import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    SeedModule,
  ],
})
export class AppModule {}