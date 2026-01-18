import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './cart.entity';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user cart',
    description: 'Retrieve the shopping cart for a user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: Cart,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/add')
  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add a product to the shopping cart',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 200, description: 'Item added to cart', type: Cart })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient stock',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(
      userId,
      addToCartDto.productId,
      addToCartDto.quantity,
    );
  }

  @Patch(':userId/update')
  @ApiOperation({
    summary: 'Update cart item',
    description: 'Update quantity of an item in the cart',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: Cart,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient stock',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found in cart or product not found',
  })
  updateCartItem(
    @Param('userId') userId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      userId,
      updateCartItemDto.productId,
      updateCartItemDto.quantity,
    );
  }

  @Delete(':userId/item/:productId')
  @ApiOperation({
    summary: 'Remove item from cart',
    description: 'Remove a specific item from the cart',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID to remove',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  removeItemFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(userId, +productId);
  }

  @Delete(':userId/clear')
  @ApiOperation({
    summary: 'Clear cart',
    description: 'Remove all items from the cart',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
