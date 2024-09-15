import { Controller, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() { }

  @Post()
  createProduct() {
    return 'Product created';
  }
}
