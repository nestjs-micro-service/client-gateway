import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'createProduct' }, createProductDto);
  }

  @Get()
  findProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllProducts' }, paginationDto);
  }

  @Get(':id')
  async findProductById(@Param('id') id: number) {
    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'findOneProduct' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'deleteProduct' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'updateProduct' }, { ...updateProductDto, id })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
