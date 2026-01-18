import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './order.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  async createOrder(
    userId: string,
    shippingAddress: string,
    paymentMethod: string,
  ): Promise<Order> {
    const cart = await this.cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate stock and calculate total
    for (const item of cart.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    // Create order
    const order = this.ordersRepository.create({
      userId,
      status: 'pending' as OrderStatus,
      total: cart.total,
      shippingAddress,
      paymentMethod,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Update product stock
    for (const item of cart.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrder(id: number, userId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}
