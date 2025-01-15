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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from '../common';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'createOrder' }, createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send({ cmd: 'findAllOrders' }, orderPaginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  @UseGuards(AuthGuard)
  async findOrderById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'findOneOrder' }, { id }),
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  @UseGuards(AuthGuard)
  async findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.client.send(
        { cmd: 'findAllOrders' },
        { status: statusDto.status, ...paginationDto },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send(
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
