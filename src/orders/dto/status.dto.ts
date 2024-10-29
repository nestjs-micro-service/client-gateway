import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusList } from '../enum/orders.enum';

export class StatusDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `valid values status are ${OrderStatusList}`,
  })
  status: string;
}
