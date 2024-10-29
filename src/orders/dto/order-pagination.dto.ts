import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common';
import { OrderStatus, OrderStatusList } from '../enum/orders.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Status must be a valid value: ${OrderStatusList}`,
  })
  status: OrderStatus;
}
