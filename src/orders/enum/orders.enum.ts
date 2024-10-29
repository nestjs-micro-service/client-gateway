//To centralize all status Orders possible

export enum OrderStatus {
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  PENDING = 'PENDING',
}

export const OrderStatusList = [
  OrderStatus.CANCELLED,
  OrderStatus.DELIVERED,
  OrderStatus.PENDING,
];
