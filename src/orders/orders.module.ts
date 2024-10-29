import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ORDER_SERVICE, envs } from '../config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ordersMicroserviceHost,
          port: envs.ordersMicroservicePort,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
})
export class OrdersModule { }
