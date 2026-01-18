import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new order',
    description:
      'Create an order from the current cart. This will:\n1. Validate cart has items\n2. Check stock availability\n3. Create order\n4. Update product stock\n5. Clear the cart',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Cart is empty or insufficient stock',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(
      createOrderDto.userId,
      createOrderDto.shippingAddress,
      createOrderDto.paymentMethod,
    );
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user orders',
    description: 'Retrieve all orders for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiResponse({ status: 200, description: 'List of orders', type: [Order] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getOrders(@Param('userId') userId: string) {
    return this.ordersService.getOrders(userId);
  }

  @Get(':userId/:id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve a specific order for a user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user1',
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getOrder(
    @Param('userId') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.getOrder(id, userId);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of an order (admin function)',
  })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      updateOrderStatusDto.status as any,
    );
  }
}
