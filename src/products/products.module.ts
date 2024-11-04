import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule { }

//Podemos dejar la definición de los MS con los que va a interactuar el gateway acá o por fuera (en el app.module por ej).
