import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from '../common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) { }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send({ cmd: 'createOrder' }, createOrderDto);
  }

  @Get()
  async findOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.ordersClient.send({ cmd: 'findAllOrders' }, orderPaginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOrderById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send({ cmd: 'findOneOrder' }, { id }),
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.ordersClient.send(
        { cmd: 'findAllOrders' },
        { status: statusDto.status, ...paginationDto },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send(
          { cmd: 'updateOrder' },
          { id, status: statusDto.status },
        ),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
