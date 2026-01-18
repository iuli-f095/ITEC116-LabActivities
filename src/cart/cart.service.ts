import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './cart.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [], total: 0 });
      return this.cartRepository.save(cart);
    }
    return cart;
  }

  async addToCart(
    userId: string,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const product = await this.productsService.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getCart(userId);
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal =
        cart.items[existingItemIndex].price *
        cart.items[existingItemIndex].quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
        subtotal: product.price * quantity,
      };
      cart.items.push(newItem);
    }

    cart.total = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async updateCartItem(
    userId: string,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await this.productsService.findOne(productId);
      if (product.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
    }

    cart.total = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async removeFromCart(userId: string, productId: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.total = 0;
    await this.cartRepository.save(cart);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }
}
